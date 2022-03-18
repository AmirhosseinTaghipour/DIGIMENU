using BPJ.LMSR.Application.Common;
using MediatR;
using Microsoft.AspNetCore.Http;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading;
using System.Threading.Tasks;

namespace BS.Application.Features.Departments.Commands
{
    public class DepartmentUpdate
    {
        public class DepartmentUpdateCommand : IRequest<ResultDTO<string>>
        {
            public string Id { get; set; }
            public string Title { get; set; }
            public string Description { get; set; }
            public string Address { get; set; }
            public string PostalCode { get; set; }
            public string Phone { get; set; }
            public decimal? Xpos { get; set; }
            public decimal? Ypos { get; set; }
            public IFormFile Image { get; set; }
        }

        public class DepartmentUpdateHandLer : IRequestHandler<DepartmentUpdateCommand, ResultDTO<string>>
        {
            public DepartmentUpdateHandLer()
            {

            }
            public async Task<ResultDTO<string>> Handle(DepartmentUpdateCommand request, CancellationToken cancellationToken)
            {
                throw new NotImplementedException();
            }
        }
    }
}
