using System.ComponentModel.DataAnnotations;

namespace SpendWise.API.DTOs.Request;

public class UpdateCategoryDto
{
    [Required]
    public int Id { get; set; }
    
    [Required]
    [MaxLength(100)]
    public string Name { get; set; } = string.Empty;
    
    [Required]
    [MaxLength(7)]
    public string Color { get; set; } = string.Empty;
}