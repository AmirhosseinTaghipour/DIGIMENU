using BS.Application.Common.DTOs;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace BS.Application.Interfaces
{
    public interface IPaymentService
    {
        Task<ResultDTO<string>> GetTransactionToken(string paymentId);
        Task<ResultDTO<string>> GetRedirectLink(string paymentId);
        Task<ResultDTO<string>> InquiryPayment(string paymentId);
        Task<ResultDTO<string>> CancelPayment(string paymentId);
    }
}
