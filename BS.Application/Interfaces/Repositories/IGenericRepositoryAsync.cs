using System;
using System.Collections.Generic;
using System.Linq;
using System.Linq.Expressions;
using System.Text;
using System.Threading.Tasks;

namespace BS.Application.Interfaces.Repositories
{
    public interface IGenericRepositoryAsync<T> where T : class
    {
        Task<T> GetByIdAsync(Guid id);
        Task<T> GetFirstAsync(Expression<Func<T, bool>> whereCondition);
        Task<T> GetFirstAsync(Expression<Func<T, bool>> whereCondition, Func<IQueryable<T>, IOrderedQueryable<T>> orderBy);
        Task<TType> GetFirstAsync<TType>(Expression<Func<T, bool>> whereCondition, Func<IQueryable<T>, IOrderedQueryable<T>> orderBy, Expression<Func<T, TType>> selectField) where TType : class;
        Task<IEnumerable<T>> GetAsync(Expression<Func<T, bool>> whereCondition);
        Task<IEnumerable<T>> GetAsync(Expression<Func<T, bool>> whereCondition, Func<IQueryable<T>, IOrderedQueryable<T>> orderBy);
        Task<IEnumerable<TType>> GetAsync<TType>(Expression<Func<T, bool>> whereCondition, Func<IQueryable<T>, IOrderedQueryable<T>> orderBy, Expression<Func<T, TType>> selectField) where TType : class;
        Task<IEnumerable<T>> GetAllAsync();
        Task<IEnumerable<T>> GetPagedReponseAsync(int pageNumber, int pageSize);
        Task<IEnumerable<T>> GetPagedReponseAsync(int pageNumber, int pageSize, Func<IQueryable<T>, IOrderedQueryable<T>> orderBy);
        Task<IEnumerable<T>> GetPagedReponseAsync(int pageNumber, int pageSize, Func<IQueryable<T>, IOrderedQueryable<T>> orderBy, Expression<Func<T, bool>> whereCondition);
        Task<IEnumerable<TType>> GetPagedReponseAsync<TType>(int pageNumber, int pageSize, Func<IQueryable<T>, IOrderedQueryable<T>> orderBy, Expression<Func<T, bool>> whereCondition, Expression<Func<T, TType>> selectField) where TType : class;
        Task<T> AddAsync(T entity);
        T Update(T entity);
        bool Any(Expression<Func<T, bool>> whereCondition);
        void Delete(T entity);
        IQueryable<T> Query();

    }
}
