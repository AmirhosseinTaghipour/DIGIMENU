using BS.Application.Common;
using BS.Application.Interfaces;
using BS.Application.Interfaces.Repositories;
using BS.Domain.Entities;
using Microsoft.AspNetCore.Hosting;
using Microsoft.AspNetCore.Http;
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
        private IWebHostEnvironment _environment;

        public FileHelper(IWebHostEnvironment environment)
        {
            _environment = environment;
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


        public IFormFile GetFile(string fileId, string fileName, FileDirectorey directorey)
        {
            try
            {
                IFormFile file;
                string pathString = Path.Combine(_environment.WebRootPath, directorey.ToString());
                var fileStream = System.IO.File.OpenRead(Path.Combine(pathString, fileId + Path.GetExtension(fileName)));
                using (var stream = fileStream)
                {
                    file = new FormFile(stream, 0, stream.Length, "file", fileName);
                }
                return file;
            }
            catch (Exception ex)
            {
                throw new RestException(HttpStatusCode.Conflict, "خطا در هنگام خواندن فایل");
            }
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
