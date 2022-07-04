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
    public class FileUpdate
    {
        public class FileUpdateCommand : FileFormDTO, IRequest<ResultDTO<string>>
        {

        }

        public class FileUpdateHandler : IRequestHandler<FileUpdateCommand, ResultDTO<string>>
        {
            private readonly IUserAccessor _userAccessor;
            private readonly IUnitOfWork _unitOfWork;
            private readonly IFileHelper _fileHelper;
            private readonly IMapper _mapper;
            private string entityName;

            public FileUpdateHandler(IUserAccessor userAccessor, IUnitOfWork unitOfWork, IMapper mapper, IFileHelper fileHelper)
            {
                _unitOfWork = unitOfWork;
                _userAccessor = userAccessor;
                _mapper = mapper;
                _fileHelper = fileHelper;
            }
            public async Task<ResultDTO<string>> Handle(FileUpdateCommand request, CancellationToken cancellationToken)
            {
                if (request.IsUpdateMode == false)
                    throw new RestException(HttpStatusCode.BadRequest, "خطا، مود اینزرت...");

                if (string.IsNullOrEmpty(request.Id))
                    throw new RestException(HttpStatusCode.BadRequest, "خطا، مود اینزرت...");

                if (string.IsNullOrEmpty(request.EntityId) || string.IsNullOrEmpty(request.EntityName) || (request.File.IsChanged && request.File.File == null))
                    throw new RestException(HttpStatusCode.BadRequest, "خطا، فیلد های ضروری نمیتواند خالی باشد.");

                var user = await _unitOfWork.userRepositoryAsync.GetByIdAsync(_userAccessor.GetCurrentUserId());
                if (user == null)
                    throw new RestException(HttpStatusCode.NotFound, "خطا، کاربری یافت نشد");

                var validFileType = _fileHelper.IsValidFile(request.File.File);
                var validFileSize = _fileHelper.IsValidSize(request.File.File);

                if (!validFileType || !validFileSize)
                    throw new RestException(HttpStatusCode.BadRequest, "خظا، فرمت یا سایز تصویر صحیح نیست.");

                var file = await _unitOfWork.fileRepositoryAsync.GetByIdAsync(new Guid(request.Id));
                if (file == null)
                    throw new RestException(HttpStatusCode.NotFound, "خطا، رکوردی یافت نشد");

                var isFirstRecord = !_unitOfWork.fileRepositoryAsync.Any(n => n.Id != file.Id && n.EntityId == new Guid(request.EntityId) && n.EntityName == request.EntityName);


                if (request.IsDefault && !isFirstRecord)
                {
                    var fileList = await _unitOfWork.fileRepositoryAsync.GetAsync(n => n.Id != file.Id && n.EntityName == request.EntityName && n.EntityId == new Guid(request.EntityId.ToUpper()) && n.IsDefault == true);
                    if (fileList != null)
                        foreach (var item in fileList)
                        {
                            item.IsDefault = false;
                            _unitOfWork.fileRepositoryAsync.Update(item);
                        }
                }

                var fileRes = true;

                file.Title = request.Title;
                file.IsDefault = isFirstRecord ? true : request.IsDefault;
                file.UpdateDate = DateTime.Now;
                file.UpdateUser = user.Username.ToLower();

                if (request.File.IsChanged)
                {
                    fileRes = _fileHelper.DeleteFile(file.Id.ToString().ToLower(), System.IO.Path.GetExtension(file.FileName), FileDirectorey.ItemImage);
                    fileRes = _fileHelper.DeleteFile(file.Id.ToString().ToLower(), System.IO.Path.GetExtension(file.FileName), FileDirectorey.ItemImageThumbnail);

                    if (request.File.File != null)
                    {
                        file.FileName = request.File.File.FileName;
                        fileRes = await _fileHelper.SaveFileAsync(request.File.File, FileDirectorey.ItemImage, file.Id.ToString(), true);
                        fileRes = await _fileHelper.SaveFileAsync(request.File.File, FileDirectorey.ItemImageThumbnail, file.Id.ToString(), true);
                    }
                    else
                        file.IsDeleted = true;
                }

                _unitOfWork.fileRepositoryAsync.Update(file);

                if (!fileRes)
                    throw new RestException(HttpStatusCode.BadRequest, "خطا در ذخیره تصویر");

                var success = await _unitOfWork.SaveAsync() > 0;
                if (success)
                    return new ResultDTO<string>(HttpStatusCode.OK, "ذخیره تصویر با موفقیت انجام شد.");

                throw new RestException(HttpStatusCode.BadRequest, "خطا در عملیات ویرایش");
            }
        }
    }
}
