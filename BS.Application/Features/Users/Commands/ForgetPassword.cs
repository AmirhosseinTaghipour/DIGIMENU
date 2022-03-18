using BPJ.LMSR.Application.Common;
using BS.Application.Common;
using BS.Application.Interfaces;
using BS.Application.Interfaces.Repositories;
using MediatR;
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

            public ForgetPasswordHandler(IUnitOfWork unitOfWork, IUserAccessor userAccessor, IPasswordHelper passwordHelper, ISMSService smsService, ICaptcha captcha)
            {
                _unitOfWork = unitOfWork;
                _passwordHelper = passwordHelper;
                _smsService = smsService;
                _captcha = captcha;
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

                var passwordSalt = _passwordHelper.GenerateSalt();
                var password = _smsService.GenerateConfirmCode(6);
                var hashedPassword = _passwordHelper.GetEncryptedPassword(password, passwordSalt);

                user.Password = hashedPassword;
                user.PasswordSalt = passwordSalt;
                user.UpdateDate = DateTime.Now;
                user.UpdateUser = request.UserName.ToLower().Trim();
                _unitOfWork.userRepositoryAsync.Update(user);
                var success = await _unitOfWork.SaveAsync() > 0;
                if (success)
                {
                    StringBuilder message = new StringBuilder();
                    message.AppendLine("دیجی منو");
                    message.AppendLine($"نام کاربری : {request.UserName.ToLower().Trim()}");
                    message.AppendLine($"رمز عبور : {password}");

                    var smsRequest = new SMSRequest()
                    {
                        To = user.Mobile,
                        Body = message.ToString()
                    };
                    await _smsService.SendSMSAsync(smsRequest);
                    return new ResultDTO<string>(HttpStatusCode.OK, "فعالسازی با موفقیت انجام شد");
                }

                throw new RestException(HttpStatusCode.BadRequest, "خطا در ثبت عملیات");
            }
        }
    }
}
