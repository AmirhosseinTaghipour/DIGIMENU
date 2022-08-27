using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace BS.Application.Features.Payments.DTOs
{
    public class PaymentFormDTO
    {
        public string Id { get; set; }
        public int Type { get; set; }
        public bool IsUpdateMode { get; set; } = false;
    }
}
