using AutoMapper;
using BPJ.LMSR.Application.Common;
using BS.Application.Common;
using BS.Application.Common.DTOs;
using BS.Application.Common.Enums;
using BS.Application.Features.Departments.DTOs;
using BS.Application.Interfaces;
using BS.Application.Interfaces.Repositories;
using MediatR;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Net;
using System.Text;
using System.Threading;
using System.Threading.Tasks;

namespace BS.Application.Features.Departments.Queries
{
    public class DepartmentLoad
    {
        public class DepartmentLoadQuery : IRequest<DepartmentDTO>
        {

        }

        public class DepartmentLoadHandLer : IRequestHandler<DepartmentLoadQuery, DepartmentDTO>
        {
            private readonly IUnitOfWork _unitOfWork;
            private readonly IUserAccessor _userAccessor;
            private readonly IMapper _mapper;
            private readonly IFileHelper _fileHelper;

            public DepartmentLoadHandLer(IUnitOfWork unitOfWork, IUserAccessor userAccessor, IMapper mapper, IFileHelper fileHelper)
            {
                _unitOfWork = unitOfWork;
                _userAccessor = userAccessor;
                _fileHelper = fileHelper;
                _mapper = mapper;
            }
            public async Task<DepartmentDTO> Handle(DepartmentLoadQuery request, CancellationToken cancellationToken)
            {
                var user = await _unitOfWork.userRepositoryAsync.GetByIdAsync(_userAccessor.GetCurrentUserId());
                if (user == null)
                    throw new RestException(HttpStatusCode.NotFound, "خطا، کاربری یافت نشد");

                if (user.DepartmentId == null || user.DepartmentId == Guid.Empty)
                    return new DepartmentDTO();

                var department = _mapper.Map<DepartmentDTO>(await _unitOfWork.departmentRepositoryAsync.GetByIdAsync(user.DepartmentId.Value));
                if (department == null)
                    throw new RestException(HttpStatusCode.NotFound, "خطا، رکوردی یافت نشد");

                department.IsUpdateMode = true;

                var logo = await _unitOfWork.fileRepositoryAsync.GetFirstAsync(
                    whereCondition: n => n.EntityName == EntityName.DepartmentLogo.ToString() && n.EntityId == new Guid(department.Id) && n.DepartmentId == new Guid(department.Id),
                    orderBy: n => n.OrderByDescending(x => x.UpdateDate ?? x.InsertDate),
                    selectField: n => new { n.Id, n.FileName });

                var image = await _unitOfWork.fileRepositoryAsync.GetFirstAsync(
                    whereCondition: n => n.EntityName == EntityName.Department.ToString() && n.EntityId == new Guid(department.Id) && n.DepartmentId == new Guid(department.Id),
                    orderBy: n => n.OrderByDescending(x => x.UpdateDate ?? x.InsertDate),
                    selectField: n => new { n.Id, n.FileName });


                department.Logo = new FileDTO()
                {
                    Url = _fileHelper.GetFilePath(logo.Id.ToString(), logo.FileName, FileDirectorey.UnitLogo),
                    Name = logo.FileName
                };

                department.Image = new FileDTO()
                {
                    Url = _fileHelper.GetFilePath(image.Id.ToString(), image.FileName, FileDirectorey.UnitImage),
                    Name = image.FileName
                };

                return department;

            }
        }
    }
}
