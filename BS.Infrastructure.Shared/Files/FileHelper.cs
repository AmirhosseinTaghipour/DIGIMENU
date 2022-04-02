using BS.Application.Common;
using BS.Application.Interfaces;
using BS.Application.Interfaces.Repositories;
using BS.Domain.Entities;
using Microsoft.AspNetCore.Hosting;
using Microsoft.AspNetCore.Http;
using Microsoft.Extensions.Configuration;
using System;
using System.Collections.Generic;
using System.IO;
using System.Linq;
using System.Net;
using System.Text;
using System.Threading.Tasks;


namespace BS.Infrastructure.Shared.Files
{
    public class FileHelper : IFileHelper
    {
        private readonly IWebHostEnvironment _environment;
        private readonly IConfiguration _configuration;

        public FileHelper(IWebHostEnvironment environment, IConfiguration configuration)
        {
            _environment = environment;
            _configuration = configuration;
        }

        public bool DeleteFile(string fileId, string fileExtension, FileDirectorey directorey)
        {
            try
            {
                string pathString = Path.Combine(_environment.WebRootPath, directorey.ToString());
                System.IO.File.Delete(Path.Combine(pathString, fileId + fileExtension));
                return true;
            }
            catch (Exception ex)
            {
                throw new RestException(HttpStatusCode.Conflict, "خطا در هنگام حذف فایل");
            }
        }


        public string GetFilePath(string fileId, string fileName, FileDirectorey directorey)
        {
            try
            {
                if (string.IsNullOrEmpty(fileName))
                    return "";
                string subString = Path.Combine(directorey.ToString(), fileId + Path.GetExtension(fileName));
                string fullString = Path.Combine(_environment.WebRootPath, subString);

                if (System.IO.File.Exists(fullString))
                {
                    return subString;
                }
                return "";
            }
            catch (Exception ex)
            {
                return "";
            }
        }

        public bool IsValidFile(IFormFile file)
        {
            var allowableFileList = _configuration.GetSection("FileConfig:AllowedFileType").Get<string[]>();
            bool res = true;
            if (file != null)
                if (!allowableFileList.Contains(file.ContentType))
                    res = false;
            return res;
        }

        public bool IsValidSize(IFormFile file)
        {
            var size = int.Parse(_configuration["FileConfig:AllowedFileSize"].ToString());

            if (file == null)
            {
                return true;
            }
            if (file.Length > size * 1024)
            {
                return false;
            }
            return true;
        }

        public async Task<bool> SaveFileAsync(IFormFile file, FileDirectorey directorey, string fileId)
        {
            if (file == null && string.IsNullOrEmpty(fileId))
            {
                return false;
            }

            try
            {
                string pathString = Path.Combine(_environment.WebRootPath, directorey.ToString());
                if (!Directory.Exists(pathString))
                {
                    Directory.CreateDirectory(pathString);
                }
                string fileName = fileId + Path.GetExtension(file.FileName);
                var filePath = Path.Combine(pathString, fileName);
                using (var stream = new FileStream(filePath, FileMode.Create))
                {
                    await file.CopyToAsync(stream);
                }
                return true;
            }
            catch (Exception ex)
            {
                throw new RestException(HttpStatusCode.Conflict, "خطا در هنگام ذخیره فایل");
            }



        }
    }
}
