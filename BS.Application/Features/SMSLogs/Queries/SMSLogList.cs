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
using BS.Application.Features.SMSLogs.DTOs;

namespace BS.Application.Features.SMSLogs.Queries
{
    public class SMSLogList
    {
        public class SMSLogListQuery : ListSearchParamDTO, IRequest<SMSLogEnvelope>
        {
            public string UserId { get; set; }
            public string Receiver { get; set; }
            public string Mobile { get; set; }
            public string Type { get; set; }
        }

        public class SMSLogListHandLer : IRequestHandler<SMSLogListQuery, SMSLogEnvelope>
        {
            private readonly IUnitOfWork _unitOfWork;
            private readonly IUserAccessor _userAccessor;
            private readonly IMapper _mapper;
            private readonly IFileHelper _fileHelper;
            private readonly IAdjustChar _adjustChar;


            public SMSLogListHandLer(IUnitOfWork unitOfWork, IUserAccessor userAccessor, IMapper mapper, IFileHelper fileHelper, IAdjustChar adjustChar)
            {
                _unitOfWork = unitOfWork;
                _userAccessor = userAccessor;
                _fileHelper = fileHelper;
                _mapper = mapper;
                _adjustChar = adjustChar;
            }
            public async Task<SMSLogEnvelope> Handle(SMSLogListQuery request, CancellationToken cancellationToken)
            {

                if (request.UserId == null)
                    throw new RestException(HttpStatusCode.BadRequest, "خطا،کاربری انتخاب نشده است...");

                var user = await _unitOfWork.userRepositoryAsync.GetFirstAsync(n => n.Id == new Guid(request.UserId));
                if (user == null)
                    throw new RestException(HttpStatusCode.BadRequest, "خطا،کاربری یافت نشد.");


                var query = (from smsLogTable in _unitOfWork.smsLogRepositoryAsync.Query()
                             join userTable in _unitOfWork.userRepositoryAsync.Query() on smsLogTable.UserId equals userTable.Id
                             where smsLogTable.UserId == user.Id
                             orderby smsLogTable.InsertDate descending
                             select new SMSLogListItemDTO
                             {
                                 Id = smsLogTable.Id.ToString().ToLower(),
                                 Key = smsLogTable.Id.ToString().ToLower(),
                                 Receiver = userTable.Name,
                                 Mobile = smsLogTable.Mobile,
                                 KeyParam = smsLogTable.KeyPrameter,
                                 Type = smsLogTable.Type == "register" ? "ثبت نام" : smsLogTable.Type == "forgot-password" ? "بازیابی کلمه عبور" : "مشخص نشده",
                                 status = smsLogTable.Response == 1 ? "موفق" : "ناموفق"
                             });

                #region Search

                if (!string.IsNullOrEmpty(request.Receiver))
                    query = query.Where(x => x.Receiver.Contains(_adjustChar.ChangeToArabicChar(request.Receiver)));

                if (!string.IsNullOrEmpty(request.Mobile))
                    query = query.Where(x => x.Mobile.Contains(_adjustChar.ChangeToArabicChar(request.Mobile)));

                if (!string.IsNullOrEmpty(request.Type))
                    query = query.Where(x => x.Type.Contains(_adjustChar.ChangeToArabicChar(request.Type)));

                #endregion

                #region Order by
                if (!string.IsNullOrEmpty(request.SortColumn))
                    query = query.OrderBy($"{request.SortColumn} {request.SortDirection}");

                #endregion

                var result = new SMSLogEnvelope();

                int offset = (request.Page - 1 ?? 0) * (request.Limit ?? 10);

                var list = await query
                    .Skip(offset)
                    .Take(request.Limit ?? 10)
                    .AsNoTracking()
                    .ToListAsync();


                result.SmsLogList = new List<SMSLogListItemDTO>(list);
                result.smsLogCount = await query.CountAsync();

                return result;

            }
        }
    }
}
