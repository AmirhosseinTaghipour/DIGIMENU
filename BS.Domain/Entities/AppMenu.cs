using BS.Domain.Common;
using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace BS.Domain.Entities
{
    public class AppMenu : AuditableBaseEntity
    {
        [MaxLength(100)]
        public string MenuTitle { get; set; }
        [MaxLength(100)]
        public string MenuCode { get; set; }
        public int MenuOrder { get; set; }
        [Required]
        public bool IsActived { get; set; }
        public bool IsDeleted { get; set; }
        public ICollection<AppMenuRole> AppMenuRoles { get; set; }
    }
}
