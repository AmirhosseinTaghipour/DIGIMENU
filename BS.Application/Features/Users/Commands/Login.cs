using BS.Application.Common.Models;
using BS.Application.Features.Users.DTOs;
using BS.Application.Interfaces;
using BS.Application.Interfaces.Repositories;
using BS.Domain.Entities;
using MediatR;
using Microsoft.AspNetCore.Http;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Configuration;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Net;
using System.Net.Http;
using System.Text;
using System.Threading;
using System.Threading.Tasks;

namespace BS.Application.Features.Users.Commands
{
    public class Login
    {
        public class LoginCommand : IRequest<RefreshTokenDTO>
        {
            public string UserName { get; set; }
            public string Password { get; set; }
            public string CaptchaText { get; set; }
            public string Token { get; set; }
        }

        public class LoginHandler : IRequestHandler<LoginCommand, RefreshTokenDTO>
        {
            private readonly IUnitOfWork _unitOfWork;
            private readonly IPasswordHelper _passwordHelper;
            private readonly IHttpContextAccessor _httpContextAccessor;
            private readonly ICaptcha _captcha;
            private readonly IRefreshJwtToken _refreshJwtToken;
            private readonly IJwtGenerator _jwtGenerator;
            private readonly IPersianDate _persianDate;
            private readonly ISMSService _smsService;
            private readonly IConfiguration _configuration;

            public LoginHandler(IUnitOfWork unitOfWork, IPasswordHelper passwordHelper, ICaptcha captcha, IRefreshJwtToken refreshJwtToken, IJwtGenerator jwtGenerator, IHttpContextAccessor httpContextAccessor, IPersianDate persianDate, IConfiguration configuration, ISMSService smsService)
            {
                _unitOfWork = unitOfWork;
                _passwordHelper = passwordHelper;
                _refreshJwtToken = refreshJwtToken;
                _jwtGenerator = jwtGenerator;
                _captcha = captcha;
                _httpContextAccessor = httpContextAccessor;
                _persianDate = persianDate;
                _configuration = configuration;
                _smsService = smsService;

            }
            public async Task<RefreshTokenDTO> Handle(LoginCommand request, CancellationToken cancellationToken)
            {
                if (!_captcha.ValidateCaptchaCode(request.CaptchaText, request.Token))
                    throw new RestException(HttpStatusCode.BadRequest, "خطا در پردازش تصویر امنیتی!");


                var isUserExisted = _unitOfWork.userRepositoryAsync.Any(n => n.Username == request.UserName.ToLower().Trim());
                if (!isUserExisted)
                    throw new RestException(HttpStatusCode.NotFound, "کاربری با این نام کاربری وجود ندارد.");

                var user = await _unitOfWork.userRepositoryAsync.GetFirstAsync(n => n.Username == request.UserName.ToLower().Trim() && n.IsDeleted == false);
                var clientIp = _httpContextAccessor.HttpContext.Connection.RemoteIpAddress.ToString();
                var previewsMinutes = DateTime.Now.AddMinutes(-30);

                if (!user.IsActivated)
                {
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
                        message.AppendLine($"کد فعال سازی : {code}");
                        message.AppendLine("دیجی منو");

                        var smsRequest = new SMSRequest()
                        {
                            To = user.Mobile,
                            Body = message.ToString().TrimEnd(),
                            Type = "register",
                            UserId = user.Id.ToString().ToLower(),
                            UserName = user.Username,
                            KeyParam = code
                        };
                        await _smsService.SendSMSAsync(smsRequest);
                        throw new RestException(HttpStatusCode.PreconditionRequired, "حساب شما فعال نشده است، کد فعالسازی برای شما پیامک شد.");
                    }
                    throw new RestException(HttpStatusCode.BadRequest, "خطا در ارسال پیامک فعالسازی");

                }

                var passwordSalt = user.PasswordSalt;
                var password = request.Password.Trim();
                var hashedPassword = _passwordHelper.GetEncryptedPassword(password, passwordSalt);
                if (hashedPassword != user.Password)
                {
                    await _unitOfWork.userLogRepositoryAsync.AddAsync(new UserLog()
                    {
                        Id = Guid.NewGuid(),
                        UserId = user.Id,
                        StatusCode = 2,
                        InsertDate = DateTime.Now,
                        UserIp = clientIp,
                        LogDate = $"{_persianDate.toShamsi(DateTime.Now)}-{DateTime.Now.Hour:##}:{DateTime.Now.Minute:##}"
                    });
                    await _unitOfWork.SaveAsync();
                    throw new RestException(HttpStatusCode.Forbidden, "کلمه عبور اشتباه است.");
                }

                var lastSuccessfullLog = await _unitOfWork.userLogRepositoryAsync.LastSuccessfullLogin(user.Id, clientIp, previewsMinutes);
                previewsMinutes = lastSuccessfullLog == null ? previewsMinutes : lastSuccessfullLog.InsertDate;
                var lastUnsuccessfullLog = await _unitOfWork.userLogRepositoryAsync.LastUnsuccessfullLogin(user.Id, clientIp, previewsMinutes);
                if (lastUnsuccessfullLog.Count() > 5)
                {
                    throw new RestException(HttpStatusCode.Locked, "در ۳۰ دقیقه گذشته بیشتر از ۵ بار تلاش ناموفق برای ورود داشته اید! ۳۰ دقیقه بعد اقدام به ورود نمایید. ");
                }


                var currentUser = await (from vUser in _unitOfWork.userRepositoryAsync.Query()
                                         join vRole in _unitOfWork.roleRepositoryAsync.Query() on vUser.RoleId equals vRole.Id
                                         where vUser.Id == user.Id && vUser.IsDeleted == false && vUser.IsActivated == true
                                         select new 
                                         {
                                             UserId = vUser.Id.ToString().ToLower(),
                                             UserName = vUser.Username,
                                             RoleId = vUser.RoleId.ToString(),
                                             RoleCode = vRole.Code,

                                         }).AsNoTracking()
                               .FirstOrDefaultAsync();

                string refreshToken = _refreshJwtToken.CreateToken(user.Id, DateTime.Now.AddMinutes(30));
                string token = _jwtGenerator.CreateToken(user.Id, currentUser.RoleCode, user.Username, user.RoleId, DateTime.Now.AddMinutes(2));

                var tokenes = new RefreshTokenDTO()
                {
                    Token = token,
                    RefreshToken = refreshToken
                };
               

                await _unitOfWork.userLogRepositoryAsync.AddAsync(new UserLog()
                {
                    Id = Guid.NewGuid(),
                    UserId = user.Id,
                    StatusCode = 1,
                    InsertDate = DateTime.Now,
                    UserIp = clientIp,
                    LogDate = $"{_persianDate.toShamsi(DateTime.Now)}-{DateTime.Now.Hour:##}:{DateTime.Now.Minute:##}"
                });
                await _unitOfWork.SaveAsync();
                return tokenes;

            }
        }
    }
}
