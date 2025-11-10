namespace SpenWise.API.DTOs;

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
    public decimal Amount { get; set; }
    public decimal Percentage { get; set; }
}