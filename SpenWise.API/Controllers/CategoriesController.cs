using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using SpenWise.API.Data;
using SpenWise.API.DTOs;
using SpenWise.API.DTOs.Request;
using SpenWise.API.Models;

namespace SpenWise.API.Controllers;

[ApiController]
[Route("/api/[controller]")]
public class CategoriesController : ControllerBase
{
    private readonly AppDbContext _context;
    private readonly ILogger<CategoriesController> _logger;
    
    public CategoriesController(AppDbContext context, ILogger<CategoriesController> logger)
    {
        _context = context;
        _logger = logger;
    }
    
    // GET: api/categories
    [HttpGet]
    public async Task<ActionResult<IEnumerable<CategoryDto>>> GetCategories()
    {
        try
        {
            var categories = await _context.Categories
                .OrderBy(c => c.Name)
                .Select(c => new CategoryDto()
                {
                    Id = c.Id,
                    Name = c.Name
                })
                .ToListAsync();

            return Ok(categories);
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error retreiving categories");
            return StatusCode(500, "An error ocurred while retrieving the categories");
        }
    }
    
    // GET: api/categories/5
    [HttpGet("{id}")]
    public async Task<ActionResult<CategoryDto>> GetCategory(int id)
    {
        try
        {
            var category = await _context.Categories
                .Where(c => c.Id == id)
                .Select(c => new CategoryDto()
                {
                    Id = c.Id,
                    Name = c.Name
                })
                .FirstOrDefaultAsync();

            if (category == null)
            {
                return NotFound("Category not found");
            }

            return Ok(category);
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error retreiving the category");
            return StatusCode(500, "An error ocurred while retrieving the category");
        }
    }
    
    // POST: api/categories
    [HttpPost]
    public async Task<ActionResult<CategoryDto>> CreateCategory([FromBody]CreateCategoryDto request)
    {
        try
        {
            var existingCategory =
                await _context.Categories.FirstOrDefaultAsync(c => c.Name.ToLower() == request.Name.ToLower());

            if (existingCategory != null)
            {
                return BadRequest("A category with this name already exists");
            }

            var category = new Category()
            {
                Name = request.Name,
            };

            _context.Categories.Add(category);
            await _context.SaveChangesAsync();

            var result = new CategoryDto()
            {
                Id = category.Id,
                Name = category.Name
            };

            return CreatedAtAction(nameof(GetCategory), new { id = category.Id }, result);
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error creating the category");
            return StatusCode(500, "An error ocurred while creating the category");
        }
    }
    
    // PUT: api/category
    [HttpPut]
    public async Task<IActionResult> UpdateCategory([FromBody] UpdateCategoryDto request)
    {
        try
        {
            var category = await _context.Categories.FindAsync(request.Id);

            if (category == null)
            {
                return NotFound("Category not found");
            }
            
            var existingCategory = await _context.Categories.FirstOrDefaultAsync(c => 
                c.Name.ToLower() == request.Name.ToLower()
                && c.Id != request.Id);

            if (existingCategory != null)
            {
                return BadRequest("A category with this name already exists");
            }
            
            category.Name = request.Name;
            
            await _context.SaveChangesAsync();

            return Ok();
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error while updating the category");
            return StatusCode(500, "An error acurred while updating the category");
        }
    }
    
    // DELETE: api/categories/5
    [HttpDelete("{id}")]
    public async Task<IActionResult> DeleteCategory(int id)
    {
        try
        {
            var category = await _context.Categories
                .Include(c => c.Transactions)
                .FirstOrDefaultAsync(c => c.Id == id);

            if (category == null)
            {
                return NotFound("Category not found");
            }

            if (category.Transactions.Any())
            {
                return BadRequest("Cannot delete category with existing transactions");
            }

            _context.Categories.Remove(category);
            await _context.SaveChangesAsync();

            return Ok();
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error deleting the category");
            return StatusCode(500, "An error ocurred while deleting the category");
        }
    }
}