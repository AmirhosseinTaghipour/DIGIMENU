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
    [Keyless]
    [Index(nameof(Domain), nameof(Code), Name = "Ref_Code_UNQ", IsUnique = true)]
    public class RefCode
    {
        [Required]
        [Column("Domain")]
        public string Domain { get; set; }
        [Required]
        [Column("Code")]
        public int Code { get; set; }
        [Required]
        public string Title { get; set; }
    }
}
