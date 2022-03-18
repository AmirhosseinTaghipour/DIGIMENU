using BS.Application.Common;
using BS.Application.Interfaces;
using MediatR;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Net;
using System.Text;
using System.Threading;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Http;
using BS.Application.Interfaces.Repositories;
using System.Security.Claims;
using Microsoft.EntityFrameworkCore;
using BS.Application.Features.Users.DTOs;

namespace BS.Application.Features.Users.Queries
{
    public class CurrentUser
    {

        public class CurrentUserQuery : IRequest<CurrentUserDTO>
        {
        }

        public class CurrentUserHandler : IRequestHandler<CurrentUserQuery, CurrentUserDTO>
        {
            private readonly IUnitOfWork _unitOfWork;
            private readonly IHttpContextAccessor _httpContextAccessor;
            private readonly IRefreshJwtToken _refreshJwtToken;
            private readonly IPersianDate _persianDate;
            private readonly IUserAccessor _userAccessor;

            public CurrentUserHandler(IUnitOfWork unitOfWork, IRefreshJwtToken refreshJwtToken, IHttpContextAccessor httpContextAccessor, IPersianDate persianDate, IUserAccessor userAccessor)
            {
                _unitOfWork = unitOfWork;
                _refreshJwtToken = refreshJwtToken;
                _httpContextAccessor = httpContextAccessor;
                _persianDate = persianDate;
                _userAccessor = userAccessor;
            }

            public async Task<CurrentUserDTO> Handle(CurrentUserQuery request, CancellationToken cancellationToken)
            {
                var userId = _userAccessor.GetCurrentUserId();

                var currentUser = await (from vUser in _unitOfWork.userRepositoryAsync.Query()
                                         join vRole in _unitOfWork.roleRepositoryAsync.Query() on vUser.RoleId equals vRole.Id
                                         join vDepartment in _unitOfWork.departmentRepositoryAsync.Query() on vUser.DepartmentId equals vDepartment.Id into departmentes
                                         from vDepartment in departmentes.DefaultIfEmpty()

                                         where vUser.Id == userId && vUser.IsDeleted == false && vUser.IsActived == true
                                         select new CurrentUserDTO
                                         {
                                             UserId = vUser.Id.ToString(),
                                             UserName = vUser.Username,
                                             RoleId = vUser.RoleId.ToString(),
                                             RoleCode = vRole.Code,
                                             UserTitle = vUser.Name,
                                             RoleTitle = vRole.Title,
                                             DepartmentId = vDepartment.Id.ToString(),
                                             DepartmentName = vDepartment.Title

                                         }).AsNoTracking()
                                         .FirstOrDefaultAsync();

                return currentUser;

            }
        }
    }
}
