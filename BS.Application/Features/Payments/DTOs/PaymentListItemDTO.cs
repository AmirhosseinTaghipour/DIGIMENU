using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace BS.Application.Features.Payments.DTOs
{
    public class PaymentListItemDTO
    {
        public string Key { get; set; }
        public string Id { get; set; }
        public int PId { get; set; }
        public string Title { get; set; }
        public string Amount { get; set; }
        public string PDate { get; set; }
        public string PTime { get; set; }
        public string ExpireDate { get; set; }
        public bool IsActivated { get; set; } = false;
    }
}
