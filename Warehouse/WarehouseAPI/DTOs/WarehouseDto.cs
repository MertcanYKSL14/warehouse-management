namespace WarehouseAPI.DTOs
{
    public class CreateWarehouseDto
    {
        public string CompanyId { get; set; } = string.Empty;
        public string Name { get; set; } = string.Empty;
        public string Location { get; set; } = string.Empty;
        public string? Description { get; set; }
    }

    public class UpdateWarehouseDto
    {
        public int Id { get; set; }
        public string CompanyId { get; set; } = string.Empty;
        public string Name { get; set; } = string.Empty;
        public string Location { get; set; } = string.Empty;
        public string? Description { get; set; }
    }
}