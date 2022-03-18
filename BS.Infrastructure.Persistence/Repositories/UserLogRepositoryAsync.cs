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
    public class UserLogRepositoryAsync : GenericRepositoryAsync<UserLog>, IUserLogRepositoryAsync
    {
        public UserLogRepositoryAsync(Storage context) : base(context) { }

        public async Task<UserLog> LastSuccessfullLogin(Guid userId, string ip, DateTime from)
        {
            return await Query()
                 .Where(n => n.UserId == userId
                 && n.StatusCode == 1
                 && n.UserIp == ip
                 && DateTime.Compare(n.InsertDate, from) > 0)
                 .OrderByDescending(n => n.InsertDate)
                 .AsNoTracking()
                 .FirstOrDefaultAsync();
        }

        public async Task<IEnumerable<UserLog>> LastUnsuccessfullLogin(Guid userId, string ip, DateTime from)
        {
            return await Query()
                .Where(n => n.UserId == userId
                && n.StatusCode == 2
                && n.UserIp == ip
                && DateTime.Compare(n.InsertDate, from) > 0)
                .OrderByDescending(n => n.InsertDate)
                .AsNoTracking()
                .ToListAsync();

        }
    }
}