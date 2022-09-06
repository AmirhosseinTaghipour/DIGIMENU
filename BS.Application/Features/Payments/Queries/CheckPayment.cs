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
    public class CheckPayment
    {
        public class CheckPaymentQuery :  IRequest<PaymentResultDTO>
        {
            public string PaymentId { get; set; }
        }

        public class CheckPaymentHandLer : IRequestHandler<CheckPaymentQuery, PaymentResultDTO>
        {
            private readonly IUnitOfWork _unitOfWork;
            private readonly IUserAccessor _userAccessor;
            private readonly IMapper _mapper;
            private readonly IFileHelper _fileHelper;
            private readonly IPersianDate _persianDate;
            private readonly IAdjustChar _adjustChar;


            public CheckPaymentHandLer(IUnitOfWork unitOfWork, IUserAccessor userAccessor, IMapper mapper, IFileHelper fileHelper, IPersianDate persianDate, IAdjustChar adjustChar)
            {
                _unitOfWork = unitOfWork;
                _userAccessor = userAccessor;
                _fileHelper = fileHelper;
                _mapper = mapper;
                _persianDate = persianDate;
                _adjustChar = adjustChar;
            }
            public async Task<PaymentResultDTO> Handle(CheckPaymentQuery request, CancellationToken cancellationToken)
            {

                if (string.IsNullOrEmpty(request.PaymentId))
                    throw new RestException(HttpStatusCode.BadRequest, "خطا، پارامترهای ارسالی...");


                if (!Guid.TryParse(request.PaymentId,out var requestId))
                    throw new RestException(HttpStatusCode.BadRequest, "خطا، پارامترهای ارسالی...");



                var payment = await _unitOfWork.paymentRepositoryAsync.Query().Where(n => n.Id == requestId && n.IsDeleted == false).FirstOrDefaultAsync();
                if (payment == null)
                    throw new RestException(HttpStatusCode.NotFound, "رکورد پرداخت یافت نشد");

                var res = new PaymentResultDTO();
                res.PDate = payment.PDate;
                res.PTime = payment.PTime;
                res.PId = payment.PID.ToString();
                res.RefId = payment.RefID;
                res.Amount = payment.Amount.ToString();
                if (payment.PaymentStatus == 3)
                {
                    res.IsPaid = true;
                    res.Message = "پرداخت با موفقیت انجام شده است.";
                }
                else
                {
                    res.IsPaid = false;
                    res.Message = "پرداخت ناموق: در صورت کسر مبلغ مذکور، تا 72 ساعت آینده مبلغ کسر شده به حساب بانکی شما برگشت داده میشود.";
                }

                return res;

            }
        }
    }
}