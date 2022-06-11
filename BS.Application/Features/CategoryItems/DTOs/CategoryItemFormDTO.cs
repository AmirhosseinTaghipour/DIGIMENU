using BS.Application.Common.DTOs;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace BS.Application.Features.CategoryItems.DTOs
{
    public class CategoryItemFormDTO
    {
        public string Id { get; set; }
        public string Title { get; set; }
        public string Description { get; set; }
        public string CategoryId { get; set; }
        public int? Price { get; set; } = 0;
        public int? Discount { get; set; } = 0;
        public int? DiscountType { get; set; } = 0; //0 is price and 1 is percent
        public bool IsExist { get; set; } = true;
        public bool UseDiscount { get; set; } = false;
        public bool IsUpdateMode { get; set; } = false;
    }
}
