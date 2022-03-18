using AutoMapper;
using BPJ.LMSR.Application.Common;
using BS.Application.Interfaces;
using BS.Application.Interfaces.Repositories;
using BS.Domain.Entities;
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
    public class DepartmentInsert
    {
        public class DepartmentInsertCommand : IRequest<ResultDTO<string>>
        {
            public string Title { get; set; }
            public string Description { get; set; }
            public string Address { get; set; }
            public string PostalCode { get; set; }
            public string Phone { get; set; }
            public decimal? Xpos { get; set; }
            public decimal? Ypos { get; set; }
            public IFormFile Image { get; set; }
        }

        public class DepartmentInsertHandler : IRequestHandler<DepartmentInsertCommand, ResultDTO<string>>
        {
            private readonly IUserAccessor _userAccessor;
            private readonly IUnitOfWork _unitOfWork;
            private readonly IMapper _mapper;

            public DepartmentInsertHandler(IUserAccessor userAccessor, IUnitOfWork unitOfWork, IMapper mapper)
            {
                _unitOfWork = unitOfWork;
                _userAccessor = userAccessor;
                _mapper = mapper;
            }
            public async Task<ResultDTO<string>> Handle(DepartmentInsertCommand request, CancellationToken cancellationToken)
            {
                //var department = _mapper.Map<Department>(request);
                //department.Id = Guid.NewGuid();
                //department.InsertUser = _userAccessor.GetCurrentUserName();
                //department.InsertDate = DateTime.Now;
                //department.IsDeleted = false;
                //department.IsActived = true;
                //department.
                throw new NotImplementedException();
            }
        }
    }
}
