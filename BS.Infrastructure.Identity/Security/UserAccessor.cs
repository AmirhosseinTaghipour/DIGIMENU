using BS.Application.Common;
using BS.Application.Interfaces;
using BS.Application.Interfaces.Repositories;
using BS.Domain.Entities;
using Microsoft.AspNetCore.Http;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Net;
using System.Text;
using System.Threading.Tasks;

namespace BS.Infrastructure.Identity.Security
{
    public class UserAccessor : IUserAccessor
    {
        private readonly IHttpContextAccessor _httpContextAccessor;
        private readonly IUserRepositoryAsync _userRepositoryAsync;
        private readonly IDepartmentRepositoryAsync _departmentRepositoryAsync;
        private readonly IDataHelper _dataHelper;
        public UserAccessor(IHttpContextAccessor httpContextAccessor, IUserRepositoryAsync userRepositoryAsync, IDataHelper dataHelper, IDepartmentRepositoryAsync departmentRepositoryAsync)
        {
            _httpContextAccessor = httpContextAccessor;
            _userRepositoryAsync = userRepositoryAsync;
            _dataHelper = dataHelper;
            _departmentRepositoryAsync = departmentRepositoryAsync;
        }
        public Guid GetCurrentUserId()
        {
            var result = _httpContextAccessor.HttpContext.User?.Claims?.FirstOrDefault(x => x.Type == "Id")?.Value;
            return new Guid(result);
        }

        public string GetCurrentUserName()
        {
            var result = _httpContextAccessor.HttpContext.User?.Claims?.FirstOrDefault(x => x.Type == "UserName")?.Value;
            return result;
        }

        public Guid GetCurrentRoleId()
        {
            var result = _httpContextAccessor.HttpContext.User?.Claims?.FirstOrDefault(x => x.Type == "RoleId")?.Value;
            return new Guid(result);
        }

        public async Task<User> GetUserData()
        {
            var id = GetCurrentUserId();
            if (_dataHelper.isSQL_Injection(id.ToString()))
            {
                throw new RestException(HttpStatusCode.BadRequest);
            }
            try
            {
                User user = await _userRepositoryAsync.GetByIdAsync(id);
                if (user == null)
                    throw new RestException(HttpStatusCode.NotFound);

                return user;
            }
            catch
            {
                throw new RestException(HttpStatusCode.BadRequest);
            }
        }

    }
}
