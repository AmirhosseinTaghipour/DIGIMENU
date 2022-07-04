using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace BS.Application.Common.DTOs
{
   public class ListSearchParamDTO
    {
        public string SortColumn { get; set; }
        public string SortDirection { get; set; }
        public int? Limit { get; set; }   // تعداد در هر صفحه
        public int? Page { get; set; }    // کدام صفحه
    }
}
