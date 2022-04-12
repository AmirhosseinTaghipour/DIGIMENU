using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace BS.Application.Features.Categories.DTOs
{
    public class CategoryEnvelopeDTO
    {
        public List<CategoryDTO> CategoriesList { get; set; }
        public int CategoriesCount { get; set; }
    }
}
