using BS.Application.Common.DTOs;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace BS.Application.Features.CategoryIcons.DTOs
{
   public class CategoryIconFormDTO
    {
        public string Id { get; set; }
        public FileDTO Icon { get; set; }
        public string Title { get; set; }
        public bool IsUpdateMode { get; set; } = false;
    }
}
