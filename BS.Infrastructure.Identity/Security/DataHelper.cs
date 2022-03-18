using BS.Application.Interfaces;
using Microsoft.AspNetCore.Hosting;
using Microsoft.AspNetCore.Http;
using Microsoft.Extensions.Configuration;
using System;
using System.Collections.Generic;
using System.Drawing;
using System.Drawing.Imaging;
using System.IO;
using System.Linq;
using System.Text;
using System.Text.RegularExpressions;
using System.Threading.Tasks;

namespace BS.Infrastructure.Identity.Security
{
    public class DataHelper : IDataHelper
    {
        private readonly IConfiguration _configuration;
        private readonly IWebHostEnvironment _webHostEnvironment;

        public DataHelper(IConfiguration configuration, IWebHostEnvironment webHostEnvironment)
        {
            _configuration = configuration;
            _webHostEnvironment = webHostEnvironment;
        }
        public async Task<string> SaveFile(IFormFile formFile)
        {
            var randomId = GenerateRandomCode(10);
            string folder = Path.Combine(_webHostEnvironment.WebRootPath, "Images");
            string pathString = Path.Combine(folder);
            if (!Directory.Exists(pathString))
            {
                Directory.CreateDirectory(pathString);
            }
            string fileName = randomId + Path.GetExtension(formFile.FileName);
            var filePath = Path.Combine(pathString, fileName);
            using (var stream = new FileStream(filePath, FileMode.Create))
            {
                await formFile.CopyToAsync(stream);
            }
            return fileName;
        }

        public bool isSQL_Injection(string input)
        {
            if (string.IsNullOrEmpty(input))
            { return false; }


            List<Regex> RegexList = new List<Regex>();

            RegexList.Add(new Regex(@"/(\%27)|(\')|(\-\-)|(\%23)|(#)/ix"));
            RegexList.Add(new Regex(@"/((\%3D)|(=))[^\n]*((\%27)|(\')|(\-\-)|(\%3B)|(;))/i"));
            RegexList.Add(new Regex(@"/\w*((\%27)|(\'))((\%6F)|o|(\%4F))((\%72)|r|(\%52))/ix"));
            RegexList.Add(new Regex(@"/exec(\s|\+)+(s|x)p\w+/ix"));
            RegexList.Add(new Regex(@"/((\%27)|(\'))union/ix"));
            RegexList.Add(new Regex(@"/((\%3C)|<)((\%2F)|\/)*[a-z0-9\%]+((\%3E)|>)/ix"));
            RegexList.Add(new Regex(@"/((\%3C)|<)((\%69)|i|(\%49))((\%6D)|m|(\%4D))((\%67)|g|(\%47))[^\n]+((\%3E)|>)/I"));
            RegexList.Add(new Regex(@"/((\% 3C) |<)[^\n] + ((\% 3E)|>)/ I"));


            foreach (var regex in RegexList)
            {
                if (regex.IsMatch(input))
                {
                    return true;
                }
            }

            return false;
        }

        public bool isValidFileType(IFormFile formFile)
        {
            List<string> allowableFileList = _configuration.GetSection("FileConfig:AllowedFileType").Get<List<string>>();
            bool res = true;
            if (formFile != null)
                if (!allowableFileList.Contains(formFile.ContentType))
                    res = false;
            return res;
        }

        public bool isValidFileSize(IFormFile formFile)
        {
            bool res = true;
            long size = long.Parse(_configuration.GetSection("FileConfig:AllowedFileSize").Get<string>());
            if (formFile.Length > size)
                res = false;
            return res;
        }

        private string GenerateRandomCode(int size)
        {
            Random random = new Random();
            const string chars = "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ1234567890";

            StringBuilder st = new StringBuilder();
            st.Append(DateTime.Now.Minute.ToString("D2"));
            for (int i = 0; i < size - 4; i++)
            {
                st.Append(chars[random.Next(chars.Length)]);
            };
            st.Append(DateTime.Now.Second.ToString("D2"));

            return st.ToString();

        }

        public bool isGuidNullOrEmpty(Guid? input)
        {
            var res = false;
            if (input == null || input == Guid.Empty)
                res = true;
            return res;

        }

        //public static void SaveJpeg(string path, Image img, int quality)
        //{
        //    if (quality < 0 || quality > 100)
        //        throw new ArgumentOutOfRangeException("quality must be between 0 and 100.");

        //    // Encoder parameter for image quality 
        //    EncoderParameter qualityParam = new EncoderParameter(System.Drawing.Imaging.Encoder.Quality, quality);
        //    // JPEG image codec 
        //    ImageCodecInfo jpegCodec = GetEncoderInfo("image/jpeg");
        //    EncoderParameters encoderParams = new EncoderParameters(1);
        //    encoderParams.Param[0] = qualityParam;
        //    img.Save(path, jpegCodec, encoderParams);
        //}
    }
}
