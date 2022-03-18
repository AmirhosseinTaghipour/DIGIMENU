using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace BS.Application.Interfaces
{
    public interface IJwtGenerator
    {
        string CreateToken(Guid CurrentUserID, string roleCode, string CurrentUserName, Guid currentRoleId, DateTime? expiers);
    }
}
