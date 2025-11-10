using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace SpenWise.API.Models;

public class Transaction
{
    public int Id { get; set; }
    
    [Required]
    public DateTime Date { get; set; }
    
    [Required]
    [Column(TypeName = "decimal(18,2)")]
    public decimal Amount { get; set; }

    [Required] [MaxLength(500)] public string Description { get; set; } = string.Empty;
    
    [Required]
    public TransactionType Type { get; set; }

    [Required] 
    public int CategoryId { get; set; }

    public Category Category { get; set; } = null!;
}