using BS.Domain.Common;
using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace BS.Domain.Entities
{
    public class Role : AuditableBaseEntity
    {

        [MaxLength(100)]
        [Required]
        public string Title { get; set; }

        [MaxLength(100)]
        [Required]
        public string Code { get; set; }

        [Required]
        public bool IsActived { get; set; }
        public bool IsDeleted { get; set; }
        public ICollection<User> Users { get; set; }
        public ICollection<AppMenu> AppMenus { get; set; }
    }
}
