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
using BS.Application.Features.Departments.DTOs;

namespace BS.Application.Features.Departments.Queries
{
    public class DepartmentManagementList
    {

        public class DepartmentListQuery : ListSearchParamDTO, IRequest<DepartmentManagementEnvelopeDTO>
        {
            public string Title { get; set; }
            public string PostalCode { get; set; }
            public string Phone { get; set; }
        }

        public class DepartmentListHandLer : IRequestHandler<DepartmentListQuery, DepartmentManagementEnvelopeDTO>
        {
            private readonly IUnitOfWork _unitOfWork;
            private readonly IUserAccessor _userAccessor;
            private readonly IMapper _mapper;
            private readonly IFileHelper _fileHelper;
            private readonly IAdjustChar _adjustChar;


            public DepartmentListHandLer(IUnitOfWork unitOfWork, IUserAccessor userAccessor, IMapper mapper, IFileHelper fileHelper, IAdjustChar adjustChar)
            {
                _unitOfWork = unitOfWork;
                _userAccessor = userAccessor;
                _fileHelper = fileHelper;
                _mapper = mapper;
                _adjustChar = adjustChar;
            }
            public async Task<DepartmentManagementEnvelopeDTO> Handle(DepartmentListQuery request, CancellationToken cancellationToken)
            {
                var user = await _userAccessor.GetUserData();
                if (user == null)
                    throw new RestException(HttpStatusCode.NotFound, "خطا، کاربری یافت نشد");



                var query = (from depTeble in _unitOfWork.departmentRepositoryAsync.Query()
                             where depTeble.IsDeleted == false
                             select new DepartmentManagementListItemDTO
                             {
                                 Id = depTeble.Id.ToString().ToLower(),
                                 Key = depTeble.Id.ToString().ToLower(),
                                 Title = depTeble.Title,
                                 Phone = depTeble.Phone,
                                 PostalCode = depTeble.PostalCode,
                                 IsActivated = depTeble.IsActived
                             });

                #region Search

                if (!string.IsNullOrEmpty(request.Title))
                    query = query.Where(x => x.Title.Contains(_adjustChar.ChangeToArabicChar(request.Title)));

                if (!string.IsNullOrEmpty(request.Phone))
                    query = query.Where(x => x.Phone.Contains(_adjustChar.ChangeToArabicChar(request.Phone)));

                if (!string.IsNullOrEmpty(request.PostalCode))
                    query = query.Where(x => x.PostalCode.Contains(_adjustChar.ChangeToArabicChar(request.PostalCode)));



                #endregion

                #region Order by
                if (string.IsNullOrEmpty(request.SortColumn))
                    query = query.OrderBy(x => x.Title);

                else
                    query = query.OrderBy($"{request.SortColumn} {request.SortDirection}");

                #endregion

                var result = new DepartmentManagementEnvelopeDTO();

                int offset = (request.Page - 1 ?? 0) * (request.Limit ?? 10);

                var list = await query
                    .Skip(offset)
                    .Take(request.Limit ?? 10)
                    .AsNoTracking()
                    .ToListAsync();

                result.DepartmentList = new List<DepartmentManagementListItemDTO>(list);
                result.DepartmentCount = await query.CountAsync();

                return result;

            }
        }
    }
}
