using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace BS.Application.Interfaces
{
    public interface IEncryption
    {
        string Encrypt(string toEncrypt);
        string Decrypt(string cipherString);
    }
}
