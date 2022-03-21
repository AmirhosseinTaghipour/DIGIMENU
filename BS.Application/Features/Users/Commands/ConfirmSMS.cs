using BPJ.LMSR.Application.Common;
using BS.Application.Common;
using BS.Application.Features.Users.DTOs;
using BS.Application.Interfaces;
using BS.Application.Interfaces.Repositories;
using BS.Domain.Entities;
using MediatR;
using Microsoft.AspNetCore.Http;
using Microsoft.EntityFrameworkCore;
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
    public class ConfirmSMS
    {
        public class ConfirmSMSCommand : IRequest<RefreshTokenDTO>
        {
            public string UserName { get; set; }
            public string Code { get; set; }
            public bool IsChangePasswordMode { get; set; }
            public string CaptchaText { get; set; }
            public string Token { get; set; }
        }

        public class ConfirmSMSHandler : IRequestHandler<ConfirmSMSCommand, RefreshTokenDTO>
        {
            private readonly IUnitOfWork _unitOfWork;
            private readonly IPasswordHelper _passwordHelper;
            private readonly IHttpContextAccessor _httpContextAccessor;
            private readonly ICaptcha _captcha;
            private readonly IRefreshJwtToken _refreshJwtToken;
            private readonly IJwtGenerator _jwtGenerator;
            private readonly IPersianDate _persianDate;

            public ConfirmSMSHandler(IUnitOfWork unitOfWork, IPasswordHelper passwordHelper, ICaptcha captcha, IRefreshJwtToken refreshJwtToken, IJwtGenerator jwtGenerator, IHttpContextAccessor httpContextAccessor, IPersianDate persianDate)
            {
                _unitOfWork = unitOfWork;
                _passwordHelper = passwordHelper;
                _refreshJwtToken = refreshJwtToken;
                _jwtGenerator = jwtGenerator;
                _captcha = captcha;
                _httpContextAccessor = httpContextAccessor;
                _persianDate = persianDate;

            }
            public async Task<RefreshTokenDTO> Handle(ConfirmSMSCommand request, CancellationToken cancellationToken)
            {
                if (!_captcha.ValidateCaptchaCode(request.CaptchaText, request.Token))
                    throw new RestException(HttpStatusCode.BadRequest, "خطا در پردازش تصویر امنیتی!");


                var isUserExisted = _unitOfWork.userRepositoryAsync.Any(n => n.Username == request.UserName.ToLower().Trim());
                if (!isUserExisted)
                    throw new RestException(HttpStatusCode.NotFound, "کاربری با این نام کاربری وجود ندارد.");

                var clientIp = _httpContextAccessor.HttpContext.Connection.RemoteIpAddress.ToString();
                var user = await _unitOfWork.userRepositoryAsync.GetFirstAsync(n => n.Username == request.UserName.ToLower().Trim() && n.IsDeleted == false && n.ActivationCode == request.Code);
                if (user == null)
                {
                    throw new RestException(HttpStatusCode.Locked, "کد وارد شده صحیح نیست.");
                    await _unitOfWork.userLogRepositoryAsync.AddAsync(new UserLog()
                    {
                        Id = Guid.NewGuid(),
                        UserId = user.Id,
                        StatusCode = request.IsChangePasswordMode ? 4 : 6,
                        InsertDate = DateTime.Now,
                        UserIp = clientIp,
                        LogDate = $"{_persianDate.toShamsi(DateTime.Now)}-{DateTime.Now.Hour:##}:{DateTime.Now.Minute:##}"
                    });
                }

                if (DateTime.Compare(user.CodeExpiredTime , DateTime.Now)<0)
                {
                    throw new RestException(HttpStatusCode.Locked, "کد وارد شده منقضی شده است.");
                    await _unitOfWork.userLogRepositoryAsync.AddAsync(new UserLog()
                    {
                        Id = Guid.NewGuid(),
                        UserId = user.Id,
                        StatusCode = request.IsChangePasswordMode ? 4 : 6,
                        InsertDate = DateTime.Now,
                        UserIp = clientIp,
                        LogDate = $"{_persianDate.toShamsi(DateTime.Now)}-{DateTime.Now.Hour:##}:{DateTime.Now.Minute:##}"
                    });
                }

                user.IsActived = true;
                user.IsMobileConfirmed = true;
                _unitOfWork.userRepositoryAsync.Update(user);

                await _unitOfWork.userLogRepositoryAsync.AddAsync(new UserLog()
                {
                    Id = Guid.NewGuid(),
                    UserId = user.Id,
                    StatusCode = request.IsChangePasswordMode ? 3 : 5,
                    InsertDate = DateTime.Now,
                    UserIp = clientIp,
                    LogDate = $"{_persianDate.toShamsi(DateTime.Now)}-{DateTime.Now.Hour:##}:{DateTime.Now.Minute:##}"
                });

                await _unitOfWork.SaveAsync();

                var currentUser = await (from vUser in _unitOfWork.userRepositoryAsync.Query()
                                         join vRole in _unitOfWork.roleRepositoryAsync.Query() on vUser.RoleId equals vRole.Id
                                         where vUser.Id == user.Id && vUser.IsDeleted == false && vUser.IsActived == true
                                         select new
                                         {
                                             UserId = vUser.Id.ToString(),
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

                return tokenes;

            }
        }
    }
}
