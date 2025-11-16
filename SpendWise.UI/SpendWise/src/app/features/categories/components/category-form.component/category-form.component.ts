import {Component, OnInit} from '@angular/core';
import {ActivatedRoute, Router} from '@angular/router';
import {SaveCategoryRequest, UpdateCategoryRequest} from '../../../../core/models';
import {CategoryService} from '../../../../core/services';

@Component({
  selector: 'app-category-form.component',
  standalone: false,
  templateUrl: './category-form.component.html',
  styleUrl: './category-form.component.scss',
})
export class CategoryFormComponent implements OnInit {
  categoryId: number | null = null;
  isEditMode = false;
  loading = false;
  error: string | null = null;

  categoryForm = {
    name: '',
    color: ''
  };

  commonColors = ['#3b82f6', '#ef4444', '#10b981', '#f59e0b', '#8b5cf6', '#ec4899', '#06b6d4', '#84cc16'];

  constructor(
    private categoryService: CategoryService,
    private route: ActivatedRoute,
    private router: Router
  ) {}

  ngOnInit(): void {
    const id = this.route.snapshot.paramMap.get('id');
    if (id) {
      this.categoryId = +id;
      this.isEditMode = true;
      this.loadCategory();
    } else {
      this.categoryForm.color = this.generateRandomHexColor();
    }
  }

  loadCategory(): void {
    if (!this.categoryId) return;

    this.loading = true;
    this.categoryService.getCategory(this.categoryId).subscribe({
      next: (data) => {
        this.categoryForm = {
          name: data.name,
          color: data.color
        };
        this.loading = false;
      },
      error: (err) => {
        this.error = 'Failed to load category';
        this.loading = false;
        console.error('Error loading category:', err);
      }
    });
  }

  onSubmit(): void {
    if (!this.categoryForm.name.trim()) {
      this.error = 'Category name is required';
      return;
    }

    this.loading = true;
    this.error = null;
    const randomColor = this.generateRandomHexColor();

    if (this.isEditMode && this.categoryId) {
      const updateDto: UpdateCategoryRequest = {
        id: this.categoryId,
        name: this.categoryForm.name,
        color: this.categoryForm.color
      };

      this.categoryService.updateCategory(updateDto).subscribe({
        next: () => {
          this.router.navigate(['/categories']);
        },
        error: (err) => {
          this.error = 'Failed to update category';
          this.loading = false;
          console.error('Error updating category:', err);
        }
      });
    } else {
      const createDto: SaveCategoryRequest = {
        name: this.categoryForm.name,
        color: this.categoryForm.color
      };

      this.categoryService.createCategory(createDto).subscribe({
        next: () => {
          this.router.navigate(['/categories']);
        },
        error: (err) => {
          this.error = 'Failed to create category';
          this.loading = false;
          console.error('Error creating category:', err);
        }
      });
    }
  }

  cancel(): void {
    this.router.navigate(['/categories']);
  }

  selectColor(color: string): void {
    this.categoryForm.color = color;
  }

  private generateRandomHexColor(): string {
    // Generate a random number between 0 and 16777215 (FFFFFF in hex).
    // Multiplying by 0xffffff ensures a number within the 24-bit range.
    // Multiplying by 1000000 adds more randomness and ensures a larger number for slicing.
    const randomNum = Math.floor(Math.random() * 0xffffff * 1000000);

    // Convert the number to a hexadecimal string.
    let hexColor = randomNum.toString(16);

    // Ensure the hex string is 6 characters long by padding with leading zeros if necessary.
    // This is crucial because `toString(16)` might produce shorter strings for smaller numbers.
    hexColor = hexColor.slice(0, 6); // Take only the first 6 characters to avoid longer results.
    while (hexColor.length < 6) {
      hexColor = '0' + hexColor;
    }

    // Prepend '#' to make it a valid CSS hex color code.
    return `#${hexColor}`;
  }
}
