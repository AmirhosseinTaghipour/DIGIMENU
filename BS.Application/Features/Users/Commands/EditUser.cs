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
    public class EditUser
    {
        public class EditUserCommand : IRequest<ResultDTO<string>>
        {
            public string Name { get; set; }
            public string Family { get; set; }
        }

        public class EditUserHandler : IRequestHandler<EditUserCommand, ResultDTO<string>>
        {
            private readonly IUnitOfWork _unitOfWork;
            private readonly IUserAccessor _userAccessor;


            public EditUserHandler(IUnitOfWork unitOfWork, IUserAccessor userAccessor)
            {
                _unitOfWork = unitOfWork;
                _userAccessor = userAccessor;
            }


            public async Task<ResultDTO<string>> Handle(EditUserCommand request, CancellationToken cancellationToken)
            {
                var user = await _unitOfWork.userRepositoryAsync.GetByIdAsync(_userAccessor.GetCurrentUserId());
                if (user == null)
                    throw new RestException(HttpStatusCode.NotFound, "خطا، رکوردی یافت نشد");

                user.Name = request.Name;
                user.UpdateDate = DateTime.Now;
                user.UpdateUser = user.Username;

                _unitOfWork.userRepositoryAsync.Update(user);
                var success = await _unitOfWork.SaveAsync() > 0;

                if (success)
                {
                    return new ResultDTO<string>(HttpStatusCode.OK, "عملیات ویرایش با موفقیت انجام شد");
                }
                throw new RestException(HttpStatusCode.BadRequest, "خطا در عملیات ثبت");
            }
        }
    }
}
