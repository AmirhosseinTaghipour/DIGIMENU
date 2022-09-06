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
using Microsoft.EntityFrameworkCore;
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
    public class CallBackPayment
    {
        public class CallBackPaymentCommand : IRequest<string>
        {
            public string TransactionId { get; set; }
            public int OrderId { get; set; }
            public int Amount { get; set; }
        }

        public class CallBackPaymentHandler : IRequestHandler<CallBackPaymentCommand, string>
        {
            private readonly IUnitOfWork _unitOfWork;
            private readonly IFileHelper _fileHelper;
            private readonly IMapper _mapper;
            private readonly IConfiguration _configuration;
            private readonly IPersianDate _persianDate;
            private readonly IPaymentService _paymentService;
            private readonly IHttpContextAccessor _contextAccessor;



            public CallBackPaymentHandler(IUnitOfWork unitOfWork, IMapper mapper, IFileHelper fileHelper, IConfiguration configuration, IPersianDate persianDate, IPaymentService paymentService, IHttpContextAccessor contextAccessor)
            {
                _unitOfWork = unitOfWork;
                _mapper = mapper;
                _fileHelper = fileHelper;
                _configuration = configuration;
                _persianDate = persianDate;
                _paymentService = paymentService;
                _contextAccessor = contextAccessor;
            }
            public async Task<string> Handle(CallBackPaymentCommand request, CancellationToken cancellationToken)
            {
                string paymentId = "NotFound";
                if (!string.IsNullOrEmpty(request.TransactionId) && !string.IsNullOrEmpty(request.OrderId.ToString()) && !string.IsNullOrEmpty(request.Amount.ToString()))
                {
                    var payment = await _unitOfWork.paymentRepositoryAsync.Query().Where(n => n.PID == request.OrderId && n.TransactionId == request.TransactionId && n.PaymentStatus != 3  && n.IsDeleted == false).FirstOrDefaultAsync();
                    if (payment != null)
                    {
                        paymentId = payment.Id.ToString();
                        if(string.IsNullOrEmpty(payment.RefID))
                        await _paymentService.InquiryPayment(payment.Id.ToString());
                    }
                }
                string host = _contextAccessor.HttpContext.Request.Host.Value;
                if (_contextAccessor.HttpContext.Request.Host.Port == 5001)
                {
                    host = _contextAccessor.HttpContext.Request.Host.Host + ":3000";
                }
                //_contextAccessor.HttpContext.Response.Redirect($"{ _contextAccessor.HttpContext.Request.Scheme}://{host}/paymentcallback/{payment.Id.ToString()}");
                _contextAccessor.HttpContext.Response.Redirect($"http://{host}/paymentCallback/{paymentId}");
                return "";


            }
        }
    }
}