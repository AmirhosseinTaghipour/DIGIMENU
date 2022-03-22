using BS.Application.Interfaces.Repositories;
using BS.Domain.Entities;
using BS.Infrastructure.Persistence.Contexts;
using Microsoft.EntityFrameworkCore;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace BS.Infrastructure.Persistence.Repositories
{
    public class SMSLogRepositoryAsync : GenericRepositoryAsync<SMSLog>, ISMSLogRepositoryAsync
    {
        public SMSLogRepositoryAsync(Storage context) : base(context) { }

        public async Task<int> LastSendedSMSCount(Guid userId, DateTime from)
        {
            var res = 0;
            res = await Query()
                .Where(n => n.UserId == userId
                && n.Response == 1
                && DateTime.Compare(n.InsertDate, from) > 0)
                .OrderByDescending(n => n.InsertDate)
                .AsNoTracking()
                .CountAsync();
            return res;
        }
    }
}
