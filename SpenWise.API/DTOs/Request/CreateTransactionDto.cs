using System.ComponentModel.DataAnnotations;
using SpenWise.API.Models;

namespace SpenWise.API.DTOs;

public class CreateTransactionDto
{
    [Required]
    public DateTime Date { get; set; }
    
    [Required]
    [Range(0.01, double.MaxValue, ErrorMessage = "Amount must be greater than 0")]
    public decimal Amount { get; set; }
    
    [Required]
    [MaxLength(500)]
    public string Description { get; set; } = string.Empty;
    
    [Required]
    public TransactionType Type { get; set; }
    
    [Required]
    public int CategoryId { get; set; }
}