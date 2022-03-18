using BPJ.LMSR.Application.Common;
using BS.Application.Common;
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

    public class SetChangeMobile
    {
        public class SetChangeMobileCommand : IRequest<ResultDTO<string>>
        {
            public string Mobile { get; set; }
            public string CaptchaText { get; set; }
            public string Token { get; set; }
        }

        public class SetChangeMobiledHandler : IRequestHandler<SetChangeMobileCommand, ResultDTO<string>>
        {
            private readonly IUnitOfWork _unitOfWork;
            private readonly IPasswordHelper _passwordHelper;
            private readonly IUserAccessor _userAccessor;
            private readonly ISMSService _smsService;
            private readonly ICaptcha _captcha;
            private readonly IConfiguration _configuration;

            public SetChangeMobiledHandler(IUnitOfWork unitOfWork, IUserAccessor userAccessor, IPasswordHelper passwordHelper, ISMSService smsService, ICaptcha captcha, IConfiguration configuration)
            {
                _unitOfWork = unitOfWork;
                _passwordHelper = passwordHelper;
                _smsService = smsService;
                _captcha = captcha;
                _userAccessor = userAccessor;
                _configuration = configuration;
            }
            public async Task<ResultDTO<string>> Handle(SetChangeMobileCommand request, CancellationToken cancellationToken)
            {
                if (!_captcha.ValidateCaptchaCode(request.CaptchaText, request.Token))
                {
                    throw new RestException(HttpStatusCode.BadRequest, "خطا در پردازش تصویر امنیتی");
                }

                var user = await _unitOfWork.userRepositoryAsync.GetByIdAsync(_userAccessor.GetCurrentUserId());
                if (user == null)
                    throw new RestException(HttpStatusCode.NotFound, "خطا، اطلاعات تطابق ندارد");
                var confirmCode = _smsService.GenerateConfirmCode(5);
                int expireDuration = int.Parse(_configuration["ProjectConfig:ExpireDuration"].ToString());

                user.Mobile = request.Mobile;
                user.IsMobileConfirmed = false;
                user.UpdateDate = DateTime.Now;
                user.UpdateUser = _userAccessor.GetCurrentUserName();
                user.ActivationCode = confirmCode;
                user.CodeExpiredTime = DateTime.Now.AddSeconds(expireDuration);

                _unitOfWork.userRepositoryAsync.Update(user);
                var success = await _unitOfWork.SaveAsync() > 0;
                if (success)
                {
                    StringBuilder message = new StringBuilder();
                    message.AppendLine($"کد تایید: : {confirmCode.ToLower().Trim()}");
                    message.AppendLine("دیجی منو");

                    var smsRequest = new SMSRequest()
                    {
                        To = user.Mobile,
                        Body = message.ToString()
                    };
                    await _smsService.SendSMSAsync(smsRequest);
                    return new ResultDTO<string>(HttpStatusCode.OK, "عملیات ثبت با موفقیت انجام شد");
                }
                throw new RestException(HttpStatusCode.BadRequest, "خطا در ثبت عملیات");
            }
        }
    }
}