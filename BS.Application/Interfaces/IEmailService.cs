using BS.Application.Common;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace BS.Application.Interfaces
{
    public interface IEmailService
    {
        Task SendMailAsync(EmailRequest request);
    }
}
