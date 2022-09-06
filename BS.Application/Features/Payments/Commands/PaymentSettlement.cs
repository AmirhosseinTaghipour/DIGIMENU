using AutoMapper;
using BS.Application.Common.DTOs;
using BS.Application.Common.Enums;
using BS.Application.Common.Models;
using BS.Application.Features.Payments.DTOs;
using BS.Application.Interfaces;
using BS.Application.Interfaces.Repositories;
using BS.Domain.Entities;
using MediatR;
using Microsoft.AspNetCore.Http;
using Microsoft.Extensions.Configuration;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Net;
using System.Text;
using System.Threading;
using System.Threading.Tasks;

namespace BS.Application.Features.Payments.Commands
{
    public class PaymentSettlement
    {
        public class PaymentSettlementCommand : IRequest<ResultDTO<string>>
        {
            public string PaymentId { get; set; }
        }

        public class PaymentSettlementHandler : IRequestHandler<PaymentSettlementCommand, ResultDTO<string>>
        {
            private readonly IUnitOfWork _unitOfWork;
            private readonly IFileHelper _fileHelper;
            private readonly IMapper _mapper;
            private readonly IConfiguration _configuration;
            private readonly IPersianDate _persianDate;
            private readonly IPaymentService _paymentService;
            private readonly IHttpContextAccessor _contextAccessor;



            public PaymentSettlementHandler(IUnitOfWork unitOfWork, IMapper mapper, IFileHelper fileHelper, IConfiguration configuration, IPersianDate persianDate, IPaymentService paymentService, IHttpContextAccessor contextAccessor)
            {
                _unitOfWork = unitOfWork;
                _mapper = mapper;
                _fileHelper = fileHelper;
                _configuration = configuration;
                _persianDate = persianDate;
                _paymentService = paymentService;
                _contextAccessor = contextAccessor;
            }
            public async Task<ResultDTO<string>> Handle(PaymentSettlementCommand request, CancellationToken cancellationToken)
            {
                if (string.IsNullOrEmpty(request.PaymentId))
                    throw new RestException(HttpStatusCode.BadRequest, "خطا، پارامترهای ارسالی...");

                if (!Guid.TryParse(request.PaymentId, out var requestId))
                    throw new RestException(HttpStatusCode.BadRequest, "خطا، پارامترهای ارسالی...");


                var payment = await _unitOfWork.paymentRepositoryAsync.GetByIdAsync(requestId);
                if (payment == null)
                    throw new RestException(HttpStatusCode.NotFound, "رکورد پرداخت یافت نشد");

                if (payment.IsDeleted)
                    throw new RestException(HttpStatusCode.NotFound, "رکورد پرداخت حذف شده است");

                var res = await _paymentService.GetTransactionToken(payment.Id.ToString());
                if (res.Code != HttpStatusCode.OK)
                    throw new RestException(HttpStatusCode.BadRequest, res.Message);

                res = await _paymentService.GetRedirectLink(payment.Id.ToString());
                if (res.Code != HttpStatusCode.OK)
                    throw new RestException(HttpStatusCode.BadRequest, res.Message);

                return new ResultDTO<string>(HttpStatusCode.OK, "درحال انتقال به درگاه پرداخت",res.Data);
            }
        }
    }
}