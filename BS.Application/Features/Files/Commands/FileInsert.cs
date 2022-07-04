using System;
using System.Collections.Generic;
using AutoMapper;
using BS.Application.Common;
using BS.Application.Common.DTOs;
using BS.Application.Common.Enums;
using BS.Application.Common.Models;
using BS.Application.Interfaces;
using BS.Application.Interfaces.Repositories;
using BS.Domain.Entities;
using MediatR;
using Microsoft.AspNetCore.Http;
using System.Linq;
using System.Net;
using System.Text;
using System.Threading;
using System.Threading.Tasks;
using BS.Application.Features.Files.DTOs;

namespace BS.Application.Features.Files.Commands
{
    public class FileInsert
    {
        public class FileInsertCommand : FileFormDTO, IRequest<ResultDTO<string>>
        {

        }

        public class FileInsertHandler : IRequestHandler<FileInsertCommand, ResultDTO<string>>
        {
            private readonly IUserAccessor _userAccessor;
            private readonly IUnitOfWork _unitOfWork;
            private readonly IFileHelper _fileHelper;
            private readonly IMapper _mapper;
            private string entityName;

            public FileInsertHandler(IUserAccessor userAccessor, IUnitOfWork unitOfWork, IMapper mapper, IFileHelper fileHelper)
            {
                _unitOfWork = unitOfWork;
                _userAccessor = userAccessor;
                _mapper = mapper;
                _fileHelper = fileHelper;
            }
            public async Task<ResultDTO<string>> Handle(FileInsertCommand request, CancellationToken cancellationToken)
            {
                if (request.IsUpdateMode == true)
                    throw new RestException(HttpStatusCode.BadRequest, "خطا، مود آپدیت...");

                if (!string.IsNullOrEmpty(request.Id))
                    throw new RestException(HttpStatusCode.BadRequest, "خطا، مود آپدیت...");

                if (string.IsNullOrEmpty(request.EntityId) || string.IsNullOrEmpty(request.EntityName) || request.File.File == null)
                    throw new RestException(HttpStatusCode.BadRequest, "خطا، فیلد های ضروری نمیتواند خالی باشد.");

                var user = await _unitOfWork.userRepositoryAsync.GetByIdAsync(_userAccessor.GetCurrentUserId());
                if (user == null)
                    throw new RestException(HttpStatusCode.NotFound, "خطا، کاربری یافت نشد");

                var validFileType = _fileHelper.IsValidFile(request.File.File);
                var validFileSize = _fileHelper.IsValidSize(request.File.File);

                if (!validFileType || !validFileSize)
                    throw new RestException(HttpStatusCode.BadRequest, "خظا، فرمت یا سایز تصویر صحیح نیست.");

                var isFirstRecord = !_unitOfWork.fileRepositoryAsync.Any(n => n.EntityId == new Guid(request.EntityId) && n.EntityName == request.EntityName);

                if (request.IsDefault && !isFirstRecord)
                {
                    var fileList = await _unitOfWork.fileRepositoryAsync.GetAsync(n => n.EntityName == request.EntityName && n.EntityId == new Guid(request.EntityId.ToUpper()) && n.IsDefault == true);
                    if (fileList != null)
                        foreach (var item in fileList)
                        {
                            item.IsDefault = false;
                            _unitOfWork.fileRepositoryAsync.Update(item);
                        }
                }


                var fileRes = true;
                var fileId = Guid.NewGuid();
                var file = new File();
                file.Id = fileId;
                file.FileName = request.File.File.FileName;
                file.Title = request.Title;
                file.InsertDate = DateTime.Now;
                file.InsertUser = user.Username.ToLower();
                file.DepartmentId = user.DepartmentId;
                file.EntityId = new Guid(request.EntityId);
                file.IsDefault = isFirstRecord ? true : request.IsDefault;
                file.EntityName = EntityName.CategoryItem.ToString();
                file.IsDeleted = false;

                await _unitOfWork.fileRepositoryAsync.AddAsync(file);

                fileRes = await _fileHelper.SaveFileAsync(request.File.File, FileDirectorey.ItemImage, fileId.ToString(), true);
                fileRes = await _fileHelper.SaveFileAsync(request.File.File, FileDirectorey.ItemImageThumbnail, fileId.ToString(), true);

                if (!fileRes)
                    throw new RestException(HttpStatusCode.BadRequest, "خطا در ذخیره تصویر");

                var success = await _unitOfWork.SaveAsync() > 0;
                if (success)
                    return new ResultDTO<string>(HttpStatusCode.OK, "ذخیره تصویر با موفقیت انجام شد.");

                throw new RestException(HttpStatusCode.BadRequest, "خطا در عملیات ثبت");
            }
        }
    }
}
