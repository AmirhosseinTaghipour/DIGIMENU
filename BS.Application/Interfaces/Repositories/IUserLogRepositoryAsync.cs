﻿using BS.Domain.Entities;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace BS.Application.Interfaces.Repositories
{
    public interface IUserLogRepositoryAsync : IGenericRepositoryAsync<UserLog>
    {
        Task<UserLog> LastSuccessfullLogin(Guid userId, string ip, DateTime from);
        Task<IEnumerable<UserLog>> LastUnsuccessfullLogin(Guid userId, string ip, DateTime from);
    }
}
