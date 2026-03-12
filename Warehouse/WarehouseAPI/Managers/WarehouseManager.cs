using WarehouseAPI.DTOs;
using WarehouseAPI.Entities;
using WarehouseAPI.Repositories;

namespace WarehouseAPI.Managers
{
    public class WarehouseManager
    {
        private readonly IWarehouseRepository _repo;
        public WarehouseManager(IWarehouseRepository repo) { _repo = repo; }

        public async Task<(List<Warehouse> data, int totalCount)> GetPagedAsync(
            string companyId, int page, int pageSize, string? search)
        {
            if (string.IsNullOrEmpty(companyId)) throw new ArgumentException("CompanyId zorunludur.");
            return await _repo.GetPagedAsync(companyId, page, pageSize, search);
        }

        public async Task<Warehouse?> GetByIdAsync(int id, string companyId)
        {
            if (string.IsNullOrEmpty(companyId)) throw new ArgumentException("CompanyId zorunludur.");
            return await _repo.GetByIdAsync(id, companyId);
        }

        public async Task<List<Warehouse>> GetAllAsync(string companyId)
        {
            if (string.IsNullOrEmpty(companyId)) throw new ArgumentException("CompanyId zorunludur.");
            return await _repo.GetAllAsync(companyId);
        }

        public async Task<Warehouse> CreateAsync(CreateWarehouseDto dto)
        {
            if (string.IsNullOrEmpty(dto.CompanyId)) throw new ArgumentException("CompanyId zorunludur.");
            if (string.IsNullOrEmpty(dto.Name)) throw new ArgumentException("Depo adı zorunludur.");

            var warehouse = new Warehouse
            {
                CompanyId = dto.CompanyId,
                Name = dto.Name,
                Location = dto.Location,
                Description = dto.Description,
                CreatedAt = DateTime.UtcNow
            };

            return await _repo.CreateAsync(warehouse);
        }

        public async Task<Warehouse> UpdateAsync(UpdateWarehouseDto dto)
        {
            if (string.IsNullOrEmpty(dto.CompanyId)) throw new ArgumentException("CompanyId zorunludur.");

            var existing = await _repo.GetByIdAsync(dto.Id, dto.CompanyId);
            if (existing == null) throw new KeyNotFoundException("Depo bulunamadı.");
            if (existing.CompanyId != dto.CompanyId) throw new UnauthorizedAccessException("Yetkisiz erişim.");

            existing.Name = dto.Name;
            existing.Location = dto.Location;
            existing.Description = dto.Description;
            existing.UpdatedAt = DateTime.UtcNow;

            await _repo.UpdateAsync(existing);
            return existing;
        }

        public async Task DeleteAsync(DeleteDto dto)
        {
            if (string.IsNullOrEmpty(dto.CompanyId)) throw new ArgumentException("CompanyId zorunludur.");

            var existing = await _repo.GetByIdAsync(dto.Id, dto.CompanyId);
            if (existing == null) throw new KeyNotFoundException("Depo bulunamadı.");
            if (existing.CompanyId != dto.CompanyId) throw new UnauthorizedAccessException("Yetkisiz erişim.");

            await _repo.DeleteAsync(existing);
        }
    }
}