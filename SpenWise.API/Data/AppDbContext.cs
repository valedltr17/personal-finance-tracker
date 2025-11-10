using Microsoft.EntityFrameworkCore;
using SpenWise.API.Models;

namespace SpenWise.API.Data;

public class AppDbContext : DbContext
{
    public AppDbContext(DbContextOptions<AppDbContext> options) : base(options)
    {
        
    }
    
    public DbSet<Transaction> Transactions { get; set; }
    public DbSet<Category> Categories { get; set; }

    protected override void OnModelCreating(ModelBuilder modelBuilder)
    {
        base.OnModelCreating(modelBuilder);
            
        // Configure Transaction
        modelBuilder.Entity<Transaction>(entity =>
        {
            entity.HasKey(t => t.Id);
                
            entity.Property(t => t.Amount)
                .HasPrecision(18, 2);
                
            entity.HasOne(t => t.Category)
                .WithMany(c => c.Transactions)
                .HasForeignKey(t => t.CategoryId)
                .OnDelete(DeleteBehavior.Restrict);
                
            entity.HasIndex(t => t.Date);
        });
            
        // Configure Category
        modelBuilder.Entity<Category>(entity =>
        {
            entity.HasKey(c => c.Id);
                
            entity.HasIndex(c => c.Name)
                .IsUnique();
        });
    }
}