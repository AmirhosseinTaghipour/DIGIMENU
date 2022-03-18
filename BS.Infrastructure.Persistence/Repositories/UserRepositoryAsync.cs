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
    public class UserRepositoryAsync : GenericRepositoryAsync<User>, IUserRepositoryAsync
    {
        public UserRepositoryAsync(Storage context) : base(context) { }
        public async Task LogicDelete(Guid id)
        {
            var user = await GetByIdAsync(id);
            user.IsDeleted = true;
            Update(user);
        }
    }
}
