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


namespace BS.Application.Features.Categories.Queries
{
    public class CategoryList
    {
        public class CategoryListQuery : IRequest<CategoryEnvelopeDTO>
        {
            public string Title { get; set; }
            public string SortColumn { get; set; }
            public string SortDirection { get; set; }
            public int? Limit { get; set; }
            public int? Page { get; set; }
        }

        public class CategoryListHandLer : IRequestHandler<CategoryListQuery, CategoryEnvelopeDTO>
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
            public async Task<CategoryEnvelopeDTO> Handle(CategoryListQuery request, CancellationToken cancellationToken)
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
                             where categoryTeble.MenuId == menu.Id && categoryTeble.IsDeleted == false
                             select new CategoryDTO
                             {
                                 Id = categoryTeble.Id.ToString(),
                                 Title = categoryTeble.Title,
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
                    query = query.OrderBy($"{request.SortColumn} {request.SortDirection}");

                #endregion

                var result = new CategoryEnvelopeDTO();

                int offset = (request.Page ?? 0) * (request.Limit ?? 10);

                var list = await query
                    .Skip(offset)
                    .Take(request.Limit ?? 10)
                    .ToListAsync();

                result.CategoriesList = new List<CategoryDTO>(list);
                result.CategoriesCount = await query.CountAsync();

                return result;

            }
        }
    }
}
