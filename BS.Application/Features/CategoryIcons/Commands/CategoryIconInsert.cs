using System;
using System.Collections.Generic;
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
using System.Linq;
using System.Net;
using System.Text;
using System.Threading;
using System.Threading.Tasks;
using BS.Application.Features.CategoryIcons.DTOs;

namespace BS.Application.Features.CategoryIcons.Commands
{
    public class CategoryIconInsert
    {
        public class CategoryIconInsertCommand : CategoryIconFormDTO, IRequest<ResultDTO<string>>
        {

        }

        public class CategoryIconInsertHandler : IRequestHandler<CategoryIconInsertCommand, ResultDTO<string>>
        {
            private readonly IUserAccessor _userAccessor;
            private readonly IUnitOfWork _unitOfWork;
            private readonly IFileHelper _fileHelper;
            private readonly IMapper _mapper;

            public CategoryIconInsertHandler(IUserAccessor userAccessor, IUnitOfWork unitOfWork, IMapper mapper, IFileHelper fileHelper)
            {
                _unitOfWork = unitOfWork;
                _userAccessor = userAccessor;
                _mapper = mapper;
                _fileHelper = fileHelper;
            }
            public async Task<ResultDTO<string>> Handle(CategoryIconInsertCommand request, CancellationToken cancellationToken)
            {
                if (request.IsUpdateMode == true)
                    throw new RestException(HttpStatusCode.BadRequest, "خطا، مود آپدیت...");

                if (!string.IsNullOrEmpty(request.Id))
                    throw new RestException(HttpStatusCode.BadRequest, "خطا، مود آپدیت...");




                var validImgType = _fileHelper.IsValidFile(request.Icon.File);
                var validImgSize = _fileHelper.IsValidSize(request.Icon.File);

                if (!validImgType || !validImgSize)
                    throw new RestException(HttpStatusCode.BadRequest, "خظا، فرمت یا سایز آیکن صحیح نیست.");



                var icon = new CategoryIcon();
                var iconId = Guid.NewGuid();
                icon.Id = iconId;
                icon.Title = request.Title;
                icon.IsDeleted = false;
                await _unitOfWork.categoryIconRepositoryAsync.AddAsync(icon);

                var iconFileRes = true;

                if (request.Icon.File != null)
                {
                    var iconFileId = Guid.NewGuid();
                    var iconFile = new File();
                    iconFile.Id = iconFileId;
                    iconFile.FileName = request.Icon.File.FileName;
                    iconFile.InsertDate = DateTime.Now;
                    iconFile.InsertUser = _userAccessor.GetCurrentUserName().ToLower();
                    iconFile.EntityId = iconId;
                    iconFile.EntityName = EntityName.CategoryIcon.ToString();
                    iconFile.IsDeleted = false;
                    await _unitOfWork.fileRepositoryAsync.AddAsync(iconFile);

                    iconFileRes = await _fileHelper.SaveFileAsync(request.Icon.File, FileDirectorey.categoryIcon, iconFileId.ToString(), true);
                }



                if (!iconFileRes)
                    throw new RestException(HttpStatusCode.BadRequest, "خطا در ذخیره آیکن");


                var success = await _unitOfWork.SaveAsync() > 0;
                if (success)
                    return new ResultDTO<string>(HttpStatusCode.OK, "ذخیره آیکن با موفقیت انجام شد.");

                throw new RestException(HttpStatusCode.BadRequest, "خطا در عملیات ثبت");

            }
        }
    }
}
