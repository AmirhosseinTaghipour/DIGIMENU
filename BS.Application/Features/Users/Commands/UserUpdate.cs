using AutoMapper;
using BS.Application.Common.DTOs;
using BS.Application.Common.Models;
using BS.Application.Features.Users.DTOs;
using BS.Application.Interfaces;
using BS.Application.Interfaces.Repositories;
using BS.Domain.Entities;
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
    public class UserUpdate
    {
        public class UserUpdateCommand : UserManagementFormDTO, IRequest<ResultDTO<string>>
        {

        }

        public class UserUpdateHandler : IRequestHandler<UserUpdateCommand, ResultDTO<string>>
        {
            private readonly IUserAccessor _userAccessor;
            private readonly IUnitOfWork _unitOfWork;
            private readonly IMapper _mapper;
            private readonly IPasswordHelper _passwordHelper;
            private readonly ISMSService _smsService;
            private readonly IConfiguration _configuration;

            public UserUpdateHandler(IUserAccessor userAccessor, IUnitOfWork unitOfWork, IMapper mapper, IFileHelper fileHelper, IPasswordHelper passwordHelper, IConfiguration configuration, ISMSService smsService)
            {
                _unitOfWork = unitOfWork;
                _userAccessor = userAccessor;
                _mapper = mapper;
                _passwordHelper = passwordHelper;
                _smsService = smsService;
                _configuration = configuration;
            }
            public async Task<ResultDTO<string>> Handle(UserUpdateCommand request, CancellationToken cancellationToken)
            {
                if (request.IsUpdateMode == false)
                    throw new RestException(HttpStatusCode.BadRequest, "خطا، مود اینزرت...");
                if (string.IsNullOrEmpty(request.Id) || string.IsNullOrEmpty(request.UserName) || string.IsNullOrEmpty(request.Mobile) || string.IsNullOrEmpty(request.RoleId))
                    throw new RestException(HttpStatusCode.BadRequest, "خطا، فیلد های ضروری نمیتواند خالی باشد.");


                var checkExistUserName = _unitOfWork.userRepositoryAsync.Query().Any(n => n.Id != new Guid(request.Id) && n.Username == request.UserName.ToLower());
                if (checkExistUserName)
                    throw new RestException(HttpStatusCode.BadRequest, "خطا، نام کاربری  تکراری است");

                var user = await _unitOfWork.userRepositoryAsync.GetByIdAsync(new Guid(request.Id));
                if(user==null)
                    throw new RestException(HttpStatusCode.BadRequest, "خطا، رکوردی یافت نشد.");

                Guid roleId = new Guid(request.RoleId);
                int expireDuration = int.Parse(_configuration["ProjectConfig:ExpireDuration"].ToString());
                if (string.IsNullOrEmpty(request.Password))
                {
                    string passwordSalt = _passwordHelper.GenerateSalt();
                    string password = _passwordHelper.GetEncryptedPassword(user.Password.Trim(), passwordSalt);
                    user.Password = password;
                    user.PasswordSalt = passwordSalt;
                }     
                user.Username = user.Username.ToLower().Trim();
                user.Name = request.Name;
                user.DepartmentId = string.IsNullOrEmpty(request.DepartmentId) ? null : new Guid(request.DepartmentId);
                user.Mobile = request.Mobile;
                user.UpdateUser = _userAccessor.GetCurrentUserName().ToLower().Trim();
                user.RoleId = roleId;
                user.IsDeleted = false;
                user.IsMobileConfirmed = true;
                user.IsActivated = request.IsActivated;
                user.UpdateDate = DateTime.Now;

                 _unitOfWork.userRepositoryAsync.Update(user);
                var success = await _unitOfWork.SaveAsync() > 0;

                if (success)
                    return new ResultDTO<string>(HttpStatusCode.OK, "عملیات موفق، کاربر ویرایش شد.", user.Id.ToString());

                throw new RestException(HttpStatusCode.BadRequest, "خطا در عملیات ویرایش");

            }
        }
    }
}
