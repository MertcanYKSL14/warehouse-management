using Microsoft.EntityFrameworkCore;
using WarehouseAPI.Data;
using WarehouseAPI.Entities;

namespace WarehouseAPI.Repositories
{
    public class ProductRepository : IProductRepository
    {
        private readonly AppDbContext _context;
        public ProductRepository(AppDbContext context) { _context = context; }

        public async Task<Product?> GetByIdAsync(int id, string companyId) =>
            await _context.Products.FirstOrDefaultAsync(x => x.Id == id && x.CompanyId == companyId);

        public async Task<(List<Product> data, int totalCount)> GetPagedAsync(string companyId, int page, int pageSize, string? search, string? category)
        {
            var query = _context.Products.Where(x => x.CompanyId == companyId);

            if (!string.IsNullOrEmpty(search))
                query = query.Where(x => x.Name.Contains(search) || x.Code.Contains(search));

            if (!string.IsNullOrEmpty(category))
                query = query.Where(x => x.Category == category);

            var totalCount = await query.CountAsync();
            var data = await query
                .OrderByDescending(x => x.CreatedAt)
                .Skip((page - 1) * pageSize)
                .Take(pageSize)
                .ToListAsync();

            return (data, totalCount);
        }

        public async Task<List<Product>> GetAllAsync(string companyId) =>
            await _context.Products.Where(x => x.CompanyId == companyId).ToListAsync();

        public async Task<Product> CreateAsync(Product product)
        {
            _context.Products.Add(product);
            await _context.SaveChangesAsync();
            return product;
        }

        public async Task UpdateAsync(Product product)
        {
            _context.Entry(product).State = EntityState.Modified;
            await _context.SaveChangesAsync();
        }

        public async Task DeleteAsync(Product product)
        {
            product.IsDeleted = true;
            product.UpdatedAt = DateTime.UtcNow;
            _context.Entry(product).State = EntityState.Modified;
            await _context.SaveChangesAsync();
        }
    }
}