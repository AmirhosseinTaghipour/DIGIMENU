using BS.Application.Interfaces;
using BS.Infrastructure.Shared.Files;
using BS.Infrastructure.Shared.Persian;
using BS.Infrastructure.Shared.Services;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.DependencyInjection;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace BS.Infrastructure.Shared
{
    public static class ServiceExtensions
    {
        public static void AddSharedInfrastructure(this IServiceCollection services, IConfiguration configuration)
        {
            #region  Injection Services
            services.AddScoped<IEmailService, EmailService>();
            services.AddScoped<ISMSService, SMSService>();
            services.AddScoped<IAdjustChar, AdjustChar>();
            services.AddScoped<IPersianDate, PersianDate>();
            services.AddScoped<IFileHelper, FileHelper>();
            #endregion
        }
    }
}
