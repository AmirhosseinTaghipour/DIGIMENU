using System;
using System.Collections.Generic;
using System.Linq;
using System.Security.Claims;
using System.Text;
using System.Threading.Tasks;

namespace BS.Application.Interfaces
{
    public interface IRefreshJwtToken
    {
        string CreateToken(Guid currentUserID, DateTime? expiers);
        bool ValidateToken(string token, out IEnumerable<Claim> claims);

        //string GetClaim(string token, string claimType);

    }
}
