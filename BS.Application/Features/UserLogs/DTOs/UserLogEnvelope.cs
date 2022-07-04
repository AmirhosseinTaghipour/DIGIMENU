using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace BS.Application.Features.UserLogs.DTOs
{
    public class UserLogEnvelope
    {
        public List<UserLogListItemDTO> UserLogList { get; set; }
        public int UserLogCount { get; set; }
    }
}
