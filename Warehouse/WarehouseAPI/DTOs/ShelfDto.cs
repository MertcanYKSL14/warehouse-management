namespace WarehouseAPI.DTOs
{
    public class CreateShelfDto
    {
        public string CompanyId { get; set; } = string.Empty;
        public string Code { get; set; } = string.Empty;
        public int Capacity { get; set; }
        public int WarehouseId { get; set; }
    }

    public class UpdateShelfDto
    {
        public int Id { get; set; }
        public string CompanyId { get; set; } = string.Empty;
        public string Code { get; set; } = string.Empty;
        public int Capacity { get; set; }
        public int WarehouseId { get; set; }
    }
}