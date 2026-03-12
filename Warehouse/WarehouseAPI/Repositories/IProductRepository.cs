using WarehouseAPI.Entities;

namespace WarehouseAPI.Repositories
{
    public interface IProductRepository
    {
        Task<Product?> GetByIdAsync(int id, string companyId);
        Task<(List<Product> data, int totalCount)> GetPagedAsync(string companyId, int page, int pageSize, string? search, string? category);
        Task<List<Product>> GetAllAsync(string companyId);
        Task<Product> CreateAsync(Product product);
        Task UpdateAsync(Product product);
        Task DeleteAsync(Product product);
    }
}