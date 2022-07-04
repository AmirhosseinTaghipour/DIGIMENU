using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace BS.Application.Features.UserLogs.DTOs
{
    public class UserLogFormDTO
    {
        public string Id { get; set; }
        public string Name { get; set; }
        public string UserName { get; set; }
        public string Date { get; set; }
        public string Ip { get; set; }
        public string Status { get; set; }
    }
}
