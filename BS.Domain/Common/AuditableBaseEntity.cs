using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Text;

namespace BS.Domain.Common
{
    public abstract class AuditableBaseEntity
    {
        [Key]
        public virtual Guid Id { get; set; }
        [Required]
        [StringLength(50)]
        public string InsertUser { get; set; }
        public DateTime InsertDate { get; set; }
        [StringLength(50)]
        public string UpdateUser { get; set; }
        public DateTime? UpdateDate { get; set; }
    }
}
