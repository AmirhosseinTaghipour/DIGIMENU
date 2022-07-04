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
    public class CategoryIconList
    {
        public class CategoryIconEnvelope
        {
            public List<CategoryIconListItemDTO> categoryIconList { get; set; }
            public int categoryIconCount { get; set; }
        }
        public class CategoryIconListQuery : ListSearchParamDTO, IRequest<CategoryIconEnvelope>
        {
            //List Parameter
            public string Title { get; set; }        
        }

        public class CategoryIconListHandLer : IRequestHandler<CategoryIconListQuery, CategoryIconEnvelope>
        {
            private readonly IUnitOfWork _unitOfWork;
            private readonly IUserAccessor _userAccessor;
            private readonly IMapper _mapper;
            private readonly IFileHelper _fileHelper;
            private readonly IAdjustChar _adjustChar;
            

            public CategoryIconListHandLer(IUnitOfWork unitOfWork, IUserAccessor userAccessor, IMapper mapper, IFileHelper fileHelper, IAdjustChar adjustChar)
            {
                _unitOfWork = unitOfWork;
                _userAccessor = userAccessor;
                _fileHelper = fileHelper;
                _mapper = mapper;
                _adjustChar = adjustChar;
            }
            public async Task<CategoryIconEnvelope> Handle(CategoryIconListQuery request, CancellationToken cancellationToken)
            {
                var query = (from categoryIconTable in _unitOfWork.categoryIconRepositoryAsync.Query()
                             join fileTable in _unitOfWork.fileRepositoryAsync.Query() on categoryIconTable.Id equals fileTable.EntityId
                             where fileTable.EntityName == EntityName.CategoryIcon.ToString()
                             && fileTable.IsDeleted != true && categoryIconTable.IsDeleted != true
                             select new CategoryIconListItemDTO
                             {
                                 Id = categoryIconTable.Id.ToString().ToLower(),
                                 Key = categoryIconTable.Id.ToString().ToLower(),
                                 Title = categoryIconTable.Title,
                                 Url = _fileHelper.GetFilePath(fileTable.Id.ToString().ToLower(), fileTable.FileName, FileDirectorey.categoryIcon),
                             });

                // Search
                #region Search

                if (!string.IsNullOrEmpty(request.Title))
                {
                    query = query.Where(x => x.Title.Contains(_adjustChar.ChangeToArabicChar(request.Title)));
                }
                #endregion

                // Order by
                #region Order by
                if (string.IsNullOrEmpty(request.SortColumn))
                {
                    query = query.OrderBy(x => x.Title);
                }
                else
                {
                    query = query.OrderBy($"{request.SortColumn} {request.SortDirection}");
                }
                #endregion
                var result = new CategoryIconEnvelope();

                int offset = (request.Page-1 ?? 0) * (request.Limit ?? 10);

                var list = await query
                    .Skip(offset)
                    .Take(request.Limit ?? 10)
                    .AsNoTracking()
                    .ToListAsync();

                result.categoryIconList = new List<CategoryIconListItemDTO>(list);
                result.categoryIconCount = await query.CountAsync();

                return result;
            }
        }
    }
}
