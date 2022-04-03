using BPJ.LMSR.Application.Common;
using BS.Application.Features.Departments.DTOs;
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
        public class DepartmentUpdateCommand : DepartmentDTO,IRequest<ResultDTO<string>>
        {
           
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
