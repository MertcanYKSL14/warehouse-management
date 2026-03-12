using Microsoft.EntityFrameworkCore;
using WarehouseAPI.Entities;

namespace WarehouseAPI.Data
{
    public class AppDbContext : DbContext
    {
        public AppDbContext(DbContextOptions<AppDbContext> options) : base(options) { }

        public DbSet<Product> Products { get; set; }
        public DbSet<Warehouse> Warehouses { get; set; }
        public DbSet<Shelf> Shelves { get; set; }
        public DbSet<StockMovement> StockMovements { get; set; }

        protected override void OnModelCreating(ModelBuilder modelBuilder)
        {
            // Soft delete filter — IsDeleted=true olanlar otomatik gizlenir
            modelBuilder.Entity<Product>().HasQueryFilter(x => !x.IsDeleted);
            modelBuilder.Entity<Warehouse>().HasQueryFilter(x => !x.IsDeleted);
            modelBuilder.Entity<Shelf>().HasQueryFilter(x => !x.IsDeleted);
            modelBuilder.Entity<StockMovement>().HasQueryFilter(x => !x.IsDeleted);
        }
    }
}