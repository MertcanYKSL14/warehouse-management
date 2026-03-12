using Microsoft.AspNetCore.Mvc;
using WarehouseAPI.DTOs;
using WarehouseAPI.Managers;

namespace WarehouseAPI.Controllers
{
    [ApiController]
    [Route("api/product")]
    public class ProductController : ControllerBase
    {
        private readonly ProductManager _manager;
        public ProductController(ProductManager manager) { _manager = manager; }

        [HttpGet("list")]
        public async Task<IActionResult> GetPaged(
            [FromQuery] string companyId,
            [FromQuery] int page = 1,
            [FromQuery] int pageSize = 25,
            [FromQuery] string? search = null,
            [FromQuery] string? category = null)
        {
            if (string.IsNullOrEmpty(companyId)) return BadRequest("CompanyId zorunludur.");
            var (data, totalCount) = await _manager.GetPagedAsync(companyId, page, pageSize, search, category);
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

        [HttpGet("all")]
        public async Task<IActionResult> GetAll([FromQuery] string companyId)
        {
            if (string.IsNullOrEmpty(companyId)) return BadRequest("CompanyId zorunludur.");
            var data = await _manager.GetAllAsync(companyId);
            return Ok(new { success = true, data });
        }

        [HttpPost("create")]
        public async Task<IActionResult> Create([FromBody] CreateProductDto dto)
        {
            if (string.IsNullOrEmpty(dto.CompanyId)) return BadRequest("CompanyId zorunludur.");
            var entity = await _manager.CreateAsync(dto);
            return Ok(new { success = true, data = entity });
        }

        [HttpPost("update")]
        public async Task<IActionResult> Update([FromBody] UpdateProductDto dto)
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