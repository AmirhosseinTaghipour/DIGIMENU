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
    public class Payment : AuditableBaseEntity
    {
        [Required]
        [MaxLength(50)]
        public string EntityName { get; set; }
        [Required]
        public Guid EntityId { get; set; }
        [Required]
        public int PID { get; set; }
        [Required]
        [MaxLength(12)]
        public string Amount { get; set; }
        [MaxLength(10)]
        public string PDate { get; set; }
        [MaxLength(8)]
        public string PTime { get; set; }
        public int RefId { get; set; }
        public int RefNo { get; set; }
        [Required]
        public int PaymentStatus { get; set; }

        public bool IsDeleted { get; set; }

    }
}
