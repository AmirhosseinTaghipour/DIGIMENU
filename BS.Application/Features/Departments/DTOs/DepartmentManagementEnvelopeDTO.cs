using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace BS.Application.Features.Departments.DTOs
{
    public class DepartmentManagementEnvelopeDTO
    {
        public List<DepartmentManagementListItemDTO> DepartmentList { get; set; }
        public int DepartmentCount { get; set; }
    }
}
