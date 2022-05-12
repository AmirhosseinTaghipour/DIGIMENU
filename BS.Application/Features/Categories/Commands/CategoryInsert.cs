using AutoMapper;
using BS.Application.Common.DTOs;
using BS.Application.Common.Models;
using BS.Application.Features.Categories.DTOs;
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

namespace BS.Application.Features.Categories.Commands
{
    public class CategoryInsert
    {
        public class CategoryInsertCommand : CategoryFormDTO, IRequest<ResultDTO<string>>
        {

        }

        public class CategoryInsertHandler : IRequestHandler<CategoryInsertCommand, ResultDTO<string>>
        {
            private readonly IUserAccessor _userAccessor;
            private readonly IUnitOfWork _unitOfWork;
            private readonly IMapper _mapper;

            public CategoryInsertHandler(IUserAccessor userAccessor, IUnitOfWork unitOfWork, IMapper mapper, IFileHelper fileHelper)
            {
                _unitOfWork = unitOfWork;
                _userAccessor = userAccessor;
                _mapper = mapper;
            }
            public async Task<ResultDTO<string>> Handle(CategoryInsertCommand request, CancellationToken cancellationToken)
            {
                if (request.IsUpdateMode == true)
                    throw new RestException(HttpStatusCode.BadRequest, "خطا، مود آپدیت...");
                if (string.IsNullOrEmpty(request.Title) || string.IsNullOrEmpty(request.IconId))
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

                var maxOrder = 0;
                if (_unitOfWork.categoryRepositoryAsync.Query().Where(n => n.IsDeleted == false).Any())
                    maxOrder = _unitOfWork.categoryRepositoryAsync.Query().Where(n => n.IsDeleted == false).Max(n => n.Order);

                var category = new Category();
                category.Id = Guid.NewGuid();
                category.Title = request.Title;
                category.MenuId = menu.Id;
                category.Order = maxOrder + 1;
                category.DepartmentId = user.DepartmentId;
                category.IconId = new Guid(request.IconId);
                category.InsertDate = DateTime.Now;
                category.InsertUser = _userAccessor.GetCurrentUserName().ToLower();
                category.IsDeleted = false;
                await _unitOfWork.categoryRepositoryAsync.AddAsync(category);



                var success = await _unitOfWork.SaveAsync() > 0;
                if (success)
                    return new ResultDTO<string>(HttpStatusCode.OK, "اطلاعات دسته بندی با موفقیت ثیت شد.");

                throw new RestException(HttpStatusCode.BadRequest, "خطا در عملیات ثبت");

            }
        }
    }
}
