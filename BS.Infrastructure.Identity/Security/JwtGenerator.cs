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
    public class JwtGenerator : IJwtGenerator
    {
        private readonly SymmetricSecurityKey _key;
        private readonly SymmetricSecurityKey _encryptingCredentials;
        private readonly IConfiguration _configuration;

        public JwtGenerator(IConfiguration configuration)
        {
            _configuration = configuration;
            _key = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(_configuration["JwtConfig:SecretKey"]));
            _encryptingCredentials = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(_configuration["JwtConfig:EncryptingCredentials"]));

        }

        public string CreateToken(Guid currentUserID, string roleCode, string currentUserName, Guid currentRoleId, DateTime? expiers)
        {
            var claims = new List<Claim>
            {
                new Claim("Id", currentUserID.ToString()),
                new Claim(ClaimTypes.Role, roleCode),
                new Claim("UserName", currentUserName),
                new Claim("RoleId", currentRoleId.ToString()),
            };

            // generate signing credentials
            var creds = new SigningCredentials(_key, SecurityAlgorithms.HmacSha512Signature);
            var encryptingCreds = new EncryptingCredentials(_encryptingCredentials, SecurityAlgorithms.Aes128KW, SecurityAlgorithms.Aes128CbcHmacSha256);

            var tokenDescriptor = new SecurityTokenDescriptor
            {
                Subject = new ClaimsIdentity(claims),
                Expires = expiers ?? DateTime.Now.AddMinutes(2),
                SigningCredentials = creds,
                EncryptingCredentials = encryptingCreds,
            };

            var tokenHandler = new JwtSecurityTokenHandler();

            var token = tokenHandler.CreateToken(tokenDescriptor);


            return  tokenHandler.WriteToken(token);
        }
    }
}
