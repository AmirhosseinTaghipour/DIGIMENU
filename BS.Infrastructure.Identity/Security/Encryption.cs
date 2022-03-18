using BS.Application.Interfaces;
using Microsoft.Extensions.Configuration;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Security.Cryptography;
using System.Text;
using System.Threading.Tasks;

namespace BS.Infrastructure.Identity.Security
{
    public class Encryption : IEncryption
    {
        private readonly string _key;
        public Encryption(IConfiguration configuration)
        {
            /*Dont Change this parameter*/
            _key="p@kSTK=bM!6NTxmyt*AS6gH!$b^499LM";
        }
        public string Encrypt(string toEncrypt)
        {
            if (toEncrypt == "") return "";
            bool useHashing = true;
            byte[] keyArray;
            byte[] toEncryptArray = UTF8Encoding.UTF8.GetBytes(toEncrypt);

   
            if (useHashing)
            {
                MD5CryptoServiceProvider hashmd5 = new MD5CryptoServiceProvider();
                keyArray = hashmd5.ComputeHash(UTF8Encoding.UTF8.GetBytes(_key));
                hashmd5.Clear();
            }
            else
                keyArray = UTF8Encoding.UTF8.GetBytes(_key);

            TripleDESCryptoServiceProvider tdes = new TripleDESCryptoServiceProvider
            {
                Key = keyArray,
                Mode = CipherMode.ECB,
                Padding = PaddingMode.PKCS7
            };

            ICryptoTransform cTransform = tdes.CreateEncryptor();
            byte[] resultArray = cTransform.TransformFinalBlock(toEncryptArray, 0, toEncryptArray.Length);
            tdes.Clear();
            return Convert.ToBase64String(resultArray, 0, resultArray.Length).Replace("=", "$$").Replace("+", "__").Replace("/", "~~");
        }

        public string Decrypt(string cipherString)
        {
            try
            {
                if (string.IsNullOrEmpty(cipherString)) return "";
                cipherString = cipherString.Replace("$$", "=");
                cipherString = cipherString.Replace("__", "+");
                cipherString = cipherString.Replace("~~", "/");
                //cipherString = cipherString.Replace(" ", "+");
                bool useHashing = true;
                byte[] keyArray;
                byte[] toEncryptArray = Convert.FromBase64String(cipherString);


                if (useHashing)
                {
                    MD5CryptoServiceProvider hashmd5 = new MD5CryptoServiceProvider();
                    keyArray = hashmd5.ComputeHash(UTF8Encoding.UTF8.GetBytes(_key));
                    hashmd5.Clear();
                }
                else
                    keyArray = UTF8Encoding.UTF8.GetBytes(_key);

                TripleDESCryptoServiceProvider tdes = new TripleDESCryptoServiceProvider
                {
                    Key = keyArray,
                    Mode = CipherMode.ECB,
                    Padding = PaddingMode.PKCS7
                };

                ICryptoTransform cTransform = tdes.CreateDecryptor();
                byte[] resultArray = cTransform.TransformFinalBlock(toEncryptArray, 0, toEncryptArray.Length);

                tdes.Clear();
                return UTF8Encoding.UTF8.GetString(resultArray);
            }
            catch (Exception)
            {
                return "Corrupted data";//cipherString;
            }
        }
    }
}
