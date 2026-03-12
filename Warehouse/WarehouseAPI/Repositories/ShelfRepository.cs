using Microsoft.EntityFrameworkCore;
using WarehouseAPI.Data;
using WarehouseAPI.Entities;

namespace WarehouseAPI.Repositories
{
    public class ShelfRepository : IShelfRepository
    {
        private readonly AppDbContext _context;
        public ShelfRepository(AppDbContext context) { _context = context; }

        public async Task<Shelf?> GetByIdAsync(int id, string companyId) =>
            await _context.Shelves.FirstOrDefaultAsync(x => x.Id == id && x.CompanyId == companyId);

        public async Task<(List<Shelf> data, int totalCount)> GetPagedAsync(string companyId, int page, int pageSize, string? search, int? warehouseId)
        {
            var query = _context.Shelves
                .Include(x => x.Warehouse)
                .Where(x => x.CompanyId == companyId);

            if (!string.IsNullOrEmpty(search))
                query = query.Where(x => x.Code.Contains(search));

            if (warehouseId.HasValue)
                query = query.Where(x => x.WarehouseId == warehouseId);

            var totalCount = await query.CountAsync();
            var data = await query
                .OrderByDescending(x => x.CreatedAt)
                .Skip((page - 1) * pageSize)
                .Take(pageSize)
                .ToListAsync();

            return (data, totalCount);
        }

        public async Task<List<Shelf>> GetByWarehouseAsync(int warehouseId, string companyId) =>
            await _context.Shelves.Where(x => x.WarehouseId == warehouseId && x.CompanyId == companyId).ToListAsync();

        public async Task<Shelf> CreateAsync(Shelf shelf)
        {
            _context.Shelves.Add(shelf);
            await _context.SaveChangesAsync();
            return shelf;
        }

        public async Task UpdateAsync(Shelf shelf)
        {
            _context.Entry(shelf).State = EntityState.Modified;
            await _context.SaveChangesAsync();
        }

        public async Task DeleteAsync(Shelf shelf)
        {
            shelf.IsDeleted = true;
            shelf.UpdatedAt = DateTime.UtcNow;
            _context.Entry(shelf).State = EntityState.Modified;
            await _context.SaveChangesAsync();
        }
    }
}