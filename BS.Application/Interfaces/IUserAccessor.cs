using BS.Domain.Entities;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace BS.Application.Interfaces
{
    public interface IUserAccessor
    {
        Guid GetCurrentUserId();
        Guid GetCurrentRoleId();
        string GetCurrentUserName();
        Task<User> GetUserData();
    }
}
