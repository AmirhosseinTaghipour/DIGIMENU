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
        public class DepartmentInsertCommand : IRequest<ResultDTO<string>>
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
            public IFormFile Logo { get; set; }
            public bool IsLogoChanged { get; set; } = false;
            public bool IsImageChanged { get; set; } = false;
            public bool IsUpdateMode { get; set; } = false;
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
                var validImgType = _fileHelper.IsValidFile(request.Image);
                var validLogoType = _fileHelper.IsValidFile(request.Logo);
                var validImgSize = _fileHelper.IsValidSize(request.Image);
                var validLogoSize = _fileHelper.IsValidSize(request.Logo);

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

                var user = await _unitOfWork.userRepositoryAsync.GetByIdAsync(_userAccessor.GetCurrentUserId());
                user.DepartmentId = departmentId;
                user.UpdateDate = DateTime.Now;
                user.UpdateUser = _userAccessor.GetCurrentUserName().ToLower();
                _unitOfWork.userRepositoryAsync.Update(user);




                var logoFileRes = true;
                var depImgRes = true;

                if (request.Logo != null)
                {
                    var logoId = Guid.NewGuid();
                    var logoFile = new File();
                    logoFile.Id = logoId;
                    logoFile.FileName = request.Logo.FileName;
                    logoFile.InsertDate = DateTime.Now;
                    logoFile.InsertUser = _userAccessor.GetCurrentUserName().ToLower();
                    logoFile.DepartmentId = departmentId;
                    logoFile.EntityId = departmentId;
                    logoFile.EntityName = EntityName.DepartmentLogo.ToString();
                    logoFile.IsDeleted = false;
                    await _unitOfWork.fileRepositoryAsync.AddAsync(logoFile);

                    logoFileRes = await _fileHelper.SaveFileAsync(request.Logo, FileDirectorey.UnitLogo, logoId.ToString());
                }

                if (request.Image != null)
                {
                    var depImgId = Guid.NewGuid();
                    var depImg = new File();
                    depImg.Id = depImgId;
                    depImg.FileName = request.Image.FileName;
                    depImg.InsertDate = DateTime.Now;
                    depImg.InsertUser = _userAccessor.GetCurrentUserName().ToLower();
                    depImg.DepartmentId = departmentId;
                    depImg.EntityId = departmentId;
                    depImg.EntityName = EntityName.Department.ToString();
                    depImg.IsDeleted = false;
                    await _unitOfWork.fileRepositoryAsync.AddAsync(depImg);

                    depImgRes = await _fileHelper.SaveFileAsync(request.Image, FileDirectorey.UnitImage, depImgId.ToString());
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
