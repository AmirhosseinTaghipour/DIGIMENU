using BS.Application.Common.Models;
using BS.Application.Interfaces;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Security.Cryptography;
using System.Text;
using System.Threading.Tasks;

namespace BS.Infrastructure.Identity.Security
{
    public class PasswordHelper : IPasswordHelper
    {
        public string HashAlgorithmName = "SHA1";
        private const int SALT_SIZE_IN_BYTES = 16;
        public string GetEncryptedPassword(string password, string salt)
        {
            string pass = EncodePassword(password, salt);
            if (pass.Length > 128)
            {
                throw new RestException(System.Net.HttpStatusCode.NotFound, "رمز عبور وارد شده معتبر نمي باشد.");
            }
            return pass;
        }

        public bool IsPasswordCorrect(string inputPassword, string encodedPassword, string salt)
        {
            if (encodedPassword == EncodePassword(inputPassword, salt))
                return true;
            else
                return false;
        }


        public string GenerateSalt()
        {
            byte[] buf = new byte[SALT_SIZE_IN_BYTES];
            (new RNGCryptoServiceProvider()).GetBytes(buf);
            return Convert.ToBase64String(buf);
        }


        private string EncodePassword(string pass, string salt)
        {

            byte[] bIn = Encoding.Unicode.GetBytes(pass);
            byte[] bSalt = Convert.FromBase64String(salt);
            byte[] bAll = new byte[bSalt.Length + bIn.Length];
            byte[] bRet;

            Buffer.BlockCopy(bSalt, 0, bAll, 0, bSalt.Length);
            Buffer.BlockCopy(bIn, 0, bAll, bSalt.Length, bIn.Length);
            HashAlgorithm s = HashAlgorithm.Create(HashAlgorithmName);

            if (s == null)
            {
                throw new RestException(System.Net.HttpStatusCode.BadRequest, "Could not create a hash algorithm");
            }
            bRet = s.ComputeHash(bAll);

            return Convert.ToBase64String(bRet);
        }
    }
}
