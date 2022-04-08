using AutoMapper;
using BPJ.LMSR.Application.Common;
using BS.Application.Common;
using BS.Application.Common.Enums;
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
    public class DepartmentInsert
    {
        public class DepartmentInsertCommand : DepartmentDTO, IRequest<ResultDTO<string>>
        {

        }

        public class DepartmentInsertHandler : IRequestHandler<DepartmentInsertCommand, ResultDTO<string>>
        {
            private readonly IUserAccessor _userAccessor;
            private readonly IUnitOfWork _unitOfWork;
            private readonly IFileHelper _fileHelper;
            private readonly IMapper _mapper;

            public DepartmentInsertHandler(IUserAccessor userAccessor, IUnitOfWork unitOfWork, IMapper mapper, IFileHelper fileHelper)
            {
                _unitOfWork = unitOfWork;
                _userAccessor = userAccessor;
                _mapper = mapper;
                _fileHelper = fileHelper;
            }
            public async Task<ResultDTO<string>> Handle(DepartmentInsertCommand request, CancellationToken cancellationToken)
            {
                if (request.IsUpdateMode == true)
                    throw new RestException(HttpStatusCode.BadRequest, "خطا، مود آپدیت...");

                var user = await _unitOfWork.userRepositoryAsync.GetByIdAsync(_userAccessor.GetCurrentUserId());
                if (user == null)
                    throw new RestException(HttpStatusCode.NotFound, "خطا، کاربری یافت نشد");

                if (user.DepartmentId != null)
                    throw new RestException(HttpStatusCode.BadRequest, "خطا، مود آپدیت...");




                var validImgType = _fileHelper.IsValidFile(request.Image.File);
                var validLogoType = _fileHelper.IsValidFile(request.Logo.File);
                var validImgSize = _fileHelper.IsValidSize(request.Image.File);
                var validLogoSize = _fileHelper.IsValidSize(request.Logo.File);

                if (!validImgType || !validLogoType || !validImgSize || !validLogoSize)
                    throw new RestException(HttpStatusCode.BadRequest, "خظا، فرمت یا سایز تصاویر صحیح نیست.");



                var department = _mapper.Map<Department>(request);
                var departmentId = Guid.NewGuid();
                department.Id = departmentId;
                department.InsertDate = DateTime.Now;
                department.InsertUser = _userAccessor.GetCurrentUserName().ToLower();
                department.IsActived = true;
                department.IsDeleted = false;
                await _unitOfWork.departmentRepositoryAsync.AddAsync(department);

                user.DepartmentId = departmentId;
                user.UpdateDate = DateTime.Now;
                user.UpdateUser = _userAccessor.GetCurrentUserName().ToLower();
                _unitOfWork.userRepositoryAsync.Update(user);




                var logoFileRes = true;
                var depImgRes = true;

                if (request.Logo.File != null)
                {
                    var logoId = Guid.NewGuid();
                    var logoFile = new File();
                    logoFile.Id = logoId;
                    logoFile.FileName = request.Logo.File.FileName;
                    logoFile.InsertDate = DateTime.Now;
                    logoFile.InsertUser = _userAccessor.GetCurrentUserName().ToLower();
                    logoFile.DepartmentId = departmentId;
                    logoFile.EntityId = departmentId;
                    logoFile.EntityName = EntityName.DepartmentLogo.ToString();
                    logoFile.IsDeleted = false;
                    await _unitOfWork.fileRepositoryAsync.AddAsync(logoFile);

                    logoFileRes = await _fileHelper.SaveFileAsync(request.Logo.File, FileDirectorey.UnitLogo, logoId.ToString(), true);
                }

                if (request.Image.File != null)
                {
                    var depImgId = Guid.NewGuid();
                    var depImg = new File();
                    depImg.Id = depImgId;
                    depImg.FileName = request.Image.File.FileName;
                    depImg.InsertDate = DateTime.Now;
                    depImg.InsertUser = _userAccessor.GetCurrentUserName().ToLower();
                    depImg.DepartmentId = departmentId;
                    depImg.EntityId = departmentId;
                    depImg.EntityName = EntityName.Department.ToString();
                    depImg.IsDeleted = false;
                    await _unitOfWork.fileRepositoryAsync.AddAsync(depImg);

                    depImgRes = await _fileHelper.SaveFileAsync(request.Image.File, FileDirectorey.UnitImage, depImgId.ToString(), true);
                }

                if (!depImgRes || !logoFileRes)
                    throw new RestException(HttpStatusCode.BadRequest, "خطا در ذخیره تصاویر");


                var success = await _unitOfWork.SaveAsync() > 0;
                if (success)
                    return new ResultDTO<string>(HttpStatusCode.OK, "اطلاعات مجموعه شما با موفقیت ثیت شد.");

                throw new RestException(HttpStatusCode.BadRequest, "خطا در عملیات ثبت");

            }
        }
    }
}
