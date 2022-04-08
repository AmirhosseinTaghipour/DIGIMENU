using BS.Application.Common;
using Microsoft.AspNetCore.Http;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace BS.Application.Interfaces
{
    public interface IFileHelper
    {
        bool DeleteFile(string fileId, string fileExtension, FileDirectorey directorey);
        Task<bool> SaveFileAsync(IFormFile file, FileDirectorey directorey, string fileId, bool isImage = false);
        string GetFilePath(string fileId, string fileName, FileDirectorey directorey );
        bool IsValidFile(IFormFile file);
        bool IsValidSize(IFormFile file);

    }
}

