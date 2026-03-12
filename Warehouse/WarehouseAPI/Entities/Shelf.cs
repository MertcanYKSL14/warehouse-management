namespace WarehouseAPI.Entities
{
    public class Shelf : BaseEntity
    {
        public string Code { get; set; } = string.Empty; // A1, B2 vs.
        public int Capacity { get; set; }

        // Foreign Key
        public int WarehouseId { get; set; }
        public Warehouse Warehouse { get; set; } = null!;

        // Navigation
        public ICollection<StockMovement> StockMovements { get; set; } = new List<StockMovement>();
    }
}