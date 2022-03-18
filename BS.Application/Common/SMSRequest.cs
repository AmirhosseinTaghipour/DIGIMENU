using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace BS.Application.Common
{
    public class SMSRequest
    {
        public string To { get; set; }
        public string Body { get; set; }
        public string Type { get; set; }
        public string KeyParam { get; set; }
        public string? UserId { get; set; }
        public string? UserName { get; set; }
    }
}
