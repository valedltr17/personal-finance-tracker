using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using SpendWise.API.Data;
using SpendWise.API.DTOs;
using SpendWise.API.Models;

namespace SpendWise.API.Controllers;

[ApiController]
[Route("api/[controller]")]
public class DashboardController : ControllerBase
{
    private readonly AppDbContext _context;
    private readonly ILogger<DashboardController> _logger;
    
    public DashboardController(AppDbContext context, ILogger<DashboardController> logger)
    {
        _context = context;
        _logger = logger;
    }
    
    // GET: api/dashboard/summary
        [HttpGet("summary")]
        public async Task<ActionResult<DashboardSummaryDto>> GetDashboardSummary(
            [FromQuery] DateTime? startDate,
            [FromQuery] DateTime? endDate)
        {
            try
            {
                // Note to self: default to current month if no dates provided
                var start = startDate ?? new DateTime(DateTime.Now.Year, DateTime.Now.Month, 1);
                var end = endDate ?? DateTime.Now.Date.AddDays(1).AddTicks(-1);

                // Get all transactions in the date range
                var transactions = await _context.Transactions
                    .Include(t => t.Category)
                    .Where(t => t.Date >= start && t.Date <= end)
                    .ToListAsync();

                // Calculate totals
                var totalIncome = transactions
                    .Where(t => t.Type == TransactionType.Income)
                    .Sum(t => t.Amount);

                var totalExpenses = transactions
                    .Where(t => t.Type == TransactionType.Expense)
                    .Sum(t => t.Amount);

                var netBalance = totalIncome - totalExpenses;

                // Group expenses by category
                var expensesByCategory = transactions
                    .Where(t => t.Type == TransactionType.Expense)
                    .GroupBy(t => new { t.Category.Name, t.Category.Color })
                    .Select(g => new ExpenseByCategoryDto
                    {
                        CategoryName = g.Key.Name,
                        CategoryColor = g.Key.Color,
                        Amount = g.Sum(t => t.Amount),
                        Percentage = totalExpenses > 0 ? (g.Sum(t => t.Amount) / totalExpenses) * 100 : 0
                    })
                    .OrderByDescending(e => e.Amount)
                    .ToList();

                // Get the last 10 more recent transactions
                var recentTransactions = transactions
                    .OrderByDescending(t => t.Date)
                    .Take(10)
                    .Select(t => new TransactionDto
                    {
                        Id = t.Id,
                        Date = t.Date,
                        Amount = t.Amount,
                        Description = t.Description,
                        Type = t.Type.ToString(),
                        CategoryId = t.CategoryId,
                        CategoryName = t.Category.Name,
                        CategoryColor = t.Category.Color
                    })
                    .ToList();

                var summary = new DashboardSummaryDto
                {
                    TotalIncome = totalIncome,
                    TotalExpenses = totalExpenses,
                    NetBalance = netBalance,
                    ExpensesByCategory = expensesByCategory,
                    RecentTransactions = recentTransactions
                };

                return Ok(summary);
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error retrieving dashboard summary");
                return StatusCode(500, "An error occurred while retrieving the dashboard summary");
            }
        }

        // GET: api/dashboard/monthly-trend
        [HttpGet("monthly-trend")]
        public async Task<ActionResult<IEnumerable<MonthlyTrendDto>>> GetMonthlyTrend([FromQuery] int months = 6)
        {
            try
            {
                var startDate = DateTime.Now.AddMonths(-months).Date;

                var transactions = await _context.Transactions
                    .Where(t => t.Date >= startDate)
                    .ToListAsync();

                var monthlyData = transactions
                    .GroupBy(t => new { t.Date.Year, t.Date.Month })
                    .Select(g => new MonthlyTrendDto()
                    {
                        Year = g.Key.Year,
                        Month = g.Key.Month,
                        MonthName = new DateTime(g.Key.Year, g.Key.Month, 1).ToString("MMM yyyy"),
                        Income = g.Where(t => t.Type == TransactionType.Income).Sum(t => t.Amount),
                        Expenses = g.Where(t => t.Type == TransactionType.Expense).Sum(t => t.Amount),
                        NetBalance = g.Where(t => t.Type == TransactionType.Income).Sum(t => t.Amount) -
                                   g.Where(t => t.Type == TransactionType.Expense).Sum(t => t.Amount)
                    })
                    .OrderBy(m => m.Year)
                    .ThenBy(m => m.Month)
                    .ToList();

                return Ok(monthlyData);
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error retrieving monthly trend");
                return StatusCode(500, "An error occurred while retrieving the monthly trend");
            }
        }

        // GET: api/dashboard/category-breakdown
        [HttpGet("category-breakdown")]
        public async Task<ActionResult<CategorySummaryDto>> GetCategoryBreakdown(
            [FromQuery] TransactionType? type,
            [FromQuery] DateTime? startDate,
            [FromQuery] DateTime? endDate)
        {
            try
            {
                var start = startDate ?? DateTime.Now.AddMonths(-1);
                var end = endDate ?? DateTime.Now;

                var query = _context.Transactions
                    .Include(t => t.Category)
                    .Where(t => t.Date >= start && t.Date <= end);

                if (type.HasValue)
                {
                    query = query.Where(t => t.Type == type.Value);
                }

                var categoryBreakdown = await query
                    .GroupBy(t => new { t.Category.Name, t.Type, t.Category.Color })
                    .Select(g => new CategorySummaryDto()
                    {
                        CategoryName = g.Key.Name,
                        CategoryColor = g.Key.Color,
                        TransactionTypeId = g.Key.Type,
                        TransactionType = g.Key.Type.ToString(),
                        TotalAmount = g.Sum(t => t.Amount),
                        TransactionCount = g.Count(),
                        AverageAmount = g.Average(t => t.Amount)
                    })
                    .OrderByDescending(c => c.TotalAmount)
                    .ToListAsync();

                return Ok(categoryBreakdown);
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error retrieving category breakdown");
                return StatusCode(500, "An error occurred while retrieving the category breakdown");
            }
        }
}