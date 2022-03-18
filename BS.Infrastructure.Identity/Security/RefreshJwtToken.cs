using BS.Application.Interfaces;
using Microsoft.Extensions.Configuration;
using Microsoft.IdentityModel.Tokens;
using System;
using System.Collections.Generic;
using System.IdentityModel.Tokens.Jwt;
using System.Linq;
using System.Security.Claims;
using System.Text;
using System.Threading.Tasks;

namespace BS.Infrastructure.Identity.Security
{
    public class RefreshJwtToken : IRefreshJwtToken
    {
        private readonly SymmetricSecurityKey _key;
        private readonly SymmetricSecurityKey _encryptingCredentials;

        public RefreshJwtToken(IConfiguration config)
        {
            _key = new SymmetricSecurityKey(Encoding.ASCII.GetBytes(config["JwtConfig:RefreshTokenSecretKey"]));
            _encryptingCredentials = new SymmetricSecurityKey(Encoding.ASCII.GetBytes(config["JwtConfig:RefreshTokenEncryptingCredentials"]));
        }

        public string CreateToken(Guid currentUserID, DateTime? expiers)
        {
            var claims = new List<Claim>
            {
                new Claim("Id", currentUserID.ToString()),
            };

            var creds = new SigningCredentials(_key, SecurityAlgorithms.HmacSha512Signature);
            var encryptingCreds = new EncryptingCredentials(_encryptingCredentials, SecurityAlgorithms.Aes128KW, SecurityAlgorithms.Aes128CbcHmacSha256);

            var tokenDescriptor = new SecurityTokenDescriptor
            {
                Subject = new ClaimsIdentity(claims),
                Expires = expiers ?? DateTime.Now.AddMinutes(30),
                SigningCredentials = creds,
                EncryptingCredentials = encryptingCreds
            };

            var tokenHandler = new JwtSecurityTokenHandler();
            var token = tokenHandler.CreateToken(tokenDescriptor);

            return tokenHandler.WriteToken(token);

        }

        public bool ValidateToken(string token, out IEnumerable<Claim> claims)
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
                }, out validatedToken);
                claims = claimsPrincipal.Claims;

            }
            catch (Exception ex)
            {
                claims = null;
                return false;
            }
            return true;
        }
    }
}
