using System.ComponentModel.DataAnnotations;

namespace SpenWise.API.DTOs.Request;

public class UpdateCategoryDto
{
    [Required]
    public int Id { get; set; }
    
    [Required]
    [MaxLength(100)]
    public string Name { get; set; } = string.Empty;
}