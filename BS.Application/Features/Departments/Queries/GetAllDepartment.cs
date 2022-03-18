using BPJ.LMSR.Application.Common;
using MediatR;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading;
using System.Threading.Tasks;

namespace BS.Application.Features.Departments.Queries
{
    public class GetAllDepartment
    {
        public class GetAllDepartmentQuery : IRequest<ResultDTO<string>>
        {

        }

        public class GetAllDepartmentHandLer : IRequestHandler<GetAllDepartmentQuery, ResultDTO<string>>
        {
            public GetAllDepartmentHandLer()
            {

            }
            public async Task<ResultDTO<string>> Handle(GetAllDepartmentQuery request, CancellationToken cancellationToken)
            {
                throw new NotImplementedException();
            }
        }
    }
}
