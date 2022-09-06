using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace BS.Application.Features.Payments.DTOs
{
    public class PaymentResultDTO
    {
        public string PId { get; set; }
        public string RefId { get; set; }
        public string PTime { get; set; }
        public string PDate { get; set; }
        public string Amount { get; set; }
        public string Message { get; set; }
        public bool IsPaid { get; set; }
    }
}
