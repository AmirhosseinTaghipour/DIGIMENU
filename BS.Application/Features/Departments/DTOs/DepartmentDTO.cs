using BS.Application.Common.DTOs;
using Microsoft.AspNetCore.Http;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace BS.Application.Features.Departments.DTOs
{
   public class DepartmentDTO
    {
        public string Id { get; set; }
        public string Title { get; set; }
        public string Description { get; set; }
        public string Address { get; set; }
        public string PostalCode { get; set; }
        public string Phone { get; set; }
        public decimal? Xpos { get; set; }
        public decimal? Ypos { get; set; }
        public IFormFile Image { get; set; }
        public string ImagName { get; set; }
        public string ImagUrl { get; set; }
        public IFormFile Logo { get; set; }
        public string LogoName { get; set; }
        public string LogoUrl { get; set; }
        public bool IsLogoChanged { get; set; } = false;
        public bool IsImageChanged { get; set; } = false;
        public bool IsUpdateMode { get; set; } = false;
    }
}
