using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace BS.Application.Features.Categories.DTOs
{
   public class CategoryListItemDTO
    {
        public string Key { get; set; }
        public int Order { get; set; }
        public string Id { get; set; }
        public string Title { get; set; }
        public string Url { get; set; }
    }
}