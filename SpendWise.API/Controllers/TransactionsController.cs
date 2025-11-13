using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using SpendWise.API.Data;
using SpendWise.API.DTOs;
using SpendWise.API.Models;

namespace SpendWise.API.Controllers;

[ApiController]
[Route("api/[controller]")]
public class TransactionsController : ControllerBase
{
    private readonly AppDbContext _context;
    private readonly ILogger<TransactionsController> _logger;
    
    public TransactionsController(AppDbContext context, ILogger<TransactionsController> logger)
    {
        _context = context;
        _logger = logger;
    }
    
    // GET: api/transactions
    [HttpGet]
    public async Task<ActionResult<IEnumerable<TransactionDto>>> GetTransactions([FromQuery] DateTime? startDate,
        DateTime? endDate, int? categoryId, TransactionType? type)
    {
        try
        {
            var query = _context.Transactions
                .Include(t => t.Category)
                .AsQueryable();

            if (startDate.HasValue)
            {
                query = query.Where(t => t.Date >= startDate.Value);
            }

            if (endDate.HasValue)
            {
                query = query.Where(t => t.Date <= endDate.Value);
            }

            if (categoryId.HasValue)
            {
                query = query.Where(t => t.CategoryId == categoryId.Value);
            }

            if (type.HasValue)
            {
                query = query.Where(t => t.Type == type.Value);
            }

            var transactions = await query.OrderByDescending(t => t.Date)
                .Select(t => new TransactionDto()
                {
                    Id = t.Id,
                    Date = t.Date,
                    Amount = t.Amount,
                    Description = t.Description,
                    TypeId = t.Type,
                    Type = t.Type.ToString(),
                    CategoryId = t.CategoryId,
                    CategoryName = t.Category.Name,
                })
                .ToListAsync();
        
            return Ok(transactions);
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error retrieving transactions");
            return StatusCode(500, "An error ocurred while retrieving the transactions");
        }
    }
    
    // GET: api/transactions/5
    [HttpGet("{id}")]
    public async Task<ActionResult<TransactionDto>> GetTransaction(int id)
    {
        try
        {
            var transaction = await _context.Transactions
                .Include(t => t.Category)
                .Where(t => t.Id == id)
                .Select(t => new TransactionDto()
                {
                    Id = t.Id,
                    Date = t.Date,
                    Amount = t.Amount,
                    Description = t.Description,
                    TypeId = t.Type,
                    Type = t.Type.ToString(),
                    CategoryId = t.CategoryId,
                    CategoryName = t.Category.Name,
                })
                .FirstOrDefaultAsync();

            if (transaction == null)
            {
                return NotFound("Transaction not found");
            }

            return Ok(transaction);
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error retrieving the transaction");
            return StatusCode(500, "An error ocurred while retrieving the transaction");
        }
    }
    
    // POST: api/transactions
    [HttpPost]
    public async Task<ActionResult<TransactionDto>> CreateTransaction(CreateTransactionDto request)
    {
        try
        {
            var categoryExists = await _context.Categories.AnyAsync(c => c.Id == request.CategoryId);
            if (!categoryExists)
            {
                return BadRequest("Category does not exist");
            }

            var transaction = new Transaction
            {
                Date = request.Date,
                Amount = request.Amount,
                Description = request.Description,
                Type = request.Type,
                CategoryId = request.CategoryId
            };

            _context.Transactions.Add(transaction);
            await _context.SaveChangesAsync();

            // Note to self: this reloads with category for response
            await _context.Entry(transaction)
                .Reference(t => t.Category)
                .LoadAsync();

            var result = new TransactionDto
            {
                Id = transaction.Id,
                Date = transaction.Date,
                Amount = transaction.Amount,
                Description = transaction.Description,
                TypeId = transaction.Type,
                Type = transaction.Type.ToString(),
                CategoryId = transaction.CategoryId,
                CategoryName = transaction.Category.Name
            };

            return CreatedAtAction(nameof(GetTransaction), new { id = transaction.Id }, result);
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error creating transaction");
            return StatusCode(500, "An error occurred while creating the transaction");
        }
    }

    // PUT: api/transactions
    [HttpPut]
    public async Task<IActionResult> UpdateTransaction([FromBody] UpdateTransactionDto request)
    {
        try
        {
            var transaction = await _context.Transactions.FindAsync(request.Id);
            if (transaction == null)
            {
                return NotFound("Transaction not found");
            }

            var categoryExists = await _context.Categories.AnyAsync(c => c.Id == request.CategoryId);
            if (!categoryExists)
            {
                return BadRequest("Category does not exist");
            }

            transaction.Date = request.Date;
            transaction.Amount = request.Amount;
            transaction.Description = request.Description;
            transaction.Type = request.Type;
            transaction.CategoryId = request.CategoryId;

            await _context.SaveChangesAsync();

            return Ok();
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error updating transaction");
            return StatusCode(500, "An error occurred while updating the transaction");
        }
    }

    // DELETE: api/transactions/5
    [HttpDelete("{id}")]
    public async Task<IActionResult> DeleteTransaction(int id)
    {
        try
        {
            var transaction = await _context.Transactions.FindAsync(id);
            if (transaction == null)
            {
                return NotFound("Transaction not found");
            }

            _context.Transactions.Remove(transaction);
            await _context.SaveChangesAsync();

            return Ok();
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error deleting transaction");
            return StatusCode(500, "An error occurred while deleting the transaction");
        }
    }

    // GET: api/transactions/summary
    [HttpGet("summary")]
    public async Task<ActionResult<TransactionSummaryDto>> GetSummary(
        [FromQuery] DateTime? startDate,
        [FromQuery] DateTime? endDate)
    {
        try
        {
            var query = _context.Transactions.AsQueryable();

            if (startDate.HasValue)
            {
                query = query.Where(t => t.Date >= startDate.Value);
            }

            if (endDate.HasValue)
            {
                query = query.Where(t => t.Date <= endDate.Value);
            }

            var totalIncome = await query
                .Where(t => t.Type == TransactionType.Income)
                .SumAsync(t => t.Amount);

            var totalExpenses = await query
                .Where(t => t.Type == TransactionType.Expense)
                .SumAsync(t => t.Amount);

            var summary = new TransactionSummaryDto()
            {
                TotalIncome = totalIncome,
                TotalExpenses = totalExpenses,
                NetBalance = totalIncome - totalExpenses,
                TransactionCount = await query.CountAsync()
            };

            return Ok(summary);
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error calculating summary");
            return StatusCode(500, "An error occurred while calculating the summary");
        }
    }
}