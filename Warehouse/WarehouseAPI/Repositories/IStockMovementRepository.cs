using WarehouseAPI.Entities;

namespace WarehouseAPI.Repositories
{
    public interface IStockMovementRepository
    {
        Task<StockMovement?> GetByIdAsync(int id, string companyId);
        Task<(List<StockMovement> data, int totalCount)> GetPagedAsync(string companyId, int page, int pageSize, int? productId, MovementType? type);
        Task<StockMovement> CreateAsync(StockMovement movement);
        Task<int> GetCurrentStockAsync(int productId, string companyId);
    }
}