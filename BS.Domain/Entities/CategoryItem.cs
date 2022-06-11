using BS.Domain.Common;
using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace BS.Domain.Entities
{
    public class CategoryItem : AuditableBaseEntity
    {
        [Required]
        [MaxLength(100)]
        public string Title { get; set; }

        public int Order { get; set; }

        [MaxLength(800)]
        public string Description { get; set; }

        [Required]
        public int Price { get; set; }

        public int Discount { get; set; } 
        public int DiscountType { get; set; } 

        public int DiscountValue { get; set; }

        public int DiscountPercent { get; set; }

        public bool  IsExist { get; set; }
        public bool  UseDiscount { get; set; }
        public Guid? DepartmentId { get; set; }

        [Required]
        public Guid CategoryId { get; set; }

        public bool IsDeleted { get; set; }

        [ForeignKey("DepartmentId")]
        public Department Department { get; set; }

        [ForeignKey("CategoryId")]
        public Category Category { get; set; }
    }
}
