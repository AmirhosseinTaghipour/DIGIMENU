using BS.Application.Common.Models;
using BS.Application.Interfaces;
using BS.Application.Interfaces.Repositories;
using BS.Domain.Entities;
using Microsoft.Extensions.Configuration;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace BS.Infrastructure.Shared.Services
{
    public class SMSService : ISMSService
    {
        private readonly string _userName;
        private readonly string _password;
        private readonly string _smsNumber;
        private readonly IUnitOfWork _unitOfWork;
        public SMSService(IConfiguration configuration, IUnitOfWork unitOfWork)
        {
            _unitOfWork = unitOfWork;
            _userName = configuration["SMSConfig:UserName"].ToString();
            _password = configuration["SMSConfig:Password"].ToString();
            _smsNumber = configuration["SMSConfig:SMSNumber"].ToString();
        }
        public string GenerateConfirmCode(int size)
        {
            Random random = new Random();
            StringBuilder st = new StringBuilder();
            for (int i = 0; i < size; i++)
            {
                st.Append(random.Next(0, 9));
            }

            return st.ToString();
        }

        public async Task SendSMSAsync(SMSRequest request)
        {
            MeliPayamakService meliPayamak = new MeliPayamakService(_userName, _password, _smsNumber);
            RestResponse response = await meliPayamak.SendAsync(request.To, request.Body);
            await _unitOfWork.smsLogRepositoryAsync.AddAsync(new SMSLog()
            {
                Id = Guid.NewGuid(),
                InsertUser = request.UserName,
                InsertDate = DateTime.Now,
                MessageBody = request.Body,
                Mobile = request.To,
                Type = request.Type,
                KeyPrameter = request.KeyParam,
                Response = response.RetStatus,
                UserId = !string.IsNullOrEmpty(request.UserId) ? new Guid(request.UserId) : null
            });
            await _unitOfWork.SaveAsync();
        }
    }
}
