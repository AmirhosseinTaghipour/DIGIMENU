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
using BS.Application.Features.Users.DTOs;

namespace BS.Application.Features.Users.Queries
{
    public class UserList
    {
        public class UserManagementEnvelope
        {
            public List<UserManagementListItemDTO> UserList { get; set; }
            public int UserCount { get; set; }
        }
        public class UserListQuery : ListSearchParamDTO, IRequest<UserManagementEnvelope>
        {
            public string Name { get; set; }
            public string UserName { get; set; }
            public string DepartmentName { get; set; }
            public string DepartmentId { get; set; }
            public string RoleName { get; set; }
            public string Mobile { get; set; }
        }

        public class UserListHandLer : IRequestHandler<UserListQuery, UserManagementEnvelope>
        {
            private readonly IUnitOfWork _unitOfWork;
            private readonly IUserAccessor _userAccessor;
            private readonly IMapper _mapper;
            private readonly IFileHelper _fileHelper;
            private readonly IAdjustChar _adjustChar;


            public UserListHandLer(IUnitOfWork unitOfWork, IUserAccessor userAccessor, IMapper mapper, IFileHelper fileHelper, IAdjustChar adjustChar)
            {
                _unitOfWork = unitOfWork;
                _userAccessor = userAccessor;
                _fileHelper = fileHelper;
                _mapper = mapper;
                _adjustChar = adjustChar;
            }
            public async Task<UserManagementEnvelope> Handle(UserListQuery request, CancellationToken cancellationToken)
            {
                var user = await _userAccessor.GetUserData();
                if (user == null)
                    throw new RestException(HttpStatusCode.NotFound, "خطا، کاربری یافت نشد");

                var query = (from userTeble in _unitOfWork.userRepositoryAsync.Query()
                             join roleTable in _unitOfWork.roleRepositoryAsync.Query() on userTeble.RoleId equals roleTable.Id
                             join departmentTable in _unitOfWork.departmentRepositoryAsync.Query() on userTeble.DepartmentId equals departmentTable.Id
                             into departments
                             from departmentTable in departments.DefaultIfEmpty()
                             where userTeble.IsDeleted == false
                             select new UserManagementListItemDTO
                             {
                                 Id = userTeble.Id.ToString().ToLower(),
                                 Key = userTeble.Id.ToString().ToLower(),
                                 UserName = userTeble.Username,
                                 Name = userTeble.Name,
                                 Mobile = userTeble.Mobile,
                                 DepartmentName = departmentTable.Title,
                                 RoleName = roleTable.Title,
                                 IsActivated = userTeble.IsActivated
                             });

                if (!string.IsNullOrEmpty(request.DepartmentId))
                {
                    Guid departmentId;
                    if (!Guid.TryParse(request.DepartmentId, out departmentId))
                        throw new RestException(HttpStatusCode.BadRequest, "خطا، مقدار پارامتر ورودی صحیح نیست...");

                    query = (from userTeble in _unitOfWork.userRepositoryAsync.Query()
                             join roleTable in _unitOfWork.roleRepositoryAsync.Query() on userTeble.RoleId equals roleTable.Id
                             join departmentTable in _unitOfWork.departmentRepositoryAsync.Query() on userTeble.DepartmentId equals departmentTable.Id
                             into departments
                             from departmentTable in departments.DefaultIfEmpty()
                             where userTeble.IsDeleted == false && departmentTable.Id == departmentId
                             select new UserManagementListItemDTO
                             {
                                 Id = userTeble.Id.ToString().ToLower(),
                                 Key = userTeble.Id.ToString().ToLower(),
                                 UserName = userTeble.Username,
                                 Name = userTeble.Name,
                                 Mobile = userTeble.Mobile,
                                 DepartmentName = departmentTable.Title,
                                 RoleName = roleTable.Title,
                                 IsActivated = userTeble.IsActivated
                             });
                }



                #region Search

                if (!string.IsNullOrEmpty(request.Name))
                    query = query.Where(x => x.Name.Contains(_adjustChar.ChangeToArabicChar(request.Name)));

                if (!string.IsNullOrEmpty(request.Mobile))
                    query = query.Where(x => x.Mobile.Contains(_adjustChar.ChangeToArabicChar(request.Mobile)));


                if (!string.IsNullOrEmpty(request.DepartmentName))
                    query = query.Where(x => x.DepartmentName.Contains(_adjustChar.ChangeToArabicChar(request.DepartmentName)));


                if (!string.IsNullOrEmpty(request.RoleName))
                    query = query.Where(x => x.RoleName.Contains(_adjustChar.ChangeToArabicChar(request.RoleName)));

                if (!string.IsNullOrEmpty(request.UserName))
                    query = query.Where(x => x.UserName.Contains(_adjustChar.ChangeToArabicChar(request.UserName)));


                #endregion

                #region Order by
                if (string.IsNullOrEmpty(request.SortColumn))
                    query = query.OrderBy(x => x.RoleName);

                else
                    query = query.OrderBy($"{request.SortColumn} {request.SortDirection}");

                #endregion

                var result = new UserManagementEnvelope();

                int offset = (request.Page - 1 ?? 0) * (request.Limit ?? 10);

                var list = await query
                    .Skip(offset)
                    .Take(request.Limit ?? 10)
                    .AsNoTracking()
                    .ToListAsync();

                result.UserList = new List<UserManagementListItemDTO>(list);
                result.UserCount = await query.CountAsync();

                return result;

            }
        }
    }
}
