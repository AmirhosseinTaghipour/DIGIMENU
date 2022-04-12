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
    public class Category : AuditableBaseEntity
    {
        [Required]
        [MaxLength(100)]
        public string Title { get; set; }
        public int Order { get; set; }
        public Guid? DepartmentId { get; set; }
        public Guid MenuId { get; set; }

        public bool IsDeleted { get; set; }

        [ForeignKey("DepartmentId")]
        public Department Department { get; set; }

        [ForeignKey("MenuId")]
        public Menu Menu { get; set; }

        public ICollection<CategoryItem>  CategoryItems { get; set; }
    }
}
