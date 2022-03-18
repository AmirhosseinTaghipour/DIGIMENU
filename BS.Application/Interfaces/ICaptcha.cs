using BS.Application.Common;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Security.Claims;
using System.Text;
using System.Threading.Tasks;

namespace BS.Application.Interfaces
{
    public interface ICaptcha
    {
        string GenerateCaptchaCode();
        bool ValidateCaptchaCode(string userInputCaptcha, string token);
        byte[] GenerateCaptchaImage(int width, int height, string captchaCode);
        string CreateToken(string code, DateTime? expiers);
    }
}
