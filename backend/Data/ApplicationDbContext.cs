// Data/ApplicationDbContext.cs
using Microsoft.EntityFrameworkCore;
using SocialMediaManager.Models;

namespace SocialMediaManager.Data
{
    public class ApplicationDbContext : DbContext
    {
        public ApplicationDbContext(DbContextOptions<ApplicationDbContext> options) : base(options)
        {
        }

        public DbSet<User> Users { get; set; }

        protected override void OnModelCreating(ModelBuilder modelBuilder)
        {
            // Configure one-to-many relationship for parent-child accounts
            modelBuilder.Entity<User>()
                .HasMany(u => u.SubAccounts)
                .WithOne(u => u.ParentAccount)
                .HasForeignKey(u => u.ParentAccountId)
                .OnDelete(DeleteBehavior.Cascade);

            // Index for faster lookup by email
            modelBuilder.Entity<User>()
                .HasIndex(u => u.Email)
                .IsUnique();
        }
    }
}