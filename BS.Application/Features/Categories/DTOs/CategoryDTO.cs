using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace BS.Application.Features.Categories.DTOs
{
    public class CategoryDTO
    {
        public string Id { get; set; }
        public string Title { get; set; }
        public int Order { get; set; }
        public bool IsUpdateMode { get; set; } = false;
    }
}
