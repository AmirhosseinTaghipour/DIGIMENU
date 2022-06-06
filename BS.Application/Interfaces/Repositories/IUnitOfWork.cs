using BS.Application.Interfaces.Repositories;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace BS.Application.Interfaces.Repositories
{
    public interface IUnitOfWork
    {
        public IUserRepositoryAsync userRepositoryAsync { get; }
        public IRoleRepositoryAsync roleRepositoryAsync { get; }
        public IRefCodeRepositoryAsync refCodeRepositoryAsync { get; }
        public IDepartmentRepositoryAsync departmentRepositoryAsync { get; }
        public IUserLogRepositoryAsync userLogRepositoryAsync { get; }
        public ISMSLogRepositoryAsync smsLogRepositoryAsync { get; }
        public IFileRepositoryAsync fileRepositoryAsync { get; }
        public IAppMenuRepositoryAsync appMenuRepositoryAsync { get; }
        public IPaymentRepositoryAsync paymentRepositoryAsync { get; }
        public IMenuRepositoryAsync menuRepositoryAsync { get; }
        public ICategoryRepositoryAsync categoryRepositoryAsync { get; }
        public ICategoryIconRepositoryAsync categoryIconRepositoryAsync { get; }
        public ICategoryItemRepositoryAsync categoryItemRepositoryAsync { get; }        
        public IAppMenuRoleRepositoryAsync appMenuRoleRepositoryAsync { get; }
        



        Task<int> SaveAsync();
    }
}
