using System.ComponentModel.DataAnnotations;

namespace SpenWise.API.Models;

public class Category
{
    public int Id { get; set; }
    
    [Required]
    [MaxLength(100)]
    public string Name { get; set; }

    public ICollection<Transaction> Transactions { get; set; } = new List<Transaction>();
}