using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.DependencyInjection;
using Microsoft.IdentityModel.Tokens;
using System;
using System.Text;
using Microsoft.AspNetCore.Authentication.JwtBearer;
using BS.Application.Interfaces;
using BS.Infrastructure.Identity.Security;
using Microsoft.AspNetCore.Identity;
using BS.Domain.Entities;

namespace BS.Infrastructure.Identity
{
    public static class ServiceExtensions
    {
        public static void AddIdentityInfrastructure(this IServiceCollection services, IConfiguration config)
        {
            var key = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(config["JwtConfig:SecretKey"]));
            var encryptionkey = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(config["JwtConfig:EncryptingCredentials"]));
            services.AddAuthentication(option =>
            {
                option.DefaultAuthenticateScheme = JwtBearerDefaults.AuthenticationScheme;
                option.DefaultScheme = JwtBearerDefaults.AuthenticationScheme;
                option.DefaultChallengeScheme = JwtBearerDefaults.AuthenticationScheme;
            })
                .AddJwtBearer(opt =>
                {
                    opt.TokenValidationParameters = new TokenValidationParameters
                    {
                        ValidateIssuerSigningKey = true,
                        IssuerSigningKey = key,
                        ValidateAudience = false,
                        ValidateIssuer = false,
                        TokenDecryptionKey = encryptionkey,
                        ValidateLifetime = true,
                        RequireExpirationTime = true,
                        ClockSkew = TimeSpan.FromSeconds(0)
                    };
                });


            services.AddCors(opt =>
            {
                opt.AddPolicy("CorsPolicy", policy =>
                {
                    policy
                        .WithOrigins(config.GetSection("FrontEndOrigins").Get<string[]>())
                        .AllowAnyHeader()
                        .AllowAnyMethod()
                        .AllowCredentials()
                        ;
                });
            });
            #region  Injection Services
            services.AddScoped<IDataHelper, DataHelper>();
            services.AddScoped<IEncryption, Encryption>();
            services.AddScoped<IJwtGenerator, JwtGenerator>();
            services.AddScoped<IPasswordHelper, PasswordHelper>();
            services.AddScoped<IRefreshJwtToken, RefreshJwtToken>();
            services.AddScoped<IUserAccessor, UserAccessor>();
            services.AddScoped<ICaptcha, Captcha>();

            #endregion
        }

    }
}
