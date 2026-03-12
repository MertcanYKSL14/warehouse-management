using WarehouseAPI.Entities;

namespace WarehouseAPI.Repositories
{
    public interface IShelfRepository
    {
        Task<Shelf?> GetByIdAsync(int id, string companyId);
        Task<(List<Shelf> data, int totalCount)> GetPagedAsync(string companyId, int page, int pageSize, string? search, int? warehouseId);
        Task<List<Shelf>> GetByWarehouseAsync(int warehouseId, string companyId);
        Task<Shelf> CreateAsync(Shelf shelf);
        Task UpdateAsync(Shelf shelf);
        Task DeleteAsync(Shelf shelf);
    }
}