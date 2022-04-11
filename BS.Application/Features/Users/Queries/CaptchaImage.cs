using BS.Application.Interfaces;
using MediatR;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Net;
using System.Text;
using System.Threading;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Http;
using BS.Application.Common.DTOs;
using BS.Application.Common.Models;

namespace BS.Application.Features.Users.Queries
{
    public class CaptchaImage
    {

        public class CaptchaImageQuery : IRequest<CaptchaImageDTO>
        {

        }

        public class CaptchaImageHandler : IRequestHandler<CaptchaImageQuery, CaptchaImageDTO>
        {
            private readonly ICaptcha _captcha;
            private readonly IHttpContextAccessor _httpContextAccessor;
            private readonly IAdjustChar _adjustChar;

            public CaptchaImageHandler(ICaptcha captcha, IHttpContextAccessor httpContextAccessor, IAdjustChar adjustChar)
            {
                _captcha = captcha;
                _httpContextAccessor = httpContextAccessor;
                _adjustChar = adjustChar;
            }

            public async Task<CaptchaImageDTO> Handle(CaptchaImageQuery request, CancellationToken cancellationToken)
            {
                int width = 116;
                int height = 34;
                var captchaCode = _captcha.GenerateCaptchaCode();
                var captchaImage = _captcha.GenerateCaptchaImage(width, height, captchaCode);
                var captchaToken = _captcha.CreateToken(captchaCode, DateTime.Now.AddMinutes(10));

                if (captchaImage != null)
                {
                    return new CaptchaImageDTO
                    {
                        Image = Convert.ToBase64String(captchaImage),
                        Token = captchaToken,
                    };
                }

                throw new RestException(HttpStatusCode.BadRequest, "خطا در ایجاد تصویر کپچا");
            }
        }
    }
}
