using System.ComponentModel.DataAnnotations;

namespace SpendWise.API.Models;

public class Category
{
    public int Id { get; set; }
    
    [Required]
    [MaxLength(100)]
    public string Name { get; set; }
    
    [Required]
    [MaxLength(7)]
    public string Color { get; set; }

    public ICollection<Transaction> Transactions { get; set; } = new List<Transaction>();
}