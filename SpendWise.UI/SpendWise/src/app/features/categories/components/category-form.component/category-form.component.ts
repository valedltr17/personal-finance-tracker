import {Component, OnInit} from '@angular/core';
import {CategoryService} from '../../../../core/services';
import {SaveCategoryRequest, UpdateCategoryRequest} from '../../../../core/models';
import {ActivatedRoute, Router} from '@angular/router';

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
  };

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
    }
  }

  loadCategory(): void {
    if (!this.categoryId) return;

    this.loading = true;
    this.categoryService.getCategory(this.categoryId).subscribe({
      next: (data) => {
        this.categoryForm = {
          name: data.name
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

    if (this.isEditMode && this.categoryId) {
      const updateDto: UpdateCategoryRequest = {
        id: this.categoryId,
        name: this.categoryForm.name
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
        name: this.categoryForm.name
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
}
