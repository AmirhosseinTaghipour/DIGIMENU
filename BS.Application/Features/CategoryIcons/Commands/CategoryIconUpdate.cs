using AutoMapper;
using BS.Application.Common.DTOs;
using BS.Application.Common.Enums;
using BS.Application.Common.Models;
using BS.Application.Features.CategoryIcons.DTOs;
using BS.Application.Interfaces;
using BS.Application.Interfaces.Repositories;
using BS.Domain.Entities;
using MediatR;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Net;
using System.Text;
using System.Threading;
using System.Threading.Tasks;

namespace BS.Application.Features.CategoryIcons.Commands
{

    public class CategoryIconUpdate
    {
        public class CategoryIconUpdateCommand : CategoryIconFormDTO, IRequest<ResultDTO<string>>
        {
            
        }

        public class CategoryIconUpdateHandler : IRequestHandler<CategoryIconUpdateCommand, ResultDTO<string>>
        {
            private readonly IUserAccessor _userAccessor;
            private readonly IUnitOfWork _unitOfWork;
            private readonly IFileHelper _fileHelper;
            private readonly IMapper _mapper;

            public CategoryIconUpdateHandler(IUserAccessor userAccessor, IUnitOfWork unitOfWork, IMapper mapper, IFileHelper fileHelper)
            {
                _unitOfWork = unitOfWork;
                _userAccessor = userAccessor;
                _mapper = mapper;
                _fileHelper = fileHelper;
            }
            public async Task<ResultDTO<string>> Handle(CategoryIconUpdateCommand request, CancellationToken cancellationToken)
            {
                if (request.IsUpdateMode == false)
                    throw new RestException(HttpStatusCode.BadRequest, "خطا، مود اینزرت...");

                if (string.IsNullOrEmpty(request.Id))
                    throw new RestException(HttpStatusCode.BadRequest, "خطا، مود اینزرت...");




                var validImgType = _fileHelper.IsValidFile(request.Icon.File);
                var validImgSize = _fileHelper.IsValidSize(request.Icon.File);

                if (!validImgType || !validImgSize)
                    throw new RestException(HttpStatusCode.BadRequest, "خظا، فرمت یا سایز آیکن صحیح نیست.");



               var icon = await _unitOfWork.categoryIconRepositoryAsync.GetByIdAsync(new Guid(request.Id));
                if (icon == null)
                    throw new RestException(HttpStatusCode.NotFound, "خطا، رکوردی یافت نشد");

                icon.Title = request.Title;
                _unitOfWork.categoryIconRepositoryAsync.Update(icon);


                var iconFileRes = true;

                if (request.Icon.IsChanged)
                {
                    var iconFile = await _unitOfWork.fileRepositoryAsync.GetFirstAsync(n => n.EntityId == new Guid(request.Id) && n.EntityName == EntityName.CategoryIcon.ToString() && n.IsDeleted == false);
                    if (iconFile == null)
                    {
                        if (request.Icon.File != null)
                        {
                            var iconFileId = Guid.NewGuid();
                            var file = new File();
                            file.Id = iconFileId;
                            file.FileName = request.Icon.File.FileName;
                            file.InsertDate = DateTime.Now;
                            file.InsertUser = _userAccessor.GetCurrentUserName().ToLower();
                            file.EntityName = EntityName.CategoryIcon.ToString();
                            file.EntityId = icon.Id;
                            file.IsDeleted = false;
                            await _unitOfWork.fileRepositoryAsync.AddAsync(file);
                            iconFileRes = await _fileHelper.SaveFileAsync(request.Icon.File, FileDirectorey.categoryIcon, iconFileId.ToString(), true);
                        }
                    }
                    else
                    {
                        iconFileRes = _fileHelper.DeleteFile(iconFile.Id.ToString(), System.IO.Path.GetExtension(iconFile.FileName), FileDirectorey.categoryIcon);

                        iconFile.UpdateDate = DateTime.Now;
                        iconFile.UpdateUser = _userAccessor.GetCurrentUserName().ToLower().Trim();
                        if (request.Icon.File == null)
                        {
                            iconFile.IsDeleted = true;
                        }
                        else
                        {
                            iconFile.FileName = request.Icon.File.FileName;
                            iconFileRes = await _fileHelper.SaveFileAsync(request.Icon.File, FileDirectorey.categoryIcon, iconFile.Id.ToString(), true);
                        }
                        _unitOfWork.fileRepositoryAsync.Update(iconFile);

                    }

                }

                if (!iconFileRes)
                    throw new RestException(HttpStatusCode.BadRequest, "خطا در ذخیره تصاویر");


                var success = await _unitOfWork.SaveAsync() > 0;
                if (success)
                    return new ResultDTO<string>(HttpStatusCode.OK, "ذخیره آیکن با موفقیت انجام شد.");

                throw new RestException(HttpStatusCode.BadRequest, "خطا در عملیات ویرایش");

            }
        }
    }
}
