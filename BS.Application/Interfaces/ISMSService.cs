using BS.Application.Common.Models;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace BS.Application.Interfaces
{
    public interface ISMSService
    {
        string GenerateConfirmCode(int size);
        Task SendSMSAsync(SMSRequest request);
    }
}
