using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace BS.Application.Features.CategoryItems.DTOs
{
    public class CategoryItemListItemDTO
    {
        public string Key { get; set; }
        public int Order { get; set; }
        public int CategoryOrder { get; set; }
        public string Id { get; set; }
        public string Title { get; set; }
        public string CategoryTitle { get; set; }
        public string CategoryId { get; set; }
        public int Price { get; set; }
        public int discountPercent { get; set; }
        public int discountValue { get; set; }
        public bool IsExist { get; set; }
        public string Url { get; set; }
    }
}
