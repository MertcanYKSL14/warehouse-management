using WarehouseAPI.DTOs;
using WarehouseAPI.Entities;
using WarehouseAPI.Repositories;

namespace WarehouseAPI.Managers
{
    public class ShelfManager
    {
        private readonly IShelfRepository _repo;
        public ShelfManager(IShelfRepository repo) { _repo = repo; }

        public async Task<(List<Shelf> data, int totalCount)> GetPagedAsync(
            string companyId, int page, int pageSize, string? search, int? warehouseId)
        {
            if (string.IsNullOrEmpty(companyId)) throw new ArgumentException("CompanyId zorunludur.");
            return await _repo.GetPagedAsync(companyId, page, pageSize, search, warehouseId);
        }

        public async Task<Shelf?> GetByIdAsync(int id, string companyId)
        {
            if (string.IsNullOrEmpty(companyId)) throw new ArgumentException("CompanyId zorunludur.");
            return await _repo.GetByIdAsync(id, companyId);
        }

        public async Task<List<Shelf>> GetByWarehouseAsync(int warehouseId, string companyId)
        {
            if (string.IsNullOrEmpty(companyId)) throw new ArgumentException("CompanyId zorunludur.");
            return await _repo.GetByWarehouseAsync(warehouseId, companyId);
        }

        public async Task<Shelf> CreateAsync(CreateShelfDto dto)
        {
            if (string.IsNullOrEmpty(dto.CompanyId)) throw new ArgumentException("CompanyId zorunludur.");
            if (string.IsNullOrEmpty(dto.Code)) throw new ArgumentException("Raf kodu zorunludur.");

            var shelf = new Shelf
            {
                CompanyId = dto.CompanyId,
                Code = dto.Code,
                Capacity = dto.Capacity,
                WarehouseId = dto.WarehouseId,
                CreatedAt = DateTime.UtcNow
            };

            return await _repo.CreateAsync(shelf);
        }

        public async Task<Shelf> UpdateAsync(UpdateShelfDto dto)
        {
            if (string.IsNullOrEmpty(dto.CompanyId)) throw new ArgumentException("CompanyId zorunludur.");

            var existing = await _repo.GetByIdAsync(dto.Id, dto.CompanyId);
            if (existing == null) throw new KeyNotFoundException("Raf bulunamadı.");
            if (existing.CompanyId != dto.CompanyId) throw new UnauthorizedAccessException("Yetkisiz erişim.");

            existing.Code = dto.Code;
            existing.Capacity = dto.Capacity;
            existing.WarehouseId = dto.WarehouseId;
            existing.UpdatedAt = DateTime.UtcNow;

            await _repo.UpdateAsync(existing);
            return existing;
        }

        public async Task DeleteAsync(DeleteDto dto)
        {
            if (string.IsNullOrEmpty(dto.CompanyId)) throw new ArgumentException("CompanyId zorunludur.");

            var existing = await _repo.GetByIdAsync(dto.Id, dto.CompanyId);
            if (existing == null) throw new KeyNotFoundException("Raf bulunamadı.");
            if (existing.CompanyId != dto.CompanyId) throw new UnauthorizedAccessException("Yetkisiz erişim.");

            await _repo.DeleteAsync(existing);
        }
    }
}