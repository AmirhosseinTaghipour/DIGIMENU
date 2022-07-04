using AutoMapper;
using BS.Application.Common.DTOs;
using BS.Application.Common.Models;
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
    public class UserDelete
    {
        public class UserDeleteCommand : IRequest<ResultDTO<string>>
        {
            public string[] Ids { get; set; }
        }

        public class UserDeleteHandler : IRequestHandler<UserDeleteCommand, ResultDTO<string>>
        {
            private readonly IUserAccessor _userAccessor;
            private readonly IUnitOfWork _unitOfWork;
            private readonly IMapper _mapper;

            public UserDeleteHandler(IUserAccessor userAccessor, IUnitOfWork unitOfWork, IMapper mapper, IFileHelper fileHelper)
            {
                _unitOfWork = unitOfWork;
                _userAccessor = userAccessor;
                _mapper = mapper;
            }
            public async Task<ResultDTO<string>> Handle(UserDeleteCommand request, CancellationToken cancellationToken)
            {
            
                var userList = await _unitOfWork.userRepositoryAsync.GetAsync(n => request.Ids.Contains(n.Id.ToString()));

                if (userList == null)
                    throw new RestException(HttpStatusCode.NotFound, "خطا، رکوردی یافت نشد");

                foreach (var item in userList)
                {
                    item.IsDeleted = true;
                    item.UpdateDate = DateTime.Now;
                    item.UpdateUser = _userAccessor.GetCurrentUserName().ToLower();
                    _unitOfWork.userRepositoryAsync.Update(item);
                }

                var success = await _unitOfWork.SaveAsync() > 0;
                if (success)
                    return new ResultDTO<string>(HttpStatusCode.OK, "حذف کاربران با موفقیت انجام شد.");

                throw new RestException(HttpStatusCode.BadRequest, "خطا در عملیات حذف");

            }
        }
    }
}
