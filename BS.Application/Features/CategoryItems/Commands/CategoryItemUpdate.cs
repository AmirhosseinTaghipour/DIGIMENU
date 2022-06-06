﻿using AutoMapper;
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
    public class CategoryItemUpdate
    {
        public class CategoryItemUpdateCommand : CategoryItemFormDTO, IRequest<ResultDTO<string>>
        {

        }

        public class CategoryItemUpdateHandler : IRequestHandler<CategoryItemUpdateCommand, ResultDTO<string>>
        {
            private readonly IUserAccessor _userAccessor;
            private readonly IUnitOfWork _unitOfWork;
            private readonly IFileHelper _fileHelper;
            private readonly IMapper _mapper;

            public CategoryItemUpdateHandler(IUserAccessor userAccessor, IUnitOfWork unitOfWork, IMapper mapper, IFileHelper fileHelper)
            {
                _unitOfWork = unitOfWork;
                _userAccessor = userAccessor;
                _mapper = mapper;
                _fileHelper = fileHelper;
            }
            public async Task<ResultDTO<string>> Handle(CategoryItemUpdateCommand request, CancellationToken cancellationToken)
            {
                if (request.IsUpdateMode == false)
                    throw new RestException(HttpStatusCode.BadRequest, "خطا، مود اینزرت...");

                if (request.Id == null)
                    throw new RestException(HttpStatusCode.BadRequest, "خطا، مود اینزرت...");

                if (string.IsNullOrEmpty(request.Title) || string.IsNullOrEmpty(request.CategoryId) || string.IsNullOrEmpty(request.Description) || request.Price == 0)
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



                var categoryItem = await _unitOfWork.categoryItemRepositoryAsync.GetByIdAsync(new Guid(request.Id));
                categoryItem.CategoryId = category.Id;
                categoryItem.Title = request.Title;
                categoryItem.Description = request.Description;
                categoryItem.Price = request.Price;
                categoryItem.UpdateDate = DateTime.Now;
                categoryItem.UpdateUser = _userAccessor.GetCurrentUserName().ToLower();
                categoryItem.IsExist = request.IsExist;
                if (request.DiscountType == 0) //discount is in value
                {
                    categoryItem.DiscountPercent = (int)Math.Round(((double)(request.Discount) / request.Price) * 100);
                    categoryItem.DiscountValue = request.Discount;
                }
                else //discount is in percent
                {
                    categoryItem.DiscountPercent = request.Discount;
                    categoryItem.DiscountValue = (int)Math.Round(((double)(100 - request.Discount) / 100) * request.Price);
                }
                _unitOfWork.categoryItemRepositoryAsync.Update(categoryItem);


                var success = await _unitOfWork.SaveAsync() > 0;
                if (success)
                    return new ResultDTO<string>(HttpStatusCode.OK, "اطلاعات آیتم با موفقیت ویرایش شد.");

                throw new RestException(HttpStatusCode.BadRequest, "خطا در عملیات ثبت");

            }
        }
    }
}
