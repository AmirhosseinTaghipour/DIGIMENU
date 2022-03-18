using BS.Application.Interfaces;
using Microsoft.AspNetCore.Http;
using System;
using System.Collections.Generic;
using System.Drawing;
using System.Drawing.Imaging;
using System.IO;
using System.Net;
using System.Text;
using System.Threading.Tasks;
using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;
using Microsoft.IdentityModel.Tokens;
using Microsoft.Extensions.Configuration;
using System.Linq;
using BS.Application.Common;

namespace BS.Infrastructure.Identity.Security
{
    public class Captcha : ICaptcha
    {
        const string Letters = "۰۱۲۳۴۵۶۷۸۹";
        private readonly IHttpContextAccessor _httpContextAccessor;
        private readonly IAdjustChar _adjustChar;
        private readonly SymmetricSecurityKey _key;
        private readonly SymmetricSecurityKey _encryptingCredentials;

        public Captcha(IHttpContextAccessor httpContextAccessor, IConfiguration config, IAdjustChar adjustChar)
        {
            _httpContextAccessor = httpContextAccessor;
            _adjustChar = adjustChar;
            _key = new SymmetricSecurityKey(Encoding.ASCII.GetBytes(config["JwtConfig:CaptchaSecretKey"]));
            _encryptingCredentials = new SymmetricSecurityKey(Encoding.ASCII.GetBytes(config["JwtConfig:CaptchaEncryptingCredentials"]));
        }

        public string GenerateCaptchaCode()
        {
            Random rand = new Random();
            int maxRand = Letters.Length - 1;

            StringBuilder sb = new StringBuilder();

            for (int i = 0; i < 4; i++)
            {
                int index = rand.Next(maxRand);
                sb.Append(Letters[index]);
            }

            return sb.ToString();
        }

        public bool ValidateCaptchaCode(string userInputCaptcha, string jwtToken)
        {
            try
            {
                IEnumerable<Claim> claims;
                if (!ValidateToken(jwtToken, out claims))
                {
                    return false;
                }

                var code = claims.First(c => c.Type == "Code").Value;
                var expiers = claims.First(c => c.Type == "Expiers").Value;

                if (Convert.ToDateTime(expiers) < DateTime.Now)
                {
                    throw new RestException(HttpStatusCode.BadRequest, "مقدار تصویر امنیتی منقضی شده است");
                }

                if (_adjustChar.PersianNumbersToEnglish(code) == _adjustChar.PersianNumbersToEnglish(userInputCaptcha))
                {
                    return true;
                }
                else
                {
                    throw new RestException(HttpStatusCode.BadRequest, "تصویر امنیتی به درستی وارد نشده است" );
                }
            }
            catch (RestException restEx)
            {
                throw new RestException(HttpStatusCode.BadRequest, restEx.Message);
            }
            catch (Exception ex)
            {
                throw new RestException(HttpStatusCode.BadRequest,  "خطا در پردازش تصویر امنیتی" );
            }

        }

        public string CreateToken(string code, DateTime? expiers)
        {
            var exp = expiers != null ? expiers : DateTime.Now.AddSeconds(65);
            var claims = new List<Claim>
            {
                new Claim("Code", code),
                new Claim("Expiers", expiers.ToString())
            };

            var creds = new SigningCredentials(_key, SecurityAlgorithms.HmacSha512Signature);
            var encryptingCreds = new EncryptingCredentials(_encryptingCredentials, SecurityAlgorithms.Aes128KW, SecurityAlgorithms.Aes128CbcHmacSha256);

            var tokenDescriptor = new SecurityTokenDescriptor
            {
                Subject = new ClaimsIdentity(claims),
                Expires = expiers ?? DateTime.Now.AddMinutes(2),
                SigningCredentials = creds,
                EncryptingCredentials = encryptingCreds
            };

            var tokenHandler = new JwtSecurityTokenHandler();
            var token = tokenHandler.CreateToken(tokenDescriptor);
            return tokenHandler.WriteToken(token);
        }

        private bool ValidateToken(string token, out IEnumerable<Claim> claims)
        {
            SecurityToken validatedToken;
            var tokenHandler = new JwtSecurityTokenHandler();

            try
            {
                var claimsPrincipal = tokenHandler.ValidateToken(token, new TokenValidationParameters
                {
                    ValidateIssuerSigningKey = true,
                    IssuerSigningKey = _key,
                    TokenDecryptionKey = _encryptingCredentials,
                    ValidateAudience = false,
                    ValidateIssuer = false,
                    ValidateLifetime = true,
                    RequireExpirationTime = true,
                    ClockSkew = TimeSpan.FromSeconds(0),
                }, out validatedToken); ;
                claims = claimsPrincipal.Claims;
            }
            catch (Exception ex)
            {
                claims = null;
                return false;
            }

            return true;
        }

