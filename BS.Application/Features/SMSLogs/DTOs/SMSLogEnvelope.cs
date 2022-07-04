using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace BS.Application.Features.SMSLogs.DTOs
{
    public class SMSLogEnvelope
    {
        public List<SMSLogListItemDTO> SmsLogList { get; set; }
        public int smsLogCount { get; set; }
    }
}
