using Microsoft.EntityFrameworkCore;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using BS.Application.Interfaces.Repositories;
using BS.Infrastructure.Persistence.Contexts;
using System.Linq.Expressions;

namespace BS.Infrastructure.Persistence.Repositories
{
    public class GenericRepositoryAsync<T> : IGenericRepositoryAsync<T> where T : class
    {
        private readonly Storage _context;
        private readonly DbSet<T> _dbSet;
        public GenericRepositoryAsync(Storage context)
        {
            _context = context;
            _dbSet = context.Set<T>();
        }
        public virtual async Task<T> AddAsync(T entity)
        {
            await _dbSet.AddAsync(entity);
            return entity;
        }

        public bool Any(Expression<Func<T, bool>> whereCondition)
        {
            return _dbSet.Any(whereCondition);
        }

        public virtual void Delete(T entity)
        {
            _dbSet.Remove(entity);
        }

        public virtual async Task<IEnumerable<T>> GetAllAsync()
        {
            return await _dbSet
                .AsNoTracking()
                .ToListAsync();
        }

        public virtual async Task<IEnumerable<T>> GetAsync(Expression<Func<T, bool>> whereCondition)
        {
            IQueryable<T> query = _dbSet;
            if (whereCondition != null)
                query = query.Where(whereCondition);
            return await query
                .AsNoTracking()
                .ToListAsync();
        }
        public virtual async Task<IEnumerable<T>> GetAsync(Expression<Func<T, bool>> whereCondition, Func<IQueryable<T>, IOrderedQueryable<T>> orderBy)
        {
            IQueryable<T> query = _dbSet;
            if (whereCondition != null)
                query.Where(whereCondition);
            if (orderBy != null)
                query = orderBy(query);
            return await query
                .AsNoTracking()
                .ToListAsync();
        }

        public virtual async Task<IEnumerable<TType>> GetAsync<TType>(Expression<Func<T, bool>> whereCondition, Func<IQueryable<T>, IOrderedQueryable<T>> orderBy, Expression<Func<T, TType>> selectField) where TType : class
        {
            IQueryable<T> query = _dbSet;
            if (whereCondition != null)
                query.Where(whereCondition);
            if (orderBy != null)
                query=orderBy(query);

            return await query.Select(selectField)
                .AsNoTracking()
                .ToListAsync();
        }

        public virtual async Task<T> GetByIdAsync(Guid id)
        {
            return await _dbSet.FindAsync(id);
        }

        public async Task<T> GetFirstAsync(Expression<Func<T, bool>> whereCondition)
        {
            IQueryable<T> query = _dbSet;
            if (whereCondition != null)
                query = query.Where(whereCondition);
            return await query.FirstOrDefaultAsync();
        }

        public async Task<T> GetFirstAsync(Expression<Func<T, bool>> whereCondition, Func<IQueryable<T>, IOrderedQueryable<T>> orderBy)
        {
            IQueryable<T> query = _dbSet;
            if (whereCondition != null)
                query.Where(whereCondition);
            if (orderBy != null)
                query=orderBy(query);
            return await query
                .FirstOrDefaultAsync();
        }

        public async Task<TType> GetFirstAsync<TType>(Expression<Func<T, bool>> whereCondition, Func<IQueryable<T>, IOrderedQueryable<T>> orderBy, Expression<Func<T, TType>> selectField) where TType : class
        {
            IQueryable<T> query = _dbSet;
            if (whereCondition != null)
                query.Where(whereCondition);
            if (orderBy != null)
                query=orderBy(query);
            return await query
                .Select(selectField)
                .FirstOrDefaultAsync();
        }

        public virtual async Task<IEnumerable<T>> GetPagedReponseAsync(int pageNumber, int pageSize)
        {
            return await _dbSet.Skip((pageNumber - 1) * pageSize)
                .Take(pageSize)
                .AsNoTracking()
                .ToListAsync();
        }

        public async Task<IEnumerable<T>> GetPagedReponseAsync(int pageNumber, int pageSize, Func<IQueryable<T>, IOrderedQueryable<T>> orderBy)
        {
            IQueryable<T> query = _dbSet;
            if (orderBy != null)
                query=orderBy(query);

            return await query.Skip((pageNumber - 1) * pageSize)
               .Take(pageSize)
               .AsNoTracking()
               .ToListAsync();
        }

        public async Task<IEnumerable<T>> GetPagedReponseAsync(int pageNumber, int pageSize, Func<IQueryable<T>, IOrderedQueryable<T>> orderBy, Expression<Func<T, bool>> whereCondition)
        {
            IQueryable<T> query = _dbSet;
            if (whereCondition != null)
                query.Where(whereCondition);
            if (orderBy != null)
                query=orderBy(query);

            return await query.Skip((pageNumber - 1) * pageSize)
               .Take(pageSize)
               .AsNoTracking()
               .ToListAsync();
        }

        public async Task<IEnumerable<TType>> GetPagedReponseAsync<TType>(int pageNumber, int pageSize, Func<IQueryable<T>, IOrderedQueryable<T>> orderBy, Expression<Func<T, bool>> whereCondition, Expression<Func<T, TType>> selectField) where TType : class
        {
            IQueryable<T> query = _dbSet;
            if (whereCondition != null)
                query.Where(whereCondition);
            if (orderBy != null)
                query=orderBy(query);

            return await query.Skip((pageNumber - 1) * pageSize)
               .Take(pageSize)
               .Select(selectField)
               .AsNoTracking()
               .ToListAsync();
        }

        public IQueryable<T> Query()
        {
            return _dbSet;
        }

        public virtual T Update(T entity)
        {
            _dbSet.Update(entity);
            return entity;
        }
    }
}
