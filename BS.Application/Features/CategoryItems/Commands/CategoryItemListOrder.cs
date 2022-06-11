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
using BS.Domain.Entities;
using BS.Application.Features.CategoryItems.DTOs;

namespace BS.Application.Features.CategoryItems.Commands
{
    public class CategoryItemListOrder
    {
        public class CategoryItemEnvelope
        {
            public List<CategoryItemListItemDTO> CategoryItemList { get; set; }
            public int CategoryItemCount { get; set; }
        }
        public class CategoryItemListOrderCommand : IRequest<CategoryItemEnvelope>
        {
            public string Id { get; set; }
            public string CategoryId { get; set; }
            public int Movement { get; set; }
            public int? Limit { get; set; }   // تعداد در هر صفحه
            public int? Page { get; set; }    // کدام صفحه
        }

        public class CategoryItemListOrderHandLer : IRequestHandler<CategoryItemListOrderCommand, CategoryItemEnvelope>
        {
            private readonly IUnitOfWork _unitOfWork;
            private readonly IUserAccessor _userAccessor;
            private readonly IMapper _mapper;
            private readonly IFileHelper _fileHelper;
            private readonly IAdjustChar _adjustChar;


            public CategoryItemListOrderHandLer(IUnitOfWork unitOfWork, IUserAccessor userAccessor, IMapper mapper, IFileHelper fileHelper, IAdjustChar adjustChar)
            {
                _unitOfWork = unitOfWork;
                _userAccessor = userAccessor;
                _fileHelper = fileHelper;
                _mapper = mapper;
                _adjustChar = adjustChar;
            }
            public async Task<CategoryItemEnvelope> Handle(CategoryItemListOrderCommand request, CancellationToken cancellationToken)
            {
                if (string.IsNullOrEmpty(request.Id))
                    throw new RestException(HttpStatusCode.BadRequest, "خطا، آیدی نمیتواند خالی باشد");

                if (string.IsNullOrEmpty(request.CategoryId))
                    throw new RestException(HttpStatusCode.BadRequest, "خطا، فیلد های ضروری نمیتواند خالی باشد.");

                var user = await _userAccessor.GetUserData();
                if (user == null)
                    throw new RestException(HttpStatusCode.NotFound, "خطا، کاربری یافت نشد");

                if (user.DepartmentId == null)
                    throw new RestException(HttpStatusCode.BadRequest, "خطا، اطلاعات مجموعه وارد نشده است...");

                var isExistMenu = _unitOfWork.menuRepositoryAsync.Any(n => n.DepartmentId == user.DepartmentId! && n.IsDeleted == false);
                if (!isExistMenu)
                    throw new RestException(HttpStatusCode.BadRequest, "خطا، اطلاعات منو وارد نشده است...");

                var menu = await _unitOfWork.menuRepositoryAsync.GetFirstAsync(n => n.DepartmentId == user.DepartmentId && n.IsDeleted == false);

                var categoryItem = await _unitOfWork.categoryItemRepositoryAsync.GetFirstAsync(n => n.Id == new Guid(request.Id) && n.CategoryId == new Guid(request.CategoryId) && n.IsDeleted == false); ;
                if (categoryItem == null)
                    throw new RestException(HttpStatusCode.NotFound, "خطا، رکوردی یافت نشد");



                var fromOrder = categoryItem.Order;
                CategoryItem nexCategoryItem = null;

                if (request.Movement > 0)
                    nexCategoryItem = await _unitOfWork.categoryItemRepositoryAsync.Query().Where(n => n.CategoryId == new Guid(request.CategoryId) && n.Order > fromOrder && n.IsDeleted == false).OrderBy(n => n.Order).FirstOrDefaultAsync();

                else
                    nexCategoryItem = await _unitOfWork.categoryItemRepositoryAsync.Query().Where(n => n.CategoryId == new Guid(request.CategoryId) && n.Order < fromOrder && n.IsDeleted == false).OrderByDescending(n => n.Order).FirstOrDefaultAsync();

                if (nexCategoryItem != null)
                {
                    categoryItem.Order = nexCategoryItem.Order;
                    nexCategoryItem.Order = fromOrder;

                    _unitOfWork.categoryItemRepositoryAsync.Update(categoryItem);
                    _unitOfWork.categoryItemRepositoryAsync.Update(nexCategoryItem);

                    var success = await _unitOfWork.SaveAsync() > 0;
                    if (!success)
                        throw new RestException(HttpStatusCode.BadRequest, "خطا در عملیات");
                }



                var query = (from categoryItemTeble in _unitOfWork.categoryItemRepositoryAsync.Query()
                             join categoryTable in _unitOfWork.categoryRepositoryAsync.Query() on categoryItemTeble.CategoryId equals categoryTable.Id
                             join menuTable in _unitOfWork.menuRepositoryAsync.Query() on categoryTable.MenuId equals menuTable.Id
                             where menuTable.Id == menu.Id && categoryTable.Id == new Guid(request.CategoryId) && menuTable.IsDeleted == false && categoryTable.IsDeleted == false && categoryItemTeble.IsDeleted == false
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
                                 CategoryOrder=categoryTable.Order,
                                 Url = "",
                             });



                #region Order by

                query = query.OrderBy(x => x.CategoryOrder).ThenBy(x => x.Order);

                #endregion

                var result = new CategoryItemEnvelope();

                int offset = (request.Page - 1 ?? 0) * (request.Limit ?? 10);


                var list = await query
                    .Skip(offset)
                    .Take(request.Limit ?? 10)
                    .ToListAsync();



                result.CategoryItemList = new List<CategoryItemListItemDTO>(list);
                result.CategoryItemCount = await query.CountAsync();

                return result;

            }
        }
    }
}

