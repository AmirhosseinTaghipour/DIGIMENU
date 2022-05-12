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
using BS.Domain.Entities;

namespace BS.Application.Features.Categories.Commands
{
    public class CategoryListOrder
    {
        public class CategoryEnvelope
        {
            public List<CategoryListItemDTO> CategoryList { get; set; }
            public int CategoryCount { get; set; }
        }
        public class CategoryListOrderQuery : IRequest<CategoryEnvelope>
        {
            public string Id { get; set; }
            public int Movement { get; set; }
            public int? Limit { get; set; }   // تعداد در هر صفحه
            public int? Page { get; set; }    // کدام صفحه
        }

        public class CategoryListOrderHandLer : IRequestHandler<CategoryListOrderQuery, CategoryEnvelope>
        {
            private readonly IUnitOfWork _unitOfWork;
            private readonly IUserAccessor _userAccessor;
            private readonly IMapper _mapper;
            private readonly IFileHelper _fileHelper;
            private readonly IAdjustChar _adjustChar;


            public CategoryListOrderHandLer(IUnitOfWork unitOfWork, IUserAccessor userAccessor, IMapper mapper, IFileHelper fileHelper, IAdjustChar adjustChar)
            {
                _unitOfWork = unitOfWork;
                _userAccessor = userAccessor;
                _fileHelper = fileHelper;
                _mapper = mapper;
                _adjustChar = adjustChar;
            }
            public async Task<CategoryEnvelope> Handle(CategoryListOrderQuery request, CancellationToken cancellationToken)
            {
                if (string.IsNullOrEmpty(request.Id))
                    throw new RestException(HttpStatusCode.BadRequest, "خطا، آیدی نمیتواند خالی باشد");

                var user = await _userAccessor.GetUserData();
                if (user == null)
                    throw new RestException(HttpStatusCode.NotFound, "خطا، کاربری یافت نشد");

                if (user.DepartmentId == null)
                    throw new RestException(HttpStatusCode.BadRequest, "خطا، اطلاعات مجموعه وارد نشده است...");

                var isExistMenu = _unitOfWork.menuRepositoryAsync.Any(n => n.DepartmentId == user.DepartmentId! && n.IsDeleted == false);
                if (!isExistMenu)
                    throw new RestException(HttpStatusCode.BadRequest, "خطا، اطلاعات منو وارد نشده است...");

                var menu = await _unitOfWork.menuRepositoryAsync.GetFirstAsync(n => n.DepartmentId == user.DepartmentId && n.IsDeleted == false);

                var category = await _unitOfWork.categoryRepositoryAsync.GetByIdAsync(new Guid(request.Id));
                if (category == null)
                    throw new RestException(HttpStatusCode.NotFound, "خطا، رکوردی یافت نشد");



                var fromOrder = category.Order;
                Category nexCategory = null;

                if (request.Movement > 0)
                    nexCategory = await _unitOfWork.categoryRepositoryAsync.Query().Where(n => n.MenuId == menu.Id && n.Order > fromOrder && n.IsDeleted == false).OrderBy(n => n.Order).FirstOrDefaultAsync();

                else
                    nexCategory = await _unitOfWork.categoryRepositoryAsync.Query().Where(n => n.MenuId == menu.Id && n.Order < fromOrder && n.IsDeleted == false).OrderByDescending(n => n.Order).FirstOrDefaultAsync();

                if (nexCategory != null)
                {
                    category.Order = nexCategory.Order;
                    nexCategory.Order = fromOrder;

                    _unitOfWork.categoryRepositoryAsync.Update(category);
                    _unitOfWork.categoryRepositoryAsync.Update(nexCategory);

                    var success = await _unitOfWork.SaveAsync() > 0;
                    if (!success)
                        throw new RestException(HttpStatusCode.BadRequest, "خطا در عملیات");
                }



                var query = (from categoryTeble in _unitOfWork.categoryRepositoryAsync.Query()
                             join categoryIconTable in _unitOfWork.categoryIconRepositoryAsync.Query() on categoryTeble.IconId equals categoryIconTable.Id
                             join fileTable in _unitOfWork.fileRepositoryAsync.Query() on categoryIconTable.Id equals fileTable.EntityId
                             where categoryTeble.MenuId == menu.Id && categoryTeble.IsDeleted == false && fileTable.EntityName == EntityName.CategoryIcon.ToString()
                             select new CategoryListItemDTO
                             {
                                 Id = categoryTeble.Id.ToString(),
                                 Key = categoryTeble.Id.ToString(),
                                 Title = categoryTeble.Title,
                                 Url = _fileHelper.GetFilePath(fileTable.Id.ToString(), fileTable.FileName, FileDirectorey.categoryIcon),
                                 Order = categoryTeble.Order
                             });


                #region Order by
                query = query.OrderBy($"order asc");
                #endregion

                var result = new CategoryEnvelope();

                int offset = (request.Page - 1 ?? 0) * (request.Limit ?? 10);

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
