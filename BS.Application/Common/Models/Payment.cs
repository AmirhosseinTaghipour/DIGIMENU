using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace BS.Application.Common.Models
{
    public class TokenResponse
    {
        public int code { get; set; }
        public string trans_id { get; set; }

    }

    public class InquiryResponse
    {
        public int code { get; set; }
        public int amount { get; set; }
        public string order_id { get; set; }
        public string card_holder { get; set; }
        public string customer_phone { get; set; }
        public string Shaparak_Ref_Id { get; set; }
        public string custom { get; set; }
        public string created_at { get; set; }

    }
}
