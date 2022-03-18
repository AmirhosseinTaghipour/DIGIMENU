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
    public class ChangePassword
    {
        public class ChangePasswordCommand : IRequest<ResultDTO<string>>
        {
            public string Password { get; set; }
            public string NewPassword { get; set; }
            public string RepeatedNewPassword { get; set; }
        }

        public class ChangePasswordHandler : IRequestHandler<ChangePasswordCommand, ResultDTO<string>>
        {
            private readonly IUnitOfWork _unitOfWork;
            private readonly IUserAccessor _userAccessor;
            private readonly IPasswordHelper _passwordHelper;

            public ChangePasswordHandler(IUnitOfWork unitOfWork, IUserAccessor userAccessor, IPasswordHelper passwordHelper)
            {
                _unitOfWork = unitOfWork;
                _userAccessor = userAccessor;
                _passwordHelper = passwordHelper;
            }
            public async Task<ResultDTO<string>> Handle(ChangePasswordCommand request, CancellationToken cancellationToken)
            {
                var user = await _unitOfWork.userRepositoryAsync.GetByIdAsync(_userAccessor.GetCurrentUserId());
                if (user == null)
                    throw new RestException(HttpStatusCode.NotFound, "خطا، رکوردی یافت نشد");

                if (request.NewPassword != request.RepeatedNewPassword)
                    throw new RestException(HttpStatusCode.BadRequest, "تکرار کلمه عبور با کلمه عبور یکسان نیست");

                if (user.Password != _passwordHelper.GetEncryptedPassword(request.NewPassword, user.PasswordSalt))
                    throw new RestException(HttpStatusCode.BadRequest, "کلمه عبور صحیح نیست");

                user.PasswordSalt = _passwordHelper.GenerateSalt();
                user.Password = _passwordHelper.GetEncryptedPassword(request.NewPassword, user.PasswordSalt);
                user.UpdateDate = DateTime.Now;
                user.UpdateUser = _userAccessor.GetCurrentUserName();
                _unitOfWork.userRepositoryAsync.Update(user);
                var success = await _unitOfWork.SaveAsync() > 0;
                if (success)
                    return new ResultDTO<string>(HttpStatusCode.OK, "عملیات تغییر رمز عبور با موفقیت انجام شد");

                throw new RestException(HttpStatusCode.BadRequest, "خطا در ثبت عملیات");
            }
        }
    }
}
