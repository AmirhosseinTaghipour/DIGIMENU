using Microsoft.EntityFrameworkCore;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using BS.Domain.Entities;

namespace BS.Infrastructure.Persistence.Contexts
{
    public class Storage : DbContext
    {
        public Storage(DbContextOptions options) : base(options) { }

        public DbSet<User> Users { get; set; }
        public DbSet<Role> Roles { get; set; }
        public DbSet<Department> Departments { get; set; }
        public DbSet<RefCode> RefCodes { get; set; }
        public DbSet<UserLog> UserLogs { get; set; }
        public DbSet<Menu> Menus { get; set; }
        public DbSet<Category> Categories { get; set; }
        public DbSet<CategoryItem> CategoryItems { get; set; }
        public DbSet<SMSLog> SMSLogs { get; set; }
        public DbSet<File> Files { get; set; }
        public DbSet<AppMenu> AppMenus { get; set; }
        public DbSet<AppMenuRole> AppMenuRoles { get; set; }   
        public DbSet<Payment> Payments { get; set; }
        public DbSet<CategoryIcon> categoryIcons { get; set; }


        // On model creating function will provide us with the ability to manage the tables properties
        protected override void OnModelCreating(ModelBuilder modelBuilder)
        {
            base.OnModelCreating(modelBuilder);
        }
    }
}
