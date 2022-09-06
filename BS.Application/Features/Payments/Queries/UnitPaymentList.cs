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
using BS.Application.Features.Payments.DTOs;

namespace BS.Application.Features.Payments.Queries
{
    public class UnitPaymentList
    {
        public class UnitPaymentListQuery : ListSearchParamDTO, IRequest<PaymentEnvelope>
        {
            public string DepartmentId { get; set; }
            public string Title { get; set; }
            public string StatusTitle { get; set; }
            public string Department { get; set; }
            public string PId { get; set; }
        }

        public class UnitPaymentListHandLer : IRequestHandler<UnitPaymentListQuery, PaymentEnvelope>
        {
            private readonly IUnitOfWork _unitOfWork;
            private readonly IUserAccessor _userAccessor;
            private readonly IMapper _mapper;
            private readonly IFileHelper _fileHelper;
            private readonly IPersianDate _persianDate;
            private readonly IAdjustChar _adjustChar;


            public UnitPaymentListHandLer(IUnitOfWork unitOfWork, IUserAccessor userAccessor, IMapper mapper, IFileHelper fileHelper, IPersianDate persianDate, IAdjustChar adjustChar)
            {
                _unitOfWork = unitOfWork;
                _userAccessor = userAccessor;
                _fileHelper = fileHelper;
                _mapper = mapper;
                _persianDate = persianDate;
                _adjustChar = adjustChar;
            }
            public async Task<PaymentEnvelope> Handle(UnitPaymentListQuery request, CancellationToken cancellationToken)
            {
                var user = await _userAccessor.GetUserData();
                if (user == null)
                    throw new RestException(HttpStatusCode.NotFound, "خطا، کاربری یافت نشد");



                var query = (from paymentTeble in _unitOfWork.paymentRepositoryAsync.Query()
                             join typeTable in _unitOfWork.refCodeRepositoryAsync.Query() on new { Id = paymentTeble.PaymentType, Domain = "payment-type" } equals new { Id = typeTable.Code, Domain = typeTable.Domain }
                             join statusTable in _unitOfWork.refCodeRepositoryAsync.Query() on new { Id = paymentTeble.PaymentStatus, Domain = "payment-status" } equals new { Id = statusTable.Code, Domain = statusTable.Domain }
                             join departmentTable in _unitOfWork.departmentRepositoryAsync.Query() on paymentTeble.DepartmentId equals departmentTable.Id
                             where paymentTeble.IsDeleted == false && paymentTeble.DepartmentId == user.DepartmentId
                             orderby paymentTeble.InsertDate
                             select new PaymentListItemDTO
                             {
                                 Id = paymentTeble.Id.ToString().ToLower(),
                                 Key = paymentTeble.Id.ToString().ToLower(),
                                 PId = paymentTeble.PID,
                                 Title = typeTable.Title,
                                 StatusTitle = statusTable.Title,
                                 Status=paymentTeble.PaymentStatus,
                                 Amount = int.Parse(paymentTeble.Amount) > 0 ? int.Parse(paymentTeble.Amount).ToString("#,0") : "رایگان",
                                 PDate = paymentTeble.PDate,
                                 PTime = paymentTeble.PTime,
                                 ExpireDate = paymentTeble.PaymentType == 1 ? _persianDate.toShamsi(paymentTeble.InsertDate.AddDays(15)) : string.IsNullOrEmpty(paymentTeble.PDate) ? "" : _persianDate.toShamsi(_persianDate.ToMiladi(paymentTeble.PDate, null).AddYears(1)),
                                 IsActivated = paymentTeble.PaymentType == 1 ? (paymentTeble.InsertDate.AddDays(15) < DateTime.Now ? false : true) : (paymentTeble.PaymentStatus == 2 ? false : (paymentTeble.InsertDate.AddYears(1) < DateTime.Now ? false : true)),
                                 Department = departmentTable.Title

                             }) ;

                #region Search

                if (!string.IsNullOrEmpty(request.Title))
                    query = query.Where(x => x.Title.Contains(_adjustChar.ChangeToArabicChar(request.Title)));

                if (!string.IsNullOrEmpty(request.StatusTitle))
                    query = query.Where(x => x.StatusTitle.Contains(_adjustChar.ChangeToArabicChar(request.StatusTitle)));

                if (!string.IsNullOrEmpty(request.Department))
                    query = query.Where(x => x.Department.Contains(_adjustChar.ChangeToArabicChar(request.Department)));

                if (!string.IsNullOrEmpty(request.PId))
                    query = query.Where(x => x.PId.ToString().Contains(request.PId));


                #endregion

                #region Order by

                if (!string.IsNullOrEmpty(request.SortColumn))
                    query = query.OrderBy($"{request.SortColumn} {request.SortDirection}");

                else
                    query = query.OrderBy(n => n.PDate);


                #endregion

                var result = new PaymentEnvelope();

                int offset = (request.Page - 1 ?? 0) * (request.Limit ?? 10);

                var list = await query
                    .Skip(offset)
                    .Take(request.Limit ?? 10)
                    .AsNoTracking()
                    .ToListAsync();

                result.PaymentList = new List<PaymentListItemDTO>(list);
                result.PaymentCount = await query.CountAsync();

                return result;
            }
        }
    }
}