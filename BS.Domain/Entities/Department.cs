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
    public class Department : AuditableBaseEntity
    {
        [MaxLength(200)]
        [Required]
        public string Title { get; set; }

        [MaxLength(800)]
        [Required]
        public string Description { get; set; }

        [MaxLength(500)]
        [Required]
        public string Address { get; set; }

        [MaxLength(10)]
        [Required]
        public string PostalCode { get; set; }

        [MaxLength(12)]
        public string Phone { get; set; }

        [Column(TypeName = "decimal(15,10)")]
        public decimal? Xpos { get; set; }

        [Column(TypeName = "decimal(15,10)")]
        public decimal? Ypos { get; set; }

        [Required]
        public bool IsActived { get; set; }

        public bool IsDeleted { get; set; }
        public ICollection<User> Users { get; set; }
        public ICollection<Menu> Menus { get; set; }
        public ICollection<Category> Categories { get; set; }
        public ICollection<CategoryItem> CategoryItems { get; set; }
    }
}
