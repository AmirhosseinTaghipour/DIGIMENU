using BS.Application.Interfaces.Repositories;
using BS.Infrastructure.Persistence.Contexts;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace BS.Infrastructure.Persistence.Repositories
{
    public class UnitOfWork : IUnitOfWork
    {
        private readonly Storage _context;
        public IUserRepositoryAsync userRepositoryAsync { get; }
        public IRoleRepositoryAsync roleRepositoryAsync { get; }
        public IRefCodeRepositoryAsync refCodeRepositoryAsync { get; }
        public IDepartmentRepositoryAsync departmentRepositoryAsync { get; }
        public IUserLogRepositoryAsync userLogRepositoryAsync { get; }
        public ISMSLogRepositoryAsync smsLogRepositoryAsync { get; }
        public IFileRepositoryAsync fileRepositoryAsync { get; }
        public IAppMenuRepositoryAsync appMenuRepositoryAsync { get; }
        public IPaymentRepositoryAsync paymentRepositoryAsync { get; }

        public UnitOfWork(Storage context)
        {
            _context = context;
            userRepositoryAsync = userRepositoryAsync ?? new UserRepositoryAsync(context);
            roleRepositoryAsync = roleRepositoryAsync ?? new RoleRepositoryAsync(context);
            refCodeRepositoryAsync = refCodeRepositoryAsync ?? new RefCodeRepositoryAsync(context);
            departmentRepositoryAsync = departmentRepositoryAsync ?? new DepartmentRepositoryAsync(context);
            userLogRepositoryAsync = userLogRepositoryAsync ?? new UserLogRepositoryAsync(context);
            smsLogRepositoryAsync = smsLogRepositoryAsync ?? new SMSLogRepositoryAsync(context);
            fileRepositoryAsync = fileRepositoryAsync ?? new FileRepositoryAsync(context);
            appMenuRepositoryAsync = appMenuRepositoryAsync ?? new AppMenuRepositoryAsync(context);
            paymentRepositoryAsync = paymentRepositoryAsync ?? new PaymentRepositoryAsync(context);
        }


        public async Task<int> SaveAsync()
        {
            return await _context.SaveChangesAsync();
        }

    }
}
