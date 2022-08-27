using AutoMapper;
using BS.Application.Common.DTOs;
using BS.Application.Common.Enums;
using BS.Application.Common.Models;
using BS.Application.Features.Payments.DTOs;
using BS.Application.Interfaces;
using BS.Application.Interfaces.Repositories;
using BS.Domain.Entities;
using MediatR;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Net;
using System.Text;
using System.Threading;
using System.Threading.Tasks;

namespace BS.Application.Features.Payments.Commands
{
    public class PaymentInsert
    {
        public class PaymentInsertCommand : PaymentFormDTO, IRequest<ResultDTO<string>>
        {

        }

        public class PaymentInsertHandler : IRequestHandler<PaymentInsertCommand, ResultDTO<string>>
        {
            private readonly IUserAccessor _userAccessor;
            private readonly IUnitOfWork _unitOfWork;
            private readonly IFileHelper _fileHelper;
            private readonly IMapper _mapper;

            public PaymentInsertHandler(IUserAccessor userAccessor, IUnitOfWork unitOfWork, IMapper mapper, IFileHelper fileHelper)
            {
                _unitOfWork = unitOfWork;
                _userAccessor = userAccessor;
                _mapper = mapper;
                _fileHelper = fileHelper;
            }
            public async Task<ResultDTO<string>> Handle(PaymentInsertCommand request, CancellationToken cancellationToken)
            {
                if (request.IsUpdateMode == true)
                    throw new RestException(HttpStatusCode.BadRequest, "خطا، مود آپدیت...");

                if (new int[2] { 10, 20 }.Contains(request.Type))
                    throw new RestException(HttpStatusCode.BadRequest, "خطا، پارامترهای ارسالی...");


                var user = await _userAccessor.GetUserData();
                if (user == null)
                    throw new RestException(HttpStatusCode.NotFound, "خطا، کاربری یافت نشد");

                if (user.DepartmentId == null)
                    throw new RestException(HttpStatusCode.BadRequest, "خطا، اطلاعات مجموعه وارد نشده است...");


                var pId = 500100;
                if (_unitOfWork.paymentRepositoryAsync.Query().Any())
                    pId = _unitOfWork.paymentRepositoryAsync.Query().Max(n => n.PID);

                var payment = new Payment();
                var paymentId = Guid.NewGuid();
                payment.Id = paymentId;
                payment.EntityId = user.DepartmentId.Value;
                payment.PID = ++pId;
                payment.IsDeleted = false;
                payment.InsertDate = DateTime.Now;
                payment.InsertUser = _userAccessor.GetCurrentUserName().ToLower();

                if (request.Type == 10) //Demo
                {
                    payment.EntityName = PaymentType.Demo.ToString();
                    payment.PaymentStatus = 1;
                }
                else //Real
                {
                    payment.EntityName = PaymentType.AppServices.ToString();
                    payment.PaymentStatus = 2;
                }

                await _unitOfWork.paymentRepositoryAsync.AddAsync(payment);

                var success = await _unitOfWork.SaveAsync() > 0;
                if (success)
                    return new ResultDTO<string>(HttpStatusCode.OK, "اطلاعات پرداخت با موفقیت ثیت شد.");

                throw new RestException(HttpStatusCode.BadRequest, "خطا در عملیات ثبت");

            }
        }
    }
}