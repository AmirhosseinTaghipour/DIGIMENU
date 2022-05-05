using BS.Application.Interfaces.Repositories;
using BS.Domain.Entities;
using BS.Infrastructure.Persistence.Contexts;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace BS.Infrastructure.Persistence.Repositories
{
    public class CategoryIconRepositoryAsync : GenericRepositoryAsync<CategoryIcon>, ICategoryIconRepositoryAsync
    {
        public CategoryIconRepositoryAsync(Storage context) : base(context) { }
    }
}
