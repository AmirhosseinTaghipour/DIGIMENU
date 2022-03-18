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
    public class SMSLog : BaseEntity
    {
        [MaxLength(11)]
        [Required]
        public string Mobile { get; set; }

        public Guid? UserId { get; set; }

        [MaxLength(500)]
        [Required]
        public string MessageBody { get; set; }

        [MaxLength(50)]
        [Required]
        public string Type { get; set; }

        [MaxLength(50)]
        [Required]
        public string KeyPrameter { get; set; }

        [Required]
        public DateTime InsertDate { get; set; }

        [Required]
        [StringLength(50)]
        public string InsertUser { get; set; }

        [Required]
        public int Response { get; set; }

        [ForeignKey("UserId")]
        public User Users { get; set; }
    }
}
