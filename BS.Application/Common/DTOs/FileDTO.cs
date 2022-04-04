using Microsoft.AspNetCore.Http;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace BS.Application.Common.DTOs
{
    public class FileDTO
    {
        public string Name { get; set; }
        public string Url { get; set; }
        public IFormFile File { get; set; } = null;
        public bool IsChanged { get; set; } = false;
    }
}
