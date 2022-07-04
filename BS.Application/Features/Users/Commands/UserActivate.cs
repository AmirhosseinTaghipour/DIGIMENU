using BS.Application.Common.DTOs;
using BS.Application.Common.Models;
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
    public class UserActivate
    {
        public class UserActivateCommand : IRequest<ResultDTO<string>>
        {
            public string UserId { get; set; }
            public string ActivationCode { get; set; }
        }

        public class UserActivateHandler : IRequestHandler<UserActivateCommand, ResultDTO<string>>
        {
            private readonly IUnitOfWork _unitOfWork;

            public UserActivateHandler(IUnitOfWork unitOfWork)
            {
                _unitOfWork = unitOfWork;
            }
            public async Task<ResultDTO<string>> Handle(UserActivateCommand request, CancellationToken cancellationToken)
            {
                var user = await _unitOfWork.userRepositoryAsync.GetByIdAsync(new Guid(request.UserId));
                if (user == null)
                    throw new RestException(HttpStatusCode.NotFound, "خطا، رکوردی یافت نشد");

                if (user.CodeExpiredTime < DateTime.Now)
                    return new ResultDTO<string>(HttpStatusCode.Locked, "کد فعالسازی منقضی شده است", request.UserId);

                if (user.ActivationCode != request.ActivationCode)
                    return new ResultDTO<string>(HttpStatusCode.Unauthorized, "کد وارد شده، صحیح نیست", request.UserId);

                user.IsActivated = true;
                user.IsMobileConfirmed = true;
                _unitOfWork.userRepositoryAsync.Update(user);
                var success = await _unitOfWork.SaveAsync() > 0;
                if (success)
                    return new ResultDTO<string>(HttpStatusCode.OK, "فعالسازی با موفقیت انجام شد");

                throw new RestException(HttpStatusCode.BadRequest, "خطا در ثبت عملیات");

            }
        }
    }
}
