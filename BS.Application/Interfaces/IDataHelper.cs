using Microsoft.AspNetCore.Http;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace BS.Application.Interfaces
{
    public interface IDataHelper
    {
        public bool isSQL_Injection(string input);
        public bool isGuidNullOrEmpty(Guid? input);
        Task<string> SaveFile(IFormFile formFile);
        bool isValidFileType(IFormFile formFile);
        bool isValidFileSize(IFormFile formFile);

    }
}
