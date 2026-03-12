namespace WarehouseAPI.Entities
{
    public enum MovementType
    {
        In = 1,  // Giriş
        Out = 2  // Çıkış
    }

    public class StockMovement : BaseEntity
    {
        public MovementType Type { get; set; }
        public int Quantity { get; set; }
        public string? Note { get; set; }

        // Foreign Keys
        public int ProductId { get; set; }
        public Product Product { get; set; } = null!;

        public int ShelfId { get; set; }
        public Shelf Shelf { get; set; } = null!;
    }
}