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
    public class PaymentUpdate
    {
        public class PaymentUpdateCommand : PaymentFormDTO, IRequest<ResultDTO<string>>
        {

        }

        public class PaymentUpdateHandler : IRequestHandler<PaymentUpdateCommand, ResultDTO<string>>
        {
            private readonly IUserAccessor _userAccessor;
            private readonly IUnitOfWork _unitOfWork;
            private readonly IFileHelper _fileHelper;
            private readonly IMapper _mapper;

            public PaymentUpdateHandler(IUserAccessor userAccessor, IUnitOfWork unitOfWork, IMapper mapper, IFileHelper fileHelper)
            {
                _unitOfWork = unitOfWork;
                _userAccessor = userAccessor;
                _mapper = mapper;
                _fileHelper = fileHelper;
            }
            public async Task<ResultDTO<string>> Handle(PaymentUpdateCommand request, CancellationToken cancellationToken)
            {
                if (request.IsUpdateMode == false)
                    throw new RestException(HttpStatusCode.BadRequest, "خطا، مود اینزرت...");

                if (!Guid.TryParse(request.Id, out var requestId))
                    throw new RestException(HttpStatusCode.BadRequest, "خطا، مقدار پارامتر ورودی صحیح نیست...");


                var paymentOld = await _unitOfWork.paymentRepositoryAsync.GetByIdAsync(requestId);
                if (paymentOld == null)
                    throw new RestException(HttpStatusCode.NotFound, "خطا، کاربری یافت نشد");

                if(paymentOld.PaymentStatus!=1 || paymentOld.EntityName!= PaymentType.Demo.ToString())
                    throw new RestException(HttpStatusCode.NotFound, "خطا، امکان تمدید تنها برای اشتراک 15 روزه دمو وجود دارد.");

                paymentOld.IsDeleted = false;
                paymentOld.UpdateDate = DateTime.Now;
                paymentOld.UpdateUser = _userAccessor.GetCurrentUserName().ToLower();
                _unitOfWork.paymentRepositoryAsync.Update(paymentOld);

                var pId = _unitOfWork.paymentRepositoryAsync.Query().Max(n => n.PID);
                var payment = new Payment();
                var paymentId = Guid.NewGuid();
                payment.Id = paymentId;
                payment.EntityId = paymentOld.EntityId;
                payment.PID = ++pId;
                payment.InsertDate = DateTime.Now;
                payment.InsertUser = _userAccessor.GetCurrentUserName().ToLower();
                payment.EntityName = PaymentType.Demo.ToString();
                payment.PaymentStatus = 1;


                await _unitOfWork.paymentRepositoryAsync.AddAsync(payment);

                var success = await _unitOfWork.SaveAsync() > 0;
                if (success)
                    return new ResultDTO<string>(HttpStatusCode.OK, "اطلاعات پرداخت با موفقیت ویرایش شد.");

                throw new RestException(HttpStatusCode.BadRequest, "خطا در عملیات ویرایش");

            }
        }
    }
}
