using BS.Domain.Common;
using Microsoft.EntityFrameworkCore;
using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace BS.Domain.Entities
{

    public class AppMenuRole: BaseEntity
    {
        [Required]
        public  Guid AppMenusId { get; set; }
        [ForeignKey("AppMenusId")]
        public AppMenu AppMenu { get; set; }

        [Required]
        public  Guid RolesId { get; set; }
        [ForeignKey("RolesId")]
        public Role Role { get; set; }
    }
}
