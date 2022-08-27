using AutoMapper;
using BS.Application.Common;
using BS.Application.Common.DTOs;
using BS.Application.Common.Enums;
using BS.Application.Common.Models;
using BS.Application.Features.Departments.DTOs;
using BS.Application.Interfaces;
using BS.Application.Interfaces.Repositories;
using BS.Domain.Entities;
using MediatR;
using Microsoft.AspNetCore.Http;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Net;
using System.Text;
using System.Threading;
using System.Threading.Tasks;

namespace BS.Application.Features.Departments.Commands
{
    public class DepartmentManagementUpdate
    {
        public class DepartmentManagementUpdateCommand : DepartmentDTO, IRequest<ResultDTO<string>>
        {

        }

        public class DepartmentManagementUpdateHandLer : IRequestHandler<DepartmentManagementUpdateCommand, ResultDTO<string>>
        {
            private readonly IUserAccessor _userAccessor;
            private readonly IUnitOfWork _unitOfWork;
            private readonly IMapper _mapper;
            public DepartmentManagementUpdateHandLer(IUserAccessor userAccessor, IUnitOfWork unitOfWork, IMapper mapper)
            {
                _unitOfWork = unitOfWork;
                _userAccessor = userAccessor;
                _mapper = mapper;
            }
            public async Task<ResultDTO<string>> Handle(DepartmentManagementUpdateCommand request, CancellationToken cancellationToken)
            {
                if (request.IsUpdateMode == false)
                    throw new RestException(HttpStatusCode.BadRequest, "خطا، مود اینزرت...");

                if (string.IsNullOrEmpty(request.Id))
                    throw new RestException(HttpStatusCode.BadRequest, "خطا، فیلد آیدی نمیتواند خالی باشد...");

                if (!Guid.TryParse(request.Id, out var requestId))
                    throw new RestException(HttpStatusCode.BadRequest, "خطا، مقدار پارامتر ورودی صحیح نیست...");


                var department = await _unitOfWork.departmentRepositoryAsync.GetByIdAsync(requestId);
                if (department == null)
                    throw new RestException(HttpStatusCode.NotFound, "خطا، مجموعه کاربر یافت نشد");

                department.UpdateDate = DateTime.Now;
                department.UpdateUser = _userAccessor.GetCurrentUserName().ToLower();
                department.Phone = request.Phone;
                department.Title = request.Title;
                department.Description = request.Description;
                department.PostalCode = request.PostalCode;
                department.Address = request.Address;
                _unitOfWork.departmentRepositoryAsync.Update(department);


                var success = await _unitOfWork.SaveAsync() > 0;
                if (success)
                    return new ResultDTO<string>(HttpStatusCode.OK, "اطلاعات مجموعه شما با موفقیت ثبت شد.");

                throw new RestException(HttpStatusCode.BadRequest, "خطا در عملیات ویرایش");

            }
        }
    }
}
