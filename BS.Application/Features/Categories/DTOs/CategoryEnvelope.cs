using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace BS.Application.Features.Categories.DTOs
{
    public class CategoryEnvelope
    {
        public List<CategoryListItemDTO> CategoryList { get; set; }
        public int CategoryCount { get; set; }
    }
}
