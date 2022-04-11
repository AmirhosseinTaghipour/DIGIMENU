using BS.Application.Common.DTOs;
using MediatR;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading;
using System.Threading.Tasks;

namespace BS.Application.Features.Departments.Queries
{
    public class GetDepartmentById
    {
        public class GetDepartmentByIdQuery : IRequest<ResultDTO<string>>
        {
            public string Id { get; set; }
            public GetDepartmentByIdQuery(string id)
            {
                Id = id;
            }
        }

        public class GetDepartmentByIdHandLer : IRequestHandler<GetDepartmentByIdQuery, ResultDTO<string>>
        {
            public GetDepartmentByIdHandLer()
            {

            }
            public async Task<ResultDTO<string>> Handle(GetDepartmentByIdQuery request, CancellationToken cancellationToken)
            {
                throw new NotImplementedException();
            }
        }
    }
}
