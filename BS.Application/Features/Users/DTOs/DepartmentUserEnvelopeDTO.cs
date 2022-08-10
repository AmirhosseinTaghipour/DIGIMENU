using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace BS.Application.Features.Users.DTOs
{
    public class DepartmentUserEnvelopeDTO
    {
        public List<DepartmentUserListItemDTO> DepartmentUserList { get; set; }
        public int DepartmentUserCount { get; set; }
    }
}
