using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace BS.Application.Features.CategoryItems.DTOs
{
    public class CategoryItemEnvelope
    {
        public List<CategoryItemListItemDTO> CategoryItemList { get; set; }
        public int CategoryItemCount { get; set; }
    }
}
