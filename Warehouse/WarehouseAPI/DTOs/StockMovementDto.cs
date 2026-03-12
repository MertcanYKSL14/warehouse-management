using WarehouseAPI.Entities;

namespace WarehouseAPI.DTOs
{
    public class CreateStockMovementDto
    {
        public string CompanyId { get; set; } = string.Empty;
        public MovementType Type { get; set; }
        public int Quantity { get; set; }
        public string? Note { get; set; }
        public int ProductId { get; set; }
        public int ShelfId { get; set; }
    }
}