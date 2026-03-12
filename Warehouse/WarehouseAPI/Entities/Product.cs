namespace WarehouseAPI.Entities
{
    public class Product : BaseEntity
    {
        public string Name { get; set; } = string.Empty;
        public string Code { get; set; } = string.Empty;
        public string Category { get; set; } = string.Empty;
        public string Unit { get; set; } = string.Empty; // adet, kg, litre vs.
        public string? Description { get; set; }

        // Navigation
        public ICollection<StockMovement> StockMovements { get; set; } = new List<StockMovement>();
    }
}