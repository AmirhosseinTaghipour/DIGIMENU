using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace BS.Application.Features.Payments.DTOs
{
    public class PaymentEnvelope
    {
        public List<PaymentListItemDTO> PaymentList { get; set; }
        public int PaymentCount { get; set; }
    }
}
