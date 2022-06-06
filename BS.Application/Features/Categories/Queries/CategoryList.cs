using AutoMapper;
using BS.Application.Common.Models;
using BS.Application.Features.Categories.DTOs;
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
using System.Threading.Tasks;
using System.Linq.Dynamic.Core;
using BS.Application.Common.DTOs;
using BS.Application.Common.Enums;

namespace BS.Application.Features.Categories.Queries
{
    public class CategoryList
    {
        public class CategoryEnvelope
        {
            public List<CategoryListItemDTO> CategoryList { get; set; }
            public int CategoryCount { get; set; }
        }
        public class CategoryListQuery : ListSearchParam, IRequest<CategoryEnvelope>
        {
            public string Title { get; set; }
        }

        public class CategoryListHandLer : IRequestHandler<CategoryListQuery, CategoryEnvelope>
        {
            private readonly IUnitOfWork _unitOfWork;
            private readonly IUserAccessor _userAccessor;
            private readonly IMapper _mapper;
            private readonly IFileHelper _fileHelper;
            private readonly IAdjustChar _adjustChar;


            public CategoryListHandLer(IUnitOfWork unitOfWork, IUserAccessor userAccessor, IMapper mapper, IFileHelper fileHelper, IAdjustChar adjustChar)
            {
                _unitOfWork = unitOfWork;
                _userAccessor = userAccessor;
                _fileHelper = fileHelper;
                _mapper = mapper;
                _adjustChar = adjustChar;
            }
            public async Task<CategoryEnvelope> Handle(CategoryListQuery request, CancellationToken cancellationToken)
            {
                var user = await _userAccessor.GetUserData();
                if (user == null)
                    throw new RestException(HttpStatusCode.NotFound, "خطا، کاربری یافت نشد");

                if (user.DepartmentId == null)
                    throw new RestException(HttpStatusCode.BadRequest, "خطا، اطلاعات مجموعه وارد نشده است...");

                var isExistMenu = _unitOfWork.menuRepositoryAsync.Any(n => n.DepartmentId == user.DepartmentId! && n.IsDeleted == false);
                if (!isExistMenu)
                    throw new RestException(HttpStatusCode.BadRequest, "خطا، اطلاعات منو وارد نشده است...");

                var menu = await _unitOfWork.menuRepositoryAsync.GetFirstAsync(n => n.DepartmentId == user.DepartmentId && n.IsDeleted == false);


                var query = (from categoryTeble in _unitOfWork.categoryRepositoryAsync.Query()
                             join categoryIconTable in _unitOfWork.categoryIconRepositoryAsync.Query() on categoryTeble.IconId equals categoryIconTable.Id
                             join fileTable in _unitOfWork.fileRepositoryAsync.Query() on categoryIconTable.Id equals fileTable.EntityId
                             where categoryTeble.MenuId == menu.Id && categoryTeble.IsDeleted == false && fileTable.EntityName == EntityName.CategoryIcon.ToString()
                             select new CategoryListItemDTO
                             {
                                 Id = categoryTeble.Id.ToString().ToLower(),
                                 Key = categoryTeble.Id.ToString().ToLower(),
                                 Title = categoryTeble.Title,
                                 Url = _fileHelper.GetFilePath(fileTable.Id.ToString().ToLower(), fileTable.FileName, FileDirectorey.categoryIcon),
                                 Order = categoryTeble.Order
                             });

                #region Search

                if (!string.IsNullOrEmpty(request.Title))
                    query = query.Where(x => x.Title.Contains(_adjustChar.ChangeToArabicChar(request.Title)));

                #endregion

                #region Order by
                if (string.IsNullOrEmpty(request.SortColumn))
                    query = query.OrderBy(x => x.Order);

                else
                    query = query.OrderBy($"order asc");

                #endregion

                var result = new CategoryEnvelope();

                int offset = (request.Page-1 ?? 0) * (request.Limit ?? 10);

                var list = await query
                    .Skip(offset)
                    .Take(request.Limit ?? 10)
                    .ToListAsync();

                //var categoryList = new List<CategoryListItemDTO>(categoryList);
               
                result.CategoryList = new List<CategoryListItemDTO>(list);
                result.CategoryCount = await query.CountAsync();

                return result;

            }
        }
    }
}
