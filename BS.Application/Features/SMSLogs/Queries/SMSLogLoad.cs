using AutoMapper;
using BS.Application.Common.Models;
using BS.Application.Features.SMSLogs.DTOs;
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

namespace BS.Application.Features.SMSLogs.Queries
{
    public class SMSLogLoad
    {
        public class SMSLogLoadQuery : IRequest<SMSLogFormDTO>
        {
            public string Id { get; set; }
        }

        public class SMSLogLoadHandLer : IRequestHandler<SMSLogLoadQuery, SMSLogFormDTO>
        {
            private readonly IUnitOfWork _unitOfWork;
            private readonly IUserAccessor _userAccessor;
            private readonly IMapper _mapper;
            private readonly IFileHelper _fileHelper;

            public SMSLogLoadHandLer(IUnitOfWork unitOfWork, IUserAccessor userAccessor, IMapper mapper, IFileHelper fileHelper)
            {
                _unitOfWork = unitOfWork;
                _userAccessor = userAccessor;
                _fileHelper = fileHelper;
                _mapper = mapper;
            }
            public async Task<SMSLogFormDTO> Handle(SMSLogLoadQuery request, CancellationToken cancellationToken)
            {
                if (request.Id == null)
                    throw new RestException(HttpStatusCode.BadRequest, "خطا، رکوردی انتخاب نشده است...");

                var result = await (from smsLogTable in _unitOfWork.smsLogRepositoryAsync.Query()
                                    join userTable in _unitOfWork.userRepositoryAsync.Query() on smsLogTable.UserId equals userTable.Id
                                    where smsLogTable.Id == new Guid(request.Id)
                                    select new SMSLogFormDTO
                                    {
                                        Id = smsLogTable.Id.ToString().ToLower(),
                                        Receiver = userTable.Name,
                                        Mobile = smsLogTable.Mobile,
                                        Message = smsLogTable.MessageBody,
                                        KeyParam = smsLogTable.KeyPrameter,
                                        Type = smsLogTable.Type== "register" ? "ثبت نام": smsLogTable.Type == "forgot-password"?"بازیابی کلمه عبور":"مشخص نشده",
                                        status = smsLogTable.Response == 1 ? "موفق" : "ناموفق"
                                    }).FirstOrDefaultAsync();
                return result;

            }
        }
    }
}
