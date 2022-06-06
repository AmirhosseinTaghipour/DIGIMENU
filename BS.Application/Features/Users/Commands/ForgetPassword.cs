using BS.Application.Common;
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
    public class ForgetPassword
    {
        public class ForgetPasswordCommand : IRequest<ResultDTO<string>>
        {
            public string UserName { get; set; }
            public string Mobile { get; set; }
            public string CaptchaText { get; set; }
            public string Token { get; set; }
        }

        public class ForgetPasswordHandler : IRequestHandler<ForgetPasswordCommand, ResultDTO<string>>
        {
            private readonly IUnitOfWork _unitOfWork;
            private readonly IPasswordHelper _passwordHelper;
            private readonly ISMSService _smsService;
            private readonly ICaptcha _captcha;
            private readonly IConfiguration _configuration;

            public ForgetPasswordHandler(IUnitOfWork unitOfWork, IUserAccessor userAccessor, IPasswordHelper passwordHelper, ISMSService smsService, ICaptcha captcha, IConfiguration configuration)
            {
                _unitOfWork = unitOfWork;
                _passwordHelper = passwordHelper;
                _smsService = smsService;
                _captcha = captcha;
                _configuration = configuration;
            }
            public async Task<ResultDTO<string>> Handle(ForgetPasswordCommand request, CancellationToken cancellationToken)
            {
                if (!_captcha.ValidateCaptchaCode(request.CaptchaText, request.Token))
                {
                    throw new RestException(HttpStatusCode.BadRequest, "خطا در پردازش تصویر امنیتی");
                }

                var user = await _unitOfWork.userRepositoryAsync.GetFirstAsync(n => n.Username == request.UserName.ToLower().Trim() && n.Mobile == request.Mobile.Trim() && n.IsDeleted == false);
                if (user == null)
                    throw new RestException(HttpStatusCode.NotFound, "خطا، اطلاعات تطابق ندارد");
               
                var previewsMinutes = DateTime.Now.AddMinutes(-30);
                var allowedSMSCount= int.Parse(_configuration["ProjectConfig:allowedSMSCountPer30Min"].ToString());
                var smsCount = await _unitOfWork.smsLogRepositoryAsync.LastSendedSMSCount(user.Id, previewsMinutes);
                if (smsCount >= allowedSMSCount)
                    throw new RestException(HttpStatusCode.BadRequest, "در 30 دقیقه اخیر، 3 پیامک برای شما ارسال شده است. 30 دقیقه بعد مجددا اقدام نمائید.");

                var code = _smsService.GenerateConfirmCode(5);
                int expireDuration = int.Parse(_configuration["ProjectConfig:ExpireDuration"].ToString());
                user.ActivationCode = code;
                user.CodeExpiredTime = DateTime.Now.AddMinutes(expireDuration);
                user.UpdateDate = DateTime.Now;
                user.UpdateUser = request.UserName.ToLower().Trim();
                _unitOfWork.userRepositoryAsync.Update(user);
                var success = await _unitOfWork.SaveAsync() > 0;
                if (success)
                {
                    StringBuilder message = new StringBuilder();
                    message.AppendLine($"کد باز یابی رمز عبور : {code}");
                    message.AppendLine("دیجی منو");

                    var smsRequest = new SMSRequest()
                    {
                        To = user.Mobile,
                        Body = message.ToString().TrimEnd(),
                        Type = "forgot-password",
                        UserId = user.Id.ToString().ToLower(),
                        UserName = user.Username,
                        KeyParam = code
                    };
                    await _smsService.SendSMSAsync(smsRequest);
                    return new ResultDTO<string>(HttpStatusCode.OK, "عملیات موفق، کد بازیابی کلمه عبور برای شما پیامک شد.", user.Id.ToString());
                }

                throw new RestException(HttpStatusCode.BadRequest, "خطا در ثبت ارسال");
            }
        }
    }
}
