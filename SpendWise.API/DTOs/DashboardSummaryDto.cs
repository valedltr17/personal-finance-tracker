using SpendWise.API.Models;

namespace SpendWise.API.DTOs;

public class DashboardSummaryDto
{
    public decimal TotalIncome { get; set; }
    public decimal TotalExpenses { get; set; }
    public decimal NetBalance  { get; set; }
    public List<ExpenseByCategoryDto> ExpensesByCategory { get; set; } = new();
    public List<TransactionDto> RecentTransactions { get; set; } = new();
}

public class ExpenseByCategoryDto
{
    public string CategoryName { get; set; } = string.Empty;
    public string CategoryColor { get; set; } = string.Empty;
    public decimal Amount { get; set; }
    public decimal Percentage { get; set; }
}

public class MonthlyTrendDto
{
    public int Year { get; set; }
    public int Month { get; set; }
    public string MonthName { get; set; }
    public decimal Income { get; set; }
    public decimal Expenses { get; set; }
    public decimal NetBalance { get; set; }
}

public class CategorySummaryDto
{
    public string CategoryName { get; set; } = string.Empty;
    public string CategoryColor { get; set; } = string.Empty;
    public TransactionType TransactionTypeId { get; set; }
    public string TransactionType { get; set; }
    public decimal TotalAmount { get; set; }
    public int TransactionCount { get; set; }
    public decimal AverageAmount { get; set; }
}