        public byte[] GenerateCaptchaImage(int width, int height, string captchaCode)
        {
            using (Bitmap baseMap = new Bitmap(width, height))
            using (Graphics graph = Graphics.FromImage(baseMap))
            {
                Random rand = new Random();

                graph.Clear(GetRandomLightColor());

                DrawCaptchaCode();
                DrawDisorderLine();
                AdjustRippleEffect();

                MemoryStream ms = new MemoryStream();

                baseMap.Save(ms, ImageFormat.Png);

                return ms.ToArray();


                int GetFontSize(int imageWidth, int captchCodeCount)
                {
                    var averageSize = imageWidth / captchCodeCount;

                    return Convert.ToInt32(averageSize);
                }

                Color GetRandomDeepColor()
                {
                    int redlow = 160, greenLow = 100, blueLow = 160;
                    return Color.FromArgb(rand.Next(redlow), rand.Next(greenLow), rand.Next(blueLow));
                }

                Color GetRandomLightColor()
                {
                    int low = 180, high = 255;

                    int nRend = rand.Next(high) % (high - low) + low;
                    int nGreen = rand.Next(high) % (high - low) + low;
                    int nBlue = rand.Next(high) % (high - low) + low;

                    return Color.FromArgb(nRend, nGreen, nBlue);
                }

                void DrawCaptchaCode()
                {
                    SolidBrush fontBrush = new SolidBrush(Color.Black);
                    int fontSize = GetFontSize(width, captchaCode.Length);
                    Font font = new Font("IRANSans", fontSize, FontStyle.Bold, GraphicsUnit.Pixel);
                    for (int i = 0; i < captchaCode.Length; i++)
                    {
                        fontBrush.Color = GetRandomDeepColor();

                        int shiftPx = fontSize / 6;

                        float x = i * fontSize + rand.Next(-shiftPx, shiftPx) + rand.Next(-shiftPx, shiftPx);
                        int maxY = height - fontSize;
                        if (maxY < 0) maxY = 0;
                        float y = rand.Next(0, maxY);

                        graph.DrawString(captchaCode[i].ToString(), font, fontBrush, x, y);
                    }
                }

                void DrawDisorderLine()
                {
                    Pen linePen = new Pen(new SolidBrush(Color.Black), 3);
                    for (int i = 0; i < rand.Next(3, 5); i++)
                    {
                        linePen.Color = GetRandomDeepColor();

                        Point startPoint = new Point(rand.Next(0, width), rand.Next(0, height));
                        Point endPoint = new Point(rand.Next(0, width), rand.Next(0, height));
                        graph.DrawLine(linePen, startPoint, endPoint);
                    }
                }

                void AdjustRippleEffect()
                {
                    short nWave = 6;
                    int nWidth = baseMap.Width;
                    int nHeight = baseMap.Height;

                    Point[,] pt = new Point[nWidth, nHeight];

                    for (int x = 0; x < nWidth; ++x)
                    {
                        for (int y = 0; y < nHeight; ++y)
                        {
                            var xo = nWave * Math.Sin(2.0 * 3.1415 * y / 128.0);
                            var yo = nWave * Math.Cos(2.0 * 3.1415 * x / 128.0);

                            var newX = x + xo;
                            var newY = y + yo;

                            if (newX > 0 && newX < nWidth)
                            {
                                pt[x, y].X = (int)newX;
                            }
                            else
                            {
                                pt[x, y].X = 0;
                            }


                            if (newY > 0 && newY < nHeight)
                            {
                                pt[x, y].Y = (int)newY;
                            }
                            else
                            {
                                pt[x, y].Y = 0;
                            }
                        }
                    }

                    Bitmap bSrc = (Bitmap)baseMap.Clone();

                    BitmapData bitmapData = baseMap.LockBits(new Rectangle(0, 0, baseMap.Width, baseMap.Height), ImageLockMode.ReadWrite, PixelFormat.Format24bppRgb);
                    BitmapData bmSrc = bSrc.LockBits(new Rectangle(0, 0, bSrc.Width, bSrc.Height), ImageLockMode.ReadWrite, PixelFormat.Format24bppRgb);

                    int scanline = bitmapData.Stride;

                    IntPtr scan0 = bitmapData.Scan0;
                    IntPtr srcScan0 = bmSrc.Scan0;

                    baseMap.UnlockBits(bitmapData);
                    bSrc.UnlockBits(bmSrc);
                    bSrc.Dispose();
                }
            }
        }
    }
}
