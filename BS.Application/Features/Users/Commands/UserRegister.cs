using AutoMapper;
using BS.Application.Interfaces;
using BS.Application.Interfaces.Repositories;
using MediatR;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading;
using System.Threading.Tasks;
using BS.Domain.Entities;
using Microsoft.Extensions.Configuration;
using System.Net;
using BS.Application.Common.DTOs;
using BS.Application.Common.Models;

namespace BS.Application.Features.Users.Commands
{
    public class UserRegister
    {
        public class UserRegisterCommand : IRequest<ResultDTO<string>>
        {
            public string Name { get; set; }
            public string Mobile { get; set; }
            public string Username { get; set; }
            public string Password { get; set; }
            public string RepreatedPassword { get; set; }
            public string CaptchaText { get; set; }
            public string Token { get; set; }
        }

        public class UserRegisterHandler : IRequestHandler<UserRegisterCommand, ResultDTO<string>>
        {
            private readonly IUnitOfWork _unitOfWork;
            private readonly IPasswordHelper _passwordHelper;
            private readonly ISMSService _smsService;
            private readonly IMapper _mapper;
            private readonly IConfiguration _configuration;
            private readonly ICaptcha _captcha;

            public UserRegisterHandler(IUnitOfWork unitOfWork, IPasswordHelper passwordHelper, ISMSService smsService, IMapper mapper, IConfiguration configuration, ICaptcha captcha)
            {
                _unitOfWork = unitOfWork;
                _passwordHelper = passwordHelper;
                _smsService = smsService;
                _mapper = mapper;
                _configuration = configuration;
                _captcha = captcha;
            }


            public async Task<ResultDTO<string>> Handle(UserRegisterCommand request, CancellationToken cancellationToken)
            {
                if (!_captcha.ValidateCaptchaCode(request.CaptchaText, request.Token))
                    throw new RestException(HttpStatusCode.BadRequest, "خطا در پردازش تصویر امنیتی!");

                var checkExistUserName = _unitOfWork.userRepositoryAsync.Query().Any(n => n.Username == request.Username.ToLower());
                if (checkExistUserName)
                    throw new RestException(HttpStatusCode.BadRequest, "خطا، نام کاربری  تکراری است");

                if (request.Password != request.RepreatedPassword)
                    throw new RestException(HttpStatusCode.BadRequest, "تکرار کلمه عبور با کلمه عبور یکسان نیست");

                var user = _mapper.Map<User>(request);
                Guid userId = Guid.NewGuid();
                Guid roleId = new Guid(_configuration["ProjectConfig:RoleId"].ToString());
                int expireDuration = int.Parse(_configuration["ProjectConfig:ExpireDuration"].ToString());
                string passwordSalt = _passwordHelper.GenerateSalt();
                string password = _passwordHelper.GetEncryptedPassword(user.Password.Trim(), passwordSalt);
                string activationCode = _smsService.GenerateConfirmCode(5);
                user.Id = userId;
                user.Username = user.Username.ToLower().Trim();
                user.InsertUser = request.Username.ToLower().Trim();
                user.Password = password;
                user.PasswordSalt = passwordSalt;
                user.RoleId = roleId;
                user.IsDeleted = false;
                user.IsMobileConfirmed = false;
                user.IsActived = false;
                user.ActivationCode = activationCode;
                user.InsertDate = DateTime.Now;
                user.CodeExpiredTime = DateTime.Now.AddMinutes(expireDuration);

                await _unitOfWork.userRepositoryAsync.AddAsync(user);
                var success = await _unitOfWork.SaveAsync() > 0;

                if (success)
                {
                    StringBuilder message = new StringBuilder();
                    message.AppendLine($"کد فعال سازی : {activationCode}");
                    message.AppendLine("دیجی منو");

                    var smsRequest = new SMSRequest()
                    {
                        To = user.Mobile,
                        Body = message.ToString().TrimEnd(),
                        Type = "register",
                        UserId = user.Id.ToString(),
                        UserName = user.Username,
                        KeyParam = activationCode
                    };
                    await _smsService.SendSMSAsync(smsRequest);

                    return new ResultDTO<string>(HttpStatusCode.OK, "عملیات موفق، کد فعالسازی برای شما پیامک شد.", userId.ToString());
                }
                throw new RestException(HttpStatusCode.BadRequest, "خطا در عملیات ثبت");
            }
        }
    }
}
