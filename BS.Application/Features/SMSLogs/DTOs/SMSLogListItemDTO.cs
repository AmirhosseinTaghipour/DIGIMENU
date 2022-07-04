using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace BS.Application.Features.SMSLogs.DTOs
{
    public class SMSLogListItemDTO
    {
        public string Key { get; set; }
        public string Id { get; set; }
        public string Receiver { get; set; }
        public string Mobile { get; set; }
        public string KeyParam { get; set; }
        public string Type { get; set; }
        public string status { get; set; }
    }
}