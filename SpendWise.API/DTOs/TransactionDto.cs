using SpendWise.API.Models;

namespace SpendWise.API.DTOs;

public class TransactionDto
{
    public int Id { get; set; }
    public DateTime Date { get; set; }
    public decimal Amount { get; set; }
    public string Description { get; set; } = string.Empty;
    public TransactionType TypeId { get; set; }
    public string Type { get; set; } = string.Empty;
    public int CategoryId { get; set; }
    public string CategoryName { get; set; } = string.Empty;
}