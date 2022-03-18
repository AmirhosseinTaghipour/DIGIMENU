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
    public class UserLog : BaseEntity
    {
        [Required]
        public Guid UserId { get; set; }
        [Required]
        public string LogDate { get; set; }
        [Required]
        public int StatusCode { get; set; }
        [Required]
        public string UserIp { get; set; }
        [Required]
        public DateTime InsertDate { get; set; }

        [ForeignKey("UserId")]
        public User user { get; set; }
    }
}
