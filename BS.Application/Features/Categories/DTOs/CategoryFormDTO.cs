using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace BS.Application.Features.Categories.DTOs
{
   public class CategoryFormDTO
    {
        public string Id { get; set; }
        public string Title { get; set; }
        public string IconId { get; set; }
        public bool IsUpdateMode { get; set; } = false;
    }
}