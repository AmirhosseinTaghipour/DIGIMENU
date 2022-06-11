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
    public class File : AuditableBaseEntity
    {
        [Required]
        [MaxLength(100)]
        public string FileName { get; set; }

        [Required]
        public Guid EntityId { get; set; }

        [MaxLength(100)]
        public string Title { get; set; }

        [Required]
        [MaxLength(50)]
        public string EntityName { get; set; }

        public Guid? DepartmentId { get; set; }

        [ForeignKey("DepartmentId")]
        public Department Department { get; set; }
        public bool IsDefault { get; set; }

        public bool IsDeleted { get; set; }
    }
}
