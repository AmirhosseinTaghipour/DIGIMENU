using AutoMapper;
using BS.Application.Common;
using BS.Application.Common.DTOs;
using BS.Application.Common.Enums;
using BS.Application.Common.Models;
using BS.Application.Features.CategoryIcons.DTOs;
using BS.Application.Interfaces;
using BS.Application.Interfaces.Repositories;
using MediatR;
using Microsoft.EntityFrameworkCore;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Net;
using System.Text;
using System.Threading;
using System.Linq.Dynamic.Core;

using System.Threading.Tasks;

namespace BS.Application.Features.CategoryIcons.Queries
{
    public class CategoryIcon
    {

        public class CategoryIconQuery : IRequest<CategoryIconFormDTO>
        {
            public string id { get; set; }
        }

        public class CategoryIconHandLer : IRequestHandler<CategoryIconQuery, CategoryIconFormDTO>
        {
            private readonly IUnitOfWork _unitOfWork;
            private readonly IUserAccessor _userAccessor;
            private readonly IMapper _mapper;
            private readonly IFileHelper _fileHelper;
            private readonly IAdjustChar _adjustChar;


            public CategoryIconHandLer(IUnitOfWork unitOfWork, IUserAccessor userAccessor, IMapper mapper, IFileHelper fileHelper, IAdjustChar adjustChar)
            {
                _unitOfWork = unitOfWork;
                _userAccessor = userAccessor;
                _fileHelper = fileHelper;
                _mapper = mapper;
                _adjustChar = adjustChar;
            }
            public async Task<CategoryIconFormDTO> Handle(CategoryIconQuery request, CancellationToken cancellationToken)
            {
                if (string.IsNullOrEmpty(request.id))
                    throw new RestException(HttpStatusCode.BadRequest, "id نمیتواند خالی باشد.");


                var categoryIcon = await _unitOfWork.categoryIconRepositoryAsync.GetByIdAsync(new(request.id));
                if (categoryIcon == null)
                    throw new RestException(HttpStatusCode.BadRequest, "رکوردی یافت نشد.");

                var icon = await _unitOfWork.fileRepositoryAsync.GetFirstAsync(
                   whereCondition: n => n.EntityName == EntityName.CategoryIcon.ToString() && n.EntityId == categoryIcon.Id && n.IsDeleted == false,
                   orderBy: n => n.OrderByDescending(x => x.UpdateDate ?? x.InsertDate),
                   selectField: n => new { n.Id, n.FileName });

                var iconFile = new FileDTO();
                if (icon != null)
                {
                    iconFile.Url = _fileHelper.GetFilePath(icon.Id.ToString(), icon.FileName, FileDirectorey.categoryIcon);
                    iconFile.Name = icon.FileName;
                }

                var res = new CategoryIconFormDTO()
                {
                    Id = categoryIcon.Id.ToString(),
                    Title = categoryIcon.Title,
                    Icon = iconFile,
                    IsUpdateMode = true,
                };

                return res;
            }
        }
    }
}
