using Microsoft.AspNetCore.Mvc;
using WarehouseAPI.DTOs;
using WarehouseAPI.Managers;

namespace WarehouseAPI.Controllers
{
    [ApiController]
    [Route("api/shelf")]
    public class ShelfController : ControllerBase
    {
        private readonly ShelfManager _manager;
        public ShelfController(ShelfManager manager) { _manager = manager; }

        [HttpGet("list")]
        public async Task<IActionResult> GetPaged(
            [FromQuery] string companyId,
            [FromQuery] int page = 1,
            [FromQuery] int pageSize = 25,
            [FromQuery] string? search = null,
            [FromQuery] int? warehouseId = null)
        {
            if (string.IsNullOrEmpty(companyId)) return BadRequest("CompanyId zorunludur.");
            var (data, totalCount) = await _manager.GetPagedAsync(companyId, page, pageSize, search, warehouseId);
            return Ok(new
            {
                success = true,
                data,
                totalCount,
                page,
                pageSize,
                totalPages = (int)Math.Ceiling((double)totalCount / pageSize)
            });
        }

        [HttpGet("{id}")]
        public async Task<IActionResult> GetById(int id, [FromQuery] string companyId)
        {
            if (string.IsNullOrEmpty(companyId)) return BadRequest("CompanyId zorunludur.");
            var entity = await _manager.GetByIdAsync(id, companyId);
            if (entity == null) return NotFound();
            if (entity.CompanyId != companyId) return Forbid();
            return Ok(new { success = true, data = entity });
        }

        [HttpGet("by-warehouse/{warehouseId}")]
        public async Task<IActionResult> GetByWarehouse(int warehouseId, [FromQuery] string companyId)
        {
            if (string.IsNullOrEmpty(companyId)) return BadRequest("CompanyId zorunludur.");
            var data = await _manager.GetByWarehouseAsync(warehouseId, companyId);
            return Ok(new { success = true, data });
        }

        [HttpPost("create")]
        public async Task<IActionResult> Create([FromBody] CreateShelfDto dto)
        {
            if (string.IsNullOrEmpty(dto.CompanyId)) return BadRequest("CompanyId zorunludur.");
            var entity = await _manager.CreateAsync(dto);
            return Ok(new { success = true, data = entity });
        }

        [HttpPost("update")]
        public async Task<IActionResult> Update([FromBody] UpdateShelfDto dto)
        {
            if (string.IsNullOrEmpty(dto.CompanyId)) return BadRequest("CompanyId zorunludur.");
            var entity = await _manager.UpdateAsync(dto);
            return Ok(new { success = true, data = entity });
        }

        [HttpPost("delete")]
        public async Task<IActionResult> Delete([FromBody] DeleteDto dto)
        {
            if (string.IsNullOrEmpty(dto.CompanyId)) return BadRequest("CompanyId zorunludur.");
            await _manager.DeleteAsync(dto);
            return Ok(new { success = true });
        }
    }
}