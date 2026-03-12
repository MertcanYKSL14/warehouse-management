using Microsoft.AspNetCore.Mvc;
using WarehouseAPI.DTOs;
using WarehouseAPI.Managers;
using WarehouseAPI.Entities;

namespace WarehouseAPI.Controllers
{
    [ApiController]
    [Route("api/stockmovement")]
    public class StockMovementController : ControllerBase
    {
        private readonly StockMovementManager _manager;
        public StockMovementController(StockMovementManager manager) { _manager = manager; }

        [HttpGet("list")]
        public async Task<IActionResult> GetPaged(
            [FromQuery] string companyId,
            [FromQuery] int page = 1,
            [FromQuery] int pageSize = 25,
            [FromQuery] int? productId = null,
            [FromQuery] MovementType? type = null)
        {
            if (string.IsNullOrEmpty(companyId)) return BadRequest("CompanyId zorunludur.");
            var (data, totalCount) = await _manager.GetPagedAsync(companyId, page, pageSize, productId, type);
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

        [HttpGet("stock/{productId}")]
        public async Task<IActionResult> GetCurrentStock(int productId, [FromQuery] string companyId)
        {
            if (string.IsNullOrEmpty(companyId)) return BadRequest("CompanyId zorunludur.");
            var stock = await _manager.GetCurrentStockAsync(productId, companyId);
            return Ok(new { success = true, stock });
        }

        [HttpPost("create")]
        public async Task<IActionResult> Create([FromBody] CreateStockMovementDto dto)
        {
            if (string.IsNullOrEmpty(dto.CompanyId)) return BadRequest("CompanyId zorunludur.");
            var entity = await _manager.CreateAsync(dto);
            return Ok(new { success = true, data = entity });
        }
    }
}