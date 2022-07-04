using AutoMapper;
using BS.Application.Common.Models;
using BS.Application.Features.UserLogs.DTOs;
using BS.Application.Interfaces;
using BS.Application.Interfaces.Repositories;
using BS.Domain.Entities;
using MediatR;
using Microsoft.EntityFrameworkCore;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Net;
using System.Text;
using System.Threading;
using System.Threading.Tasks;

namespace BS.Application.Features.UserLogs.Queries
{
    public class UserLogLoad
    {
        public class UserLogLoadQuery : IRequest<UserLogFormDTO>
        {
            public string Id { get; set; }
        }

        public class UserLogLoadHandLer : IRequestHandler<UserLogLoadQuery, UserLogFormDTO>
        {
            private readonly IUnitOfWork _unitOfWork;
            private readonly IUserAccessor _userAccessor;
            private readonly IMapper _mapper;
            private readonly IFileHelper _fileHelper;

            public UserLogLoadHandLer(IUnitOfWork unitOfWork, IUserAccessor userAccessor, IMapper mapper, IFileHelper fileHelper)
            {
                _unitOfWork = unitOfWork;
                _userAccessor = userAccessor;
                _fileHelper = fileHelper;
                _mapper = mapper;
            }
            public async Task<UserLogFormDTO> Handle(UserLogLoadQuery request, CancellationToken cancellationToken)
            {
                if (request.Id == null)
                    throw new RestException(HttpStatusCode.BadRequest, "خطا، رکوردی انتخاب نشده است...");

                var result = await (from userLogTable in _unitOfWork.userLogRepositoryAsync.Query()
                                    join userTable in _unitOfWork.userRepositoryAsync.Query() on userLogTable.UserId equals userTable.Id
                                    join refTable in _unitOfWork.refCodeRepositoryAsync.Query() on new { Id = userLogTable.StatusCode, Domain = "user-log" } equals new { Id = refTable.Code, Domain = refTable.Domain }
                                    where userLogTable.Id == new Guid(request.Id)
                                    select new UserLogFormDTO
                                    {
                                        Id = userLogTable.Id.ToString().ToLower(),
                                        Name = userTable.Name,
                                        UserName = userTable.Username,
                                        Date = userLogTable.LogDate,
                                        Ip = userLogTable.UserIp,
                                        Status = refTable.Title,
                                    }).FirstOrDefaultAsync();
                return result;
            }
        }
    }
}
