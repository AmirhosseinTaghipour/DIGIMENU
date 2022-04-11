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
    public class DepartmentUpdate
    {
        public class DepartmentUpdateCommand : DepartmentDTO, IRequest<ResultDTO<string>>
        {

        }

        public class DepartmentUpdateHandLer : IRequestHandler<DepartmentUpdateCommand, ResultDTO<string>>
        {
            private readonly IUserAccessor _userAccessor;
            private readonly IUnitOfWork _unitOfWork;
            private readonly IFileHelper _fileHelper;
            private readonly IMapper _mapper;
            public DepartmentUpdateHandLer(IUserAccessor userAccessor, IUnitOfWork unitOfWork, IMapper mapper, IFileHelper fileHelper)
            {
                _unitOfWork = unitOfWork;
                _userAccessor = userAccessor;
                _mapper = mapper;
                _fileHelper = fileHelper;
            }
            public async Task<ResultDTO<string>> Handle(DepartmentUpdateCommand request, CancellationToken cancellationToken)
            {
                if (request.IsUpdateMode == false)
                    throw new RestException(HttpStatusCode.BadRequest, "خطا، مود اینزرت...");

                var user = await _unitOfWork.userRepositoryAsync.GetByIdAsync(_userAccessor.GetCurrentUserId());
                if (user == null)
                    throw new RestException(HttpStatusCode.NotFound, "خطا، کاربری یافت نشد");

                if (user.DepartmentId == null)
                    throw new RestException(HttpStatusCode.BadRequest, "خطا، مود اینزرت...");

                var validImgType = _fileHelper.IsValidFile(request.Image.File);
                var validLogoType = _fileHelper.IsValidFile(request.Logo.File);
                var validImgSize = _fileHelper.IsValidSize(request.Image.File);
                var validLogoSize = _fileHelper.IsValidSize(request.Logo.File);

                if (!validImgType || !validLogoType || !validImgSize || !validLogoSize)
                    throw new RestException(HttpStatusCode.BadRequest, "خظا، فرمت یا سایز تصاویر صحیح نیست.");

                var department = await _unitOfWork.departmentRepositoryAsync.GetByIdAsync(user.DepartmentId.Value);
                if (department == null)
                    throw new RestException(HttpStatusCode.NotFound, "خطا، مجموعه کاربر یافت نشد");

                department.UpdateDate = DateTime.Now;
                department.UpdateUser = _userAccessor.GetCurrentUserName().ToLower();
                department.Phone = request.Phone;
                department.Title = request.Title;
                department.Description = request.Description;
                department.PostalCode = request.PostalCode;
                department.Address = request.Address;
                department.Xpos = request.Xpos;
                department.Ypos = request.Ypos;
                _unitOfWork.departmentRepositoryAsync.Update(department);


                var logoFileRes = true;
                var depImgRes = true;

                if (request.Image.IsChanged)
                {
                    var image = await _unitOfWork.fileRepositoryAsync.GetFirstAsync(n => n.DepartmentId == department.Id && n.EntityId == department.Id && n.EntityName == EntityName.Department.ToString() && n.IsDeleted == false);
                    if (image == null)
                    {
                        if (request.Image.File != null)
                        {
                            var depImgId = Guid.NewGuid();
                            var depImg = new File();
                            depImg.Id = depImgId;
                            depImg.FileName = request.Image.File.FileName;
                            depImg.InsertDate = DateTime.Now;
                            depImg.InsertUser = _userAccessor.GetCurrentUserName().ToLower();
                            depImg.DepartmentId = department.Id;
                            depImg.EntityId = department.Id;
                            depImg.EntityName = EntityName.Department.ToString();
                            depImg.IsDeleted = false;
                            await _unitOfWork.fileRepositoryAsync.AddAsync(depImg);
                            depImgRes = await _fileHelper.SaveFileAsync(request.Image.File, FileDirectorey.UnitImage, depImgId.ToString(), true);
                        }
                    }
                    else
                    {
                        depImgRes = _fileHelper.DeleteFile(image.Id.ToString(), System.IO.Path.GetExtension(image.FileName), FileDirectorey.UnitImage);

                        if (request.Image.File == null)
                        {
                            image.IsDeleted = true;
                            _unitOfWork.fileRepositoryAsync.Update(image);
                        }
                        else
                        {
                            depImgRes = await _fileHelper.SaveFileAsync(request.Image.File, FileDirectorey.UnitImage, image.Id.ToString(), true);
                        }
                    }

                }

                if (request.Logo.IsChanged)
                {
                    var logo = await _unitOfWork.fileRepositoryAsync.GetFirstAsync(n => n.DepartmentId == department.Id && n.EntityId == department.Id && n.EntityName == EntityName.DepartmentLogo.ToString() && n.IsDeleted == false);
                    if (logo == null)
                    {
                        if (request.Logo.File != null)
                        {
                            var logoId = Guid.NewGuid();
                            var logoImg = new File();
                            logoImg.Id = logoId;
                            logoImg.FileName = request.Logo.File.FileName;
                            logoImg.InsertDate = DateTime.Now;
                            logoImg.InsertUser = _userAccessor.GetCurrentUserName().ToLower();
                            logoImg.DepartmentId = department.Id;
                            logoImg.EntityId = department.Id;
                            logoImg.EntityName = EntityName.Department.ToString();
                            logoImg.IsDeleted = false;
                            await _unitOfWork.fileRepositoryAsync.AddAsync(logoImg);
                            depImgRes = await _fileHelper.SaveFileAsync(request.Image.File, FileDirectorey.UnitImage, logoId.ToString(), true);
                        }
                    }
                    else
                    {
                        logoFileRes = _fileHelper.DeleteFile(logo.Id.ToString(), System.IO.Path.GetExtension(logo.FileName), FileDirectorey.UnitLogo);

                        if (request.Image.File == null)
                        {
                            logo.IsDeleted = true;
                            _unitOfWork.fileRepositoryAsync.Update(logo);
                        }
                        else
                        {
                            logoFileRes = await _fileHelper.SaveFileAsync(request.Logo.File, FileDirectorey.UnitLogo, logo.Id.ToString(), true);
                        }
                    }

                }

                if (!depImgRes || !logoFileRes)
                    throw new RestException(HttpStatusCode.BadRequest, "خطا در ذخیره تصاویر");


                var success = await _unitOfWork.SaveAsync() > 0;
                if (success)
                    return new ResultDTO<string>(HttpStatusCode.OK, "اطلاعات مجموعه شما با موفقیت ثبت شد.");

                throw new RestException(HttpStatusCode.BadRequest, "خطا در عملیات ویرایش");

            }
        }
    }
}
