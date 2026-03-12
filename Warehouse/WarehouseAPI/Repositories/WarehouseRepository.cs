using Microsoft.EntityFrameworkCore;
using WarehouseAPI.Data;
using WarehouseAPI.Entities;

namespace WarehouseAPI.Repositories
{
    public class WarehouseRepository : IWarehouseRepository
    {
        private readonly AppDbContext _context;
        public WarehouseRepository(AppDbContext context) { _context = context; }

        public async Task<Warehouse?> GetByIdAsync(int id, string companyId) =>
            await _context.Warehouses.FirstOrDefaultAsync(x => x.Id == id && x.CompanyId == companyId);

        public async Task<(List<Warehouse> data, int totalCount)> GetPagedAsync(string companyId, int page, int pageSize, string? search)
        {
            var query = _context.Warehouses.Where(x => x.CompanyId == companyId);

            if (!string.IsNullOrEmpty(search))
                query = query.Where(x => x.Name.Contains(search) || x.Location.Contains(search));

            var totalCount = await query.CountAsync();
            var data = await query
                .OrderByDescending(x => x.CreatedAt)
                .Skip((page - 1) * pageSize)
                .Take(pageSize)
                .ToListAsync();

            return (data, totalCount);
        }

        public async Task<List<Warehouse>> GetAllAsync(string companyId) =>
            await _context.Warehouses.Where(x => x.CompanyId == companyId).ToListAsync();

        public async Task<Warehouse> CreateAsync(Warehouse warehouse)
        {
            _context.Warehouses.Add(warehouse);
            await _context.SaveChangesAsync();
            return warehouse;
        }

        public async Task UpdateAsync(Warehouse warehouse)
        {
            _context.Entry(warehouse).State = EntityState.Modified;
            await _context.SaveChangesAsync();
        }

        public async Task DeleteAsync(Warehouse warehouse)
        {
            warehouse.IsDeleted = true;
            warehouse.UpdatedAt = DateTime.UtcNow;
            _context.Entry(warehouse).State = EntityState.Modified;
            await _context.SaveChangesAsync();
        }
    }
}