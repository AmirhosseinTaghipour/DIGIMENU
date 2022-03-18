using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace BS.Application.Interfaces
{
    public interface IPasswordHelper
    {
        string GetEncryptedPassword(string password, string salt);
        bool IsPasswordCorrect(string inputPassword, string encodedPassword, string salt);
        string GenerateSalt();

    }
}
