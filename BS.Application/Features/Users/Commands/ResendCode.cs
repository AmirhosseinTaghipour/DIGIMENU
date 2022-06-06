using BS.Application.Common.DTOs;
using BS.Application.Common.Models;
using BS.Application.Interfaces;
using BS.Application.Interfaces.Repositories;
using MediatR;
using Microsoft.Extensions.Configuration;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Net;
using System.Text;
using System.Threading;
using System.Threading.Tasks;

namespace BS.Application.Features.Users.Commands
{
    public class ResendCode
    {
        public class ResendCodeCommand : IRequest<ResultDTO<string>>
        {
            public string UserName { get; set; }
            public string Mobile { get; set; }
            public bool IsChangePasswordMode { get; set; }
            public string CaptchaText { get; set; }
            public string Token { get; set; }

        }

        public class ResendCodedHandler : IRequestHandler<ResendCodeCommand, ResultDTO<string>>
        {
            private readonly IUnitOfWork _unitOfWork;
            private readonly IUserAccessor _userAccessor;
            private readonly IPasswordHelper _passwordHelper;
            private readonly ISMSService _smsService;
            private readonly IConfiguration _configuration;
            private readonly ICaptcha _captcha;


            public ResendCodedHandler(IUnitOfWork unitOfWork, IUserAccessor userAccessor, IPasswordHelper passwordHelper, ISMSService smsService, IConfiguration configuration, ICaptcha captcha)
            {
                _unitOfWork = unitOfWork;
                _userAccessor = userAccessor;
                _passwordHelper = passwordHelper;
                _smsService = smsService;
                _configuration = configuration;
                _captcha = captcha;
            }
            public async Task<ResultDTO<string>> Handle(ResendCodeCommand request, CancellationToken cancellationToken)
            {
                if (!_captcha.ValidateCaptchaCode(request.CaptchaText, request.Token))
                {
                    throw new RestException(HttpStatusCode.BadRequest, "خطا در پردازش تصویر امنیتی");
                }
                var user = await _unitOfWork.userRepositoryAsync.GetFirstAsync(n => n.Username == request.UserName.ToLower().Trim() && n.Mobile == request.Mobile.Trim() && n.IsDeleted == false);
                if (user == null)
                    throw new RestException(HttpStatusCode.NotFound, "خطا، اطلاعات تطابق ندارد");

                var previewsMinutes = DateTime.Now.AddMinutes(-30);

                var smsCount = await _unitOfWork.smsLogRepositoryAsync.LastSendedSMSCount(user.Id, previewsMinutes);
                var allowedSMSCount = int.Parse(_configuration["ProjectConfig:allowedSMSCountPer30Min"].ToString());

                if (smsCount >= allowedSMSCount)
                    throw new RestException(HttpStatusCode.BadRequest, "در 30 دقیقه اخیر، 3 پیامک برای شما ارسال شده است. 30 دقیقه بعد مجددا اقدام نمائید.");


                var code = _smsService.GenerateConfirmCode(5);
                int expireDuration = int.Parse(_configuration["ProjectConfig:ExpireDuration"].ToString());
                user.ActivationCode = code;
                user.CodeExpiredTime = DateTime.Now.AddMinutes(expireDuration);
                user.UpdateDate = DateTime.Now;
                user.UpdateUser = user.Username;
                _unitOfWork.userRepositoryAsync.Update(user);
                var success = await _unitOfWork.SaveAsync() > 0;
                if (success)
                {
                    StringBuilder message = new StringBuilder();
                    if (request.IsChangePasswordMode)
                        message.AppendLine($"کد باز یابی رمز عبور : {code}");
                    else
                        message.AppendLine($"کد فعال سازی : {code}");

                    message.AppendLine("دیجی منو");

                    var smsRequest = new SMSRequest()
                    {
                        To = user.Mobile,
                        Body = message.ToString().TrimEnd(),
                        Type = request.IsChangePasswordMode ? "forgot-password" : "register",
                        UserId = user.Id.ToString().ToLower(),
                        UserName = user.Username,
                        KeyParam = code
                    };
                    await _smsService.SendSMSAsync(smsRequest);
                    if (request.IsChangePasswordMode)
                        return new ResultDTO<string>(HttpStatusCode.OK, "عملیات موفق، کد بازیابی کلمه عبور برای شما پیامک شد.", user.Id.ToString());
                    else
                        return new ResultDTO<string>(HttpStatusCode.OK, "عملیات موفق، کد فعالسازی برای شما پیامک شد.", user.Id.ToString());

                }

                throw new RestException(HttpStatusCode.BadRequest, "خطا در ثبت ارسال");
            }

        }
    }
}
