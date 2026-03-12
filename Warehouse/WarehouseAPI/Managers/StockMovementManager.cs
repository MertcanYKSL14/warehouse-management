using WarehouseAPI.DTOs;
using WarehouseAPI.Entities;
using WarehouseAPI.Repositories;

namespace WarehouseAPI.Managers
{
    public class StockMovementManager
    {
        private readonly IStockMovementRepository _repo;
        public StockMovementManager(IStockMovementRepository repo) { _repo = repo; }

        public async Task<(List<StockMovement> data, int totalCount)> GetPagedAsync(
            string companyId, int page, int pageSize, int? productId, MovementType? type)
        {
            if (string.IsNullOrEmpty(companyId)) throw new ArgumentException("CompanyId zorunludur.");
            return await _repo.GetPagedAsync(companyId, page, pageSize, productId, type);
        }

        public async Task<int> GetCurrentStockAsync(int productId, string companyId)
        {
            if (string.IsNullOrEmpty(companyId)) throw new ArgumentException("CompanyId zorunludur.");
            return await _repo.GetCurrentStockAsync(productId, companyId);
        }

        public async Task<StockMovement> CreateAsync(CreateStockMovementDto dto)
        {
            if (string.IsNullOrEmpty(dto.CompanyId)) throw new ArgumentException("CompanyId zorunludur.");
            if (dto.Quantity <= 0) throw new ArgumentException("Miktar 0'dan büyük olmalıdır.");

            // Çıkış işleminde stok kontrolü
            if (dto.Type == MovementType.Out)
            {
                var currentStock = await _repo.GetCurrentStockAsync(dto.ProductId, dto.CompanyId);
                if (currentStock < dto.Quantity)
                    throw new InvalidOperationException($"Yetersiz stok. Mevcut stok: {currentStock}");
            }

            var movement = new StockMovement
            {
                CompanyId = dto.CompanyId,
                Type = dto.Type,
                Quantity = dto.Quantity,
                Note = dto.Note,
                ProductId = dto.ProductId,
                ShelfId = dto.ShelfId,
                CreatedAt = DateTime.UtcNow
            };

            return await _repo.CreateAsync(movement);
        }
    }
}