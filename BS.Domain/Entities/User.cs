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
    public class User : AuditableBaseEntity
    {
        [MaxLength(100)]
        [Required]
        public string Name { get; set; }

        [MaxLength(11)]
        [Required]
        public string Mobile { get; set; }
        public bool IsMobileConfirmed { get; set; }

        [MaxLength(50)]
        [Required]
        public string Username { get; set; }

        [MaxLength(100)]
        [Required]
        public string Password { get; set; }

        [MaxLength(128)]
        [Required]
        public string PasswordSalt { get; set; }
        public bool IsActived { get; set; }
        public bool IsDeleted { get; set; }

        [MaxLength(128)]
        public string ActivationCode { get; set; }
        public DateTime CodeExpiredTime { get; set; }

        [Required]
        public Guid RoleId { get; set; }

        [ForeignKey("RoleId")]
        public Role Role { get; set; }

        public Guid? DepartmentId { get; set; }

        [ForeignKey("DepartmentId")]
        public Department Department { get; set; }

        public ICollection<UserLog> UserLogs { get; set; }
        public ICollection<SMSLog> SMSLogs { get; set; }
    }
}
