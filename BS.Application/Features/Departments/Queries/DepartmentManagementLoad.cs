using AutoMapper;
using BS.Application.Common.Models;
using BS.Application.Features.Departments.DTOs;
using BS.Application.Interfaces;
using BS.Application.Interfaces.Repositories;
using BS.Domain.Entities;
using MediatR;
using Microsoft.EntityFrameworkCore;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Net;
using System.Text;
using System.Threading;
using System.Threading.Tasks;

namespace BS.Application.Features.Departments.Queries
{
    public class DepartmentManagementLoad
    {
        public class DepartmetLoadQuery : IRequest<DepartmentManagementFormDTO>
        {
            public string Id { get; set; }
        }

        public class DepartmetLoadHandLer : IRequestHandler<DepartmetLoadQuery, DepartmentManagementFormDTO>
        {
            private readonly IUnitOfWork _unitOfWork;
            private readonly IUserAccessor _userAccessor;
            private readonly IMapper _mapper;
            private readonly IFileHelper _fileHelper;

            public DepartmetLoadHandLer(IUnitOfWork unitOfWork, IUserAccessor userAccessor, IMapper mapper, IFileHelper fileHelper)
            {
                _unitOfWork = unitOfWork;
                _userAccessor = userAccessor;
                _fileHelper = fileHelper;
                _mapper = mapper;
            }
            public async Task<DepartmentManagementFormDTO> Handle(DepartmetLoadQuery request, CancellationToken cancellationToken)
            {
                if (request.Id == null)
                    throw new RestException(HttpStatusCode.BadRequest, "خطا، رکوردی انتخاب نشده است...");


                var department = await (from depTeble in _unitOfWork.departmentRepositoryAsync.Query()
                                where depTeble.Id == new Guid(request.Id)
                                select new DepartmentManagementFormDTO
                                {
                                    Id = depTeble.Id.ToString().ToLower(),
                                    Title = depTeble.Title,
                                    Phone = depTeble.Phone,
                                    PostalCode = depTeble.PostalCode,
                                    IsActivated = depTeble.IsActived,
                                    Description=depTeble.Description,
                                    Address=depTeble.Address,
                                }).FirstOrDefaultAsync();
                if (department == null)
                    throw new RestException(HttpStatusCode.BadRequest, "خطا، رکوردی یافت نشد...");
                
                department.IsUpdateMode = true;
                return department;

            }
        }
    }
}
