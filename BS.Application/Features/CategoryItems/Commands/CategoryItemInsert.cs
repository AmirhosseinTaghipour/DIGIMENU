using AutoMapper;
using BS.Application.Common.DTOs;
using BS.Application.Common.Enums;
using BS.Application.Common.Models;
using BS.Application.Features.CategoryItems.DTOs;
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

namespace BS.Application.Features.CategoryItems.Commands
{
    public class CategoryItemInsert
    {
        public class CategoryItemInsertCommand : CategoryItemFormDTO, IRequest<ResultDTO<string>>
        {

        }

        public class CategoryItemInsertHandler : IRequestHandler<CategoryItemInsertCommand, ResultDTO<string>>
        {
            private readonly IUserAccessor _userAccessor;
            private readonly IUnitOfWork _unitOfWork;
            private readonly IFileHelper _fileHelper;
            private readonly IMapper _mapper;

            public CategoryItemInsertHandler(IUserAccessor userAccessor, IUnitOfWork unitOfWork, IMapper mapper, IFileHelper fileHelper)
            {
                _unitOfWork = unitOfWork;
                _userAccessor = userAccessor;
                _mapper = mapper;
                _fileHelper = fileHelper;
            }
            public async Task<ResultDTO<string>> Handle(CategoryItemInsertCommand request, CancellationToken cancellationToken)
            {
                if (request.IsUpdateMode == true)
                    throw new RestException(HttpStatusCode.BadRequest, "خطا، مود آپدیت...");

                if (string.IsNullOrEmpty(request.Title) || string.IsNullOrEmpty(request.CategoryId) || request.Price == 0)
                    throw new RestException(HttpStatusCode.BadRequest, "خطا، فیلد های ضروری نمیتواند خالی باشد.");


                var user = await _userAccessor.GetUserData();
                if (user == null)
                    throw new RestException(HttpStatusCode.NotFound, "خطا، کاربری یافت نشد");

                if (user.DepartmentId == null)
                    throw new RestException(HttpStatusCode.BadRequest, "خطا، اطلاعات مجموعه وارد نشده است...");

                var isExistMenu = _unitOfWork.menuRepositoryAsync.Any(n => n.DepartmentId == user.DepartmentId! && n.IsDeleted == false);
                if (!isExistMenu)
                    throw new RestException(HttpStatusCode.BadRequest, "خطا، اطلاعات منو صحیح است...");

                var menu = await _unitOfWork.menuRepositoryAsync.GetFirstAsync(n => n.DepartmentId == user.DepartmentId && n.IsDeleted == false);


                var isExistCategory = _unitOfWork.categoryRepositoryAsync.Any(n => n.Id == new Guid(request.CategoryId) && n.MenuId == menu.Id && n.DepartmentId == user.DepartmentId! && n.IsDeleted == false);
                if (!isExistCategory)
                    throw new RestException(HttpStatusCode.BadRequest, "خطا، اطلاعات دسته بندی صحیح است...");

                var category = await _unitOfWork.categoryRepositoryAsync.GetFirstAsync(n => n.Id == new Guid(request.CategoryId) && n.MenuId == menu.Id && n.DepartmentId == user.DepartmentId! && n.IsDeleted == false);

                var maxOrder = 0;
                if (_unitOfWork.categoryItemRepositoryAsync.Query().Where(n => n.CategoryId==category.Id && n.IsDeleted == false).Any())
                    maxOrder = _unitOfWork.categoryItemRepositoryAsync.Query().Where(n => n.CategoryId == category.Id && n.IsDeleted == false).Max(n => n.Order);

                var categoryItem = new CategoryItem();
                var categoryItemId = Guid.NewGuid();
                categoryItem.Id = categoryItemId;
                categoryItem.CategoryId = category.Id;
                categoryItem.Title = request.Title;
                categoryItem.Description = request.Description;
                categoryItem.Price = request.Price ?? 0;
                categoryItem.DepartmentId = user.DepartmentId;
                categoryItem.InsertDate = DateTime.Now;
                categoryItem.InsertUser = _userAccessor.GetCurrentUserName().ToLower();
                categoryItem.Order = maxOrder + 1;
                categoryItem.IsDeleted = false;
                categoryItem.IsExist = request.IsExist;
                categoryItem.Discount = request.Discount ?? 0;
                categoryItem.DiscountType = request.DiscountType ?? 0;
                categoryItem.UseDiscount = request.UseDiscount;

                if (request.DiscountType != null && request.Price != null && request.Discount != null)
                    if (request.DiscountType == 0) //discount is in value
                    {
                        categoryItem.DiscountPercent = (int)Math.Round(((double)(request.Discount.Value) / request.Price.Value) * 100);
                        categoryItem.DiscountValue = request.Discount.Value;
                    }
                    else
                    {
                        categoryItem.DiscountPercent = request.Discount.Value;
                        categoryItem.DiscountValue = (int)Math.Round(((double)(request.Discount.Value) / 100) * request.Price.Value);
                    }


                    await _unitOfWork.categoryItemRepositoryAsync.AddAsync(categoryItem);

                    var success = await _unitOfWork.SaveAsync() > 0;
                    if (success)
                        return new ResultDTO<string>(HttpStatusCode.OK, "اطلاعات آیتم موفقیت ثیت شد.");        

                throw new RestException(HttpStatusCode.BadRequest, "خطا در عملیات ثبت");

            }
        }
    }
}
