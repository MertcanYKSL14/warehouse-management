using WarehouseAPI.DTOs;
using WarehouseAPI.Entities;
using WarehouseAPI.Repositories;

namespace WarehouseAPI.Managers
{
    public class ProductManager
    {
        private readonly IProductRepository _repo;
        public ProductManager(IProductRepository repo) { _repo = repo; }

        public async Task<(List<Product> data, int totalCount)> GetPagedAsync(
            string companyId, int page, int pageSize, string? search, string? category)
        {
            if (string.IsNullOrEmpty(companyId)) throw new ArgumentException("CompanyId zorunludur.");
            return await _repo.GetPagedAsync(companyId, page, pageSize, search, category);
        }

        public async Task<Product?> GetByIdAsync(int id, string companyId)
        {
            if (string.IsNullOrEmpty(companyId)) throw new ArgumentException("CompanyId zorunludur.");
            return await _repo.GetByIdAsync(id, companyId);
        }

        public async Task<List<Product>> GetAllAsync(string companyId)
        {
            if (string.IsNullOrEmpty(companyId)) throw new ArgumentException("CompanyId zorunludur.");
            return await _repo.GetAllAsync(companyId);
        }

        public async Task<Product> CreateAsync(CreateProductDto dto)
        {
            if (string.IsNullOrEmpty(dto.CompanyId)) throw new ArgumentException("CompanyId zorunludur.");
            if (string.IsNullOrEmpty(dto.Name)) throw new ArgumentException("Ürün adı zorunludur.");
            if (string.IsNullOrEmpty(dto.Code)) throw new ArgumentException("Ürün kodu zorunludur.");

            var product = new Product
            {
                CompanyId = dto.CompanyId,
                Name = dto.Name,
                Code = dto.Code,
                Category = dto.Category,
                Unit = dto.Unit,
                Description = dto.Description,
                CreatedAt = DateTime.UtcNow
            };

            return await _repo.CreateAsync(product);
        }

        public async Task<Product> UpdateAsync(UpdateProductDto dto)
        {
            if (string.IsNullOrEmpty(dto.CompanyId)) throw new ArgumentException("CompanyId zorunludur.");

            var existing = await _repo.GetByIdAsync(dto.Id, dto.CompanyId);
            if (existing == null) throw new KeyNotFoundException("Ürün bulunamadı.");
            if (existing.CompanyId != dto.CompanyId) throw new UnauthorizedAccessException("Yetkisiz erişim.");

            existing.Name = dto.Name;
            existing.Code = dto.Code;
            existing.Category = dto.Category;
            existing.Unit = dto.Unit;
            existing.Description = dto.Description;
            existing.UpdatedAt = DateTime.UtcNow;

            await _repo.UpdateAsync(existing);
            return existing;
        }

        public async Task DeleteAsync(DeleteDto dto)
        {
            if (string.IsNullOrEmpty(dto.CompanyId)) throw new ArgumentException("CompanyId zorunludur.");

            var existing = await _repo.GetByIdAsync(dto.Id, dto.CompanyId);
            if (existing == null) throw new KeyNotFoundException("Ürün bulunamadı.");
            if (existing.CompanyId != dto.CompanyId) throw new UnauthorizedAccessException("Yetkisiz erişim.");

            await _repo.DeleteAsync(existing);
        }
    }
}