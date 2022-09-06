using BS.Application.Common.DTOs;
using BS.Application.Common.Models;
using BS.Application.Interfaces;
using BS.Application.Interfaces.Repositories;
using Microsoft.Extensions.Configuration;
using Newtonsoft.Json;
using RestSharp;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Net;
using System.Text;
using System.Threading.Tasks;

namespace BS.Infrastructure.Shared.Services
{
    public class PaymentService : IPaymentService
    {
        private readonly string _bankUri;
        private readonly string _apiKey;
        private readonly string _callBackUri;
        private readonly IUnitOfWork _unitOfWork;
        public PaymentService(IConfiguration configuration, IUnitOfWork unitOfWork)
        {
            _unitOfWork = unitOfWork;
            _bankUri = configuration["PaymentConfig:BankUri"].ToString();
            _apiKey = configuration["PaymentConfig:ApiKey"].ToString();
            _callBackUri = configuration["PaymentConfig:CallbackUri"].ToString();
        }

        public Task<ResultDTO<string>> CancelPayment(string paymentId)
        {
            //Todo: this parameter is not important
            throw new NotImplementedException();
        }

        public async Task<ResultDTO<string>> GetRedirectLink(string paymentId)
        {
            var payment = await _unitOfWork.paymentRepositoryAsync.GetByIdAsync(new Guid(paymentId));
            if (payment == null)
                return new ResultDTO<string>(HttpStatusCode.NotFound, "رکورد پرداخت یافت نشد");
            if (string.IsNullOrEmpty(payment.TransactionId))
                return new ResultDTO<string>(HttpStatusCode.BadRequest, "توکن پرداخت یافت نشد");

            return new ResultDTO<string>(HttpStatusCode.OK, "لینک پرداخت با موفقیت ایجاد شد", _bankUri + "/payment/" + payment.TransactionId);
        }

        public async Task<ResultDTO<string>> GetTransactionToken(string paymentId)
        {
            var payment = await _unitOfWork.paymentRepositoryAsync.GetByIdAsync(new Guid(paymentId));
            if (payment == null)
                return new ResultDTO<string>(HttpStatusCode.NotFound, "رکورد پرداخت یافت نشد");
            var client = new RestClient(_bankUri + "/token");


            client.Timeout = -1;
            var request = new RestRequest(Method.POST);
            request.AddHeader("Content-Type", "application/x-www-form-urlencoded");
            request.AddParameter("api_key", _apiKey);
            request.AddParameter("amount", long.Parse(payment.Amount));
            request.AddParameter("order_id", payment.PID.ToString());
            request.AddParameter("callback_uri", _callBackUri);
            IRestResponse response = await client.ExecuteAsync(request);

            if (response.StatusCode != HttpStatusCode.OK)
                return new ResultDTO<string>(HttpStatusCode.BadRequest, "خطا در دریافت توکن");

            var responseJson = JsonConvert.DeserializeObject<TokenResponse>(response.Content);
            if (responseJson.code != -1)
                return new ResultDTO<string>(HttpStatusCode.BadRequest, "خطا در دریافت توکن");

            payment.TransactionId = responseJson.trans_id;
            payment.UpdateDate = DateTime.Now;
            _unitOfWork.paymentRepositoryAsync.Update(payment);

            var success = await _unitOfWork.SaveAsync() > 0;
            if (success)
                return new ResultDTO<string>(HttpStatusCode.OK, "توکن با موفقیت ذخیره شد.", responseJson.trans_id);

            return new ResultDTO<string>(HttpStatusCode.BadRequest, "خطا در ذخیره توکن پرداخت");
        }


        public async Task<ResultDTO<string>> InquiryPayment(string paymentId)
        {
            var success = false;
            var payment = await _unitOfWork.paymentRepositoryAsync.GetByIdAsync(new Guid(paymentId));
            if (payment == null)
                return new ResultDTO<string>(HttpStatusCode.NotFound, "رکورد پرداخت یافت نشد");

            if (string.IsNullOrEmpty(payment.TransactionId))
                return new ResultDTO<string>(HttpStatusCode.BadRequest, "توکن پرداخت یافت نشد");

            var client = new RestClient(_bankUri + "/verify");
            client.Timeout = -1;
            var request = new RestRequest(Method.POST);
            request.AddHeader("Content-Type", "application/x-www-form-urlencoded");
            request.AddParameter("api_key", _apiKey);
            request.AddParameter("amount", long.Parse(payment.Amount));
            request.AddParameter("trans_id", payment.TransactionId);
            IRestResponse response = client.Execute(request);
            if (response.StatusCode != HttpStatusCode.OK)
                return new ResultDTO<string>(HttpStatusCode.BadRequest, "خطا در دریافت توکن");

            var responseJson = JsonConvert.DeserializeObject<InquiryResponse>(response.Content);
            payment.CardNumber = responseJson.card_holder;
            payment.RefID = responseJson.Shaparak_Ref_Id;
            payment.UpdateDate = DateTime.Now;

            if (responseJson.code != 0)
            {
                _unitOfWork.paymentRepositoryAsync.Update(payment);
                success = await _unitOfWork.SaveAsync() > 0;
                if (success)
                    return new ResultDTO<string>(HttpStatusCode.BadRequest, "پرداخت ناموفق.");

                return new ResultDTO<string>(HttpStatusCode.BadRequest, "پرداخت ناموفق/ خطا در آپدیت رکورد پرداخت.");
            }

            payment.PaymentStatus = 3;
            payment.PDate = responseJson.created_at.Split()[0].ToString();
            payment.PTime = responseJson.created_at.Split()[1].ToString();

            _unitOfWork.paymentRepositoryAsync.Update(payment);
            success = await _unitOfWork.SaveAsync() > 0;
            if (success)
                return new ResultDTO<string>(HttpStatusCode.OK, "پرداخت موفق");

            return new ResultDTO<string>(HttpStatusCode.BadRequest, "پراخت موفق/ خطا در آپدیت رکورد پرداخت");
        }
    }
}
