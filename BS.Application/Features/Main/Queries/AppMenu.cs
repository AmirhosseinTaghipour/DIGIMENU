using BS.Application.Common;
using BS.Application.Features.Main.DTOs;
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

namespace BS.Application.Features.Main.Queries
{
    public class AppMenu
    {
        public class AppMenuQuery : IRequest<List<AppMenuDTO>>
        {
        }

        public class AppMenuHandler : IRequestHandler<AppMenuQuery, List<AppMenuDTO>>
        {
            private readonly IUnitOfWork _unitOfWork;
            private readonly IUserAccessor _userAccessor;
            private readonly IDataHelper _dataHelper;

            public AppMenuHandler(IUnitOfWork unitOfWork, IUserAccessor userAccessor, IDataHelper dataHelper)
            {
                _unitOfWork = unitOfWork;
                _userAccessor = userAccessor;
                _dataHelper = dataHelper;
            }

            public async Task<List<AppMenuDTO>> Handle(AppMenuQuery request, CancellationToken cancellationToken)
            {
                var roleId = _userAccessor.GetCurrentRoleId();
                if (_dataHelper.isSQL_Injection(roleId.ToString()))
                    throw new RestException(HttpStatusCode.BadRequest);
                try
                {
                    var AppMenues = await _unitOfWork.appMenuRepositoryAsync.Query()
                                          .Where(a => a.IsActived == true && a.IsDeleted == false)
                                          .Include(a => a.Roles.Where(r => r.Id.Equals(roleId)))
                                          .OrderBy(a => a.MenuOrder)
                                          .Select(a => new AppMenuDTO { MenuId = a.Id.ToString(), MenuCode = a.MenuCode, MenuTitle = a.MenuTitle })
                                          .AsNoTracking()
                                          .ToListAsync();
                    return AppMenues;
                }
                catch (Exception ex)
                {
                    throw new RestException(HttpStatusCode.BadRequest, ex.Message);

                }
            }
        }
    }
}
