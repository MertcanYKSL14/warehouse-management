using System;

namespace WarehouseAPI.Entities
{
    public class Warehouse : BaseEntity
    {
        public string Name { get; set; } = string.Empty;
        public string Location { get; set; } = string.Empty;
        public string? Description { get; set; }

        // Navigation
        public ICollection<Shelf> Shelves { get; set; } = new List<Shelf>();
    }
}