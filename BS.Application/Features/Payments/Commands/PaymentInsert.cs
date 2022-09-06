using AutoMapper;
using BS.Application.Common.DTOs;
using BS.Application.Common.Enums;
using BS.Application.Common.Models;
using BS.Application.Features.Payments.DTOs;
using BS.Application.Interfaces;
using BS.Application.Interfaces.Repositories;
using BS.Domain.Entities;
using MediatR;
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
            private readonly IConfiguration _configuration;
            private readonly IPersianDate _persianDate;


            public PaymentInsertHandler(IUserAccessor userAccessor, IUnitOfWork unitOfWork, IMapper mapper, IFileHelper fileHelper, IConfiguration configuration, IPersianDate persianDate)
            {
                _unitOfWork = unitOfWork;
                _userAccessor = userAccessor;
                _mapper = mapper;
                _fileHelper = fileHelper;
                _configuration = configuration;
                _persianDate = persianDate;
            }
            public async Task<ResultDTO<string>> Handle(PaymentInsertCommand request, CancellationToken cancellationToken)
            {
                if (request.IsUpdateMode == true)
                    throw new RestException(HttpStatusCode.BadRequest, "خطا، مود آپدیت...");

                if (!new int[2] { 10, 20 }.Contains(request.Type))
                    throw new RestException(HttpStatusCode.BadRequest, "خطا، پارامترهای ارسالی...");


                var user = await _userAccessor.GetUserData();
                if (user == null)
                    throw new RestException(HttpStatusCode.NotFound, "خطا، کاربری یافت نشد");

                if (user.DepartmentId == null)
                    throw new RestException(HttpStatusCode.BadRequest, "خطا، اطلاعات مجموعه وارد نشده است...");

                if (request.Type == 10 && _unitOfWork.paymentRepositoryAsync.Query().Where(n => n.DepartmentId == user.DepartmentId && n.PaymentType == 1).Any())
                    throw new RestException(HttpStatusCode.BadRequest, "شما قبلا از سرویس دمو 15 روزه استفاده کرده اید....");


                var pId = 500100;
                if (_unitOfWork.paymentRepositoryAsync.Query().Any())
                    pId = _unitOfWork.paymentRepositoryAsync.Query().Max(n => n.PID);

                var payment = new Payment();
                var paymentId = Guid.NewGuid();
                payment.Id = paymentId;
                payment.DepartmentId = user.DepartmentId.Value;
                payment.PID = ++pId;
                payment.IsDeleted = false;
                payment.InsertDate = DateTime.Now;
                payment.InsertUser = _userAccessor.GetCurrentUserName().ToLower();

                if (request.Type == 10) //Demo
                {
                    payment.Amount = "0";
                    payment.PaymentStatus = 1;
                    payment.PaymentType = 1;
                }
                else //Real
                {
                    if (_unitOfWork.paymentRepositoryAsync.Query().Where(n => n.DepartmentId == user.DepartmentId && n.PaymentType == 2 && n.PaymentStatus == 2).Any())
                        throw new RestException(HttpStatusCode.BadRequest, "کاربر گرامی، برای شما یک درخواست اشتراک یکساله پرداخت نشده وجود دارد.");

                    if (_unitOfWork.paymentRepositoryAsync.Query().Where(n => n.DepartmentId == user.DepartmentId && n.PaymentType == 2 && n.PaymentStatus == 3).Any())
                        if (_unitOfWork.paymentRepositoryAsync.Query().Where(n => n.DepartmentId == user.DepartmentId && n.PaymentType == 2 && n.PaymentStatus == 3 && DateTime.Compare(((DateTime)n.UpdateDate).AddYears(1), DateTime.Now) < 30).Any())
                            throw new RestException(HttpStatusCode.BadRequest, "کاربر گرامی، برای شما سرویس اشتراک یکساله فعال می باشد.");

                    payment.PaymentStatus = 2;
                    payment.PaymentType = 2;
                    payment.Amount = _configuration["PaymentConfig:ServiceForOneYear"].ToString();
                }
                try
                {
                    await _unitOfWork.paymentRepositoryAsync.AddAsync(payment);
                    var success = await _unitOfWork.SaveAsync() > 0;
                    if (success)
                        return new ResultDTO<string>(HttpStatusCode.OK, "اطلاعات پرداخت با موفقیت ثبت شد.");
                    throw new RestException(HttpStatusCode.BadRequest, "خطا در عملیات ثبت");
                }
                catch (Exception ex)
                {
                    throw new RestException(HttpStatusCode.BadRequest, "خطا در عملیات ثبت");
                }
            }
        }
    }
}