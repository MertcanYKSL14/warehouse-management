using WarehouseAPI.Entities;

namespace WarehouseAPI.Repositories
{
    public interface IWarehouseRepository
    {
        Task<Warehouse?> GetByIdAsync(int id, string companyId);
        Task<(List<Warehouse> data, int totalCount)> GetPagedAsync(string companyId, int page, int pageSize, string? search);
        Task<List<Warehouse>> GetAllAsync(string companyId);
        Task<Warehouse> CreateAsync(Warehouse warehouse);
        Task UpdateAsync(Warehouse warehouse);
        Task DeleteAsync(Warehouse warehouse);
    }
}