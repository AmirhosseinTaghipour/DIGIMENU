using AutoMapper;
using BS.Application.Common.Models;
using BS.Application.Interfaces;
using BS.Application.Interfaces.Repositories;
using MediatR;
using Microsoft.EntityFrameworkCore;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Net;
using System.Text;
using System.Threading;
using System.Threading.Tasks;
using System.Linq.Dynamic.Core;
using BS.Application.Common.DTOs;
using BS.Application.Common.Enums;
using BS.Application.Features.UserLogs.DTOs;

namespace BS.Application.Features.UserLogs.Queries
{
    public class UserLogList
    {
        public class UserLogListQuery : ListSearchParamDTO, IRequest<UserLogEnvelope>
        {
            public string UserId { get; set; }
            public string UserName { get; set; }
            public string Status { get; set; }
            public string Date { get; set; }
            public string Ip { get; set; }

        }

        public class UserLogListHandLer : IRequestHandler<UserLogListQuery, UserLogEnvelope>
        {
            private readonly IUnitOfWork _unitOfWork;
            private readonly IUserAccessor _userAccessor;
            private readonly IMapper _mapper;
            private readonly IFileHelper _fileHelper;
            private readonly IAdjustChar _adjustChar;


            public UserLogListHandLer(IUnitOfWork unitOfWork, IUserAccessor userAccessor, IMapper mapper, IFileHelper fileHelper, IAdjustChar adjustChar)
            {
                _unitOfWork = unitOfWork;
                _userAccessor = userAccessor;
                _fileHelper = fileHelper;
                _mapper = mapper;
                _adjustChar = adjustChar;
            }
            public async Task<UserLogEnvelope> Handle(UserLogListQuery request, CancellationToken cancellationToken)
            {

                if (request.UserId == null)
                    throw new RestException(HttpStatusCode.BadRequest, "خطا،کاربری انتخاب نشده است...");

                var user = await _unitOfWork.userRepositoryAsync.GetFirstAsync(n => n.Id == new Guid(request.UserId));
                if (user == null)
                    throw new RestException(HttpStatusCode.BadRequest, "خطا،کاربری یافت نشد.");


                var query = (from userLogTable in _unitOfWork.userLogRepositoryAsync.Query()
                             join userTable in _unitOfWork.userRepositoryAsync.Query() on userLogTable.UserId equals userTable.Id
                             join refTable in _unitOfWork.refCodeRepositoryAsync.Query() on  new { Id=userLogTable.StatusCode, Domain= "user-log" } equals new { Id=refTable.Code, Domain=refTable.Domain}
                             where userLogTable.UserId == user.Id
                             orderby userLogTable.InsertDate descending
                             select new UserLogListItemDTO
                             {
                                 Id = userLogTable.Id.ToString().ToLower(),
                                 Key = userLogTable.Id.ToString().ToLower(),
                                 Name = userTable.Name,
                                 UserName = userTable.Username,
                                 Date = userLogTable.LogDate,
                                 Ip = userLogTable.UserIp,
                                 Status = refTable.Title,
                             });

                #region Search

                if (!string.IsNullOrEmpty(request.UserName))
                    query = query.Where(x => x.UserName.Contains(_adjustChar.ChangeToArabicChar(request.UserName)));

                if (!string.IsNullOrEmpty(request.Status))
                    query = query.Where(x => x.Status.Contains(_adjustChar.ChangeToArabicChar(request.Status)));

                if (!string.IsNullOrEmpty(request.Date))
                    query = query.Where(x => x.Date.Contains(_adjustChar.ChangeToArabicChar(request.Date)));

                if (!string.IsNullOrEmpty(request.Ip))
                    query = query.Where(x => x.Ip.Contains(_adjustChar.ChangeToArabicChar(request.Ip)));

                #endregion

                #region Order by
                if (!string.IsNullOrEmpty(request.SortColumn))
                    query = query.OrderBy($"{request.SortColumn} {request.SortDirection}");


                #endregion

                var result = new UserLogEnvelope();

                int offset = (request.Page - 1 ?? 0) * (request.Limit ?? 10);

                var list = await query
                    .Skip(offset)
                    .Take(request.Limit ?? 10)
                    .AsNoTracking()
                    .ToListAsync();


                result.UserLogList = new List<UserLogListItemDTO>(list);
                result.UserLogCount = await query.CountAsync();

                return result;

            }
        }
    }
}
