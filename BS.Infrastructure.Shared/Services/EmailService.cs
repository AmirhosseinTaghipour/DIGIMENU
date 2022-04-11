using BS.Application.Common.Models;
using BS.Application.Interfaces;
using Newtonsoft.Json;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Net.Http;
using System.Text;
using System.Threading.Tasks;

namespace BS.Infrastructure.Shared.Services
{
    public class EmailService : IEmailService
    {
        public async Task SendMailAsync(EmailRequest request)
        {
        }
    }
}