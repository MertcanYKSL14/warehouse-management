namespace WarehouseAPI.DTOs
{
    public class CreateProductDto
    {
        public string CompanyId { get; set; } = string.Empty;
        public string Name { get; set; } = string.Empty;
        public string Code { get; set; } = string.Empty;
        public string Category { get; set; } = string.Empty;
        public string Unit { get; set; } = string.Empty;
        public string? Description { get; set; }
    }

    public class UpdateProductDto
    {
        public int Id { get; set; }
        public string CompanyId { get; set; } = string.Empty;
        public string Name { get; set; } = string.Empty;
        public string Code { get; set; } = string.Empty;
        public string Category { get; set; } = string.Empty;
        public string Unit { get; set; } = string.Empty;
        public string? Description { get; set; }
    }

    public class DeleteDto
    {
        public int Id { get; set; }
        public string CompanyId { get; set; } = string.Empty;
    }
}