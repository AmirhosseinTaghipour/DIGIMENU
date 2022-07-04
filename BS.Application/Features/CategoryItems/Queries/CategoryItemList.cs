using AutoMapper;
using BS.Application.Common.Models;
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
using BS.Application.Features.CategoryItems.DTOs;

namespace BS.Application.Features.CategoryItems.Queries
{
    public class CategoryItemList
    {
        public class CategoryItemListQuery : ListSearchParamDTO, IRequest<CategoryItemEnvelope>
        {
            public string CategoryId { get; set; }
            public string Title { get; set; }
            public string CategoryTitle { get; set; }
        }

        public class CategoryItemListHandLer : IRequestHandler<CategoryItemListQuery, CategoryItemEnvelope>
        {
            private readonly IUnitOfWork _unitOfWork;
            private readonly IUserAccessor _userAccessor;
            private readonly IMapper _mapper;
            private readonly IFileHelper _fileHelper;
            private readonly IAdjustChar _adjustChar;


            public CategoryItemListHandLer(IUnitOfWork unitOfWork, IUserAccessor userAccessor, IMapper mapper, IFileHelper fileHelper, IAdjustChar adjustChar)
            {
                _unitOfWork = unitOfWork;
                _userAccessor = userAccessor;
                _fileHelper = fileHelper;
                _mapper = mapper;
                _adjustChar = adjustChar;
            }
            public async Task<CategoryItemEnvelope> Handle(CategoryItemListQuery request, CancellationToken cancellationToken)
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


                var query = (from categoryItemTeble in _unitOfWork.categoryItemRepositoryAsync.Query()
                             join categoryTable in _unitOfWork.categoryRepositoryAsync.Query() on categoryItemTeble.CategoryId equals categoryTable.Id
                             join menuTable in _unitOfWork.menuRepositoryAsync.Query() on categoryTable.MenuId equals menuTable.Id
                             join fileTable in _unitOfWork.fileRepositoryAsync.Query() on
                             new { Id = categoryItemTeble.Id, EntityName = "CategoryItem", IsDefault = true } equals new { Id = fileTable.EntityId, EntityName = fileTable.EntityName, IsDefault = fileTable.IsDefault }
                             into files
                             from fileTable in files.DefaultIfEmpty()
                             where menuTable.Id == menu.Id && menuTable.IsDeleted == false && categoryTable.IsDeleted == false && categoryItemTeble.IsDeleted == false
                             select new CategoryItemListItemDTO
                             {
                                 Id = categoryItemTeble.Id.ToString().ToLower(),
                                 Key = categoryItemTeble.Id.ToString().ToLower(),
                                 Title = categoryItemTeble.Title,
                                 CategoryTitle = categoryTable.Title,
                                 CategoryId = categoryTable.Id.ToString(),
                                 Price = categoryItemTeble.Price,
                                 IsExist = categoryItemTeble.IsExist,
                                 discountPercent = categoryItemTeble.UseDiscount ? categoryItemTeble.DiscountPercent : 0,
                                 discountValue = categoryItemTeble.UseDiscount ? categoryItemTeble.DiscountValue : 0,
                                 Order = categoryItemTeble.Order,
                                 CategoryOrder = categoryTable.Order,
                                 Url = fileTable.Id != null ? _fileHelper.GetFilePath(fileTable.Id.ToString().ToLower(), fileTable.FileName, FileDirectorey.ItemImageThumbnail) : null
                             });

                #region Search

                if (!string.IsNullOrEmpty(request.Title))
                    query = query.Where(x => x.Title.Contains(_adjustChar.ChangeToArabicChar(request.Title)));

                if (!string.IsNullOrEmpty(request.CategoryTitle))
                    query = query.Where(x => x.CategoryTitle.Contains(_adjustChar.ChangeToArabicChar(request.CategoryTitle)));

                if (!string.IsNullOrEmpty(request.CategoryId))
                    query = query.Where(x => x.CategoryId == request.CategoryId);

                #endregion

                #region Order by

                query = query.OrderBy(x => x.CategoryOrder).ThenBy(x => x.Order);

                #endregion

                var result = new CategoryItemEnvelope();

                int offset = (request.Page - 1 ?? 0) * (request.Limit ?? 10);


                var list = await query
                    .Skip(offset)
                    .Take(request.Limit ?? 10)
                    .AsNoTracking()
                    .ToListAsync();



                result.CategoryItemList = new List<CategoryItemListItemDTO>(list);
                result.CategoryItemCount = await query.CountAsync();

                return result;

            }
        }
    }
}
