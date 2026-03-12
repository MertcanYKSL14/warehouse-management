using Microsoft.EntityFrameworkCore;
using WarehouseAPI.Data;
using WarehouseAPI.Entities;

namespace WarehouseAPI.Repositories
{
    public class StockMovementRepository : IStockMovementRepository
    {
        private readonly AppDbContext _context;
        public StockMovementRepository(AppDbContext context) { _context = context; }

        public async Task<StockMovement?> GetByIdAsync(int id, string companyId) =>
            await _context.StockMovements.FirstOrDefaultAsync(x => x.Id == id && x.CompanyId == companyId);

        public async Task<(List<StockMovement> data, int totalCount)> GetPagedAsync(string companyId, int page, int pageSize, int? productId, MovementType? type)
        {
            var query = _context.StockMovements
                .Include(x => x.Product)
                .Include(x => x.Shelf)
                .Where(x => x.CompanyId == companyId);

            if (productId.HasValue)
                query = query.Where(x => x.ProductId == productId);

            if (type.HasValue)
                query = query.Where(x => x.Type == type);

            var totalCount = await query.CountAsync();
            var data = await query
                .OrderByDescending(x => x.CreatedAt)
                .Skip((page - 1) * pageSize)
                .Take(pageSize)
                .ToListAsync();

            return (data, totalCount);
        }

        public async Task<StockMovement> CreateAsync(StockMovement movement)
        {
            _context.StockMovements.Add(movement);
            await _context.SaveChangesAsync();
            return movement;
        }

        public async Task<int> GetCurrentStockAsync(int productId, string companyId)
        {
            var movements = await _context.StockMovements
                .Where(x => x.ProductId == productId && x.CompanyId == companyId)
                .ToListAsync();

            var totalIn = movements.Where(x => x.Type == MovementType.In).Sum(x => x.Quantity);
            var totalOut = movements.Where(x => x.Type == MovementType.Out).Sum(x => x.Quantity);

            return totalIn - totalOut;
        }
    }
}