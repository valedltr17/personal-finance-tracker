import {Component, OnInit} from '@angular/core';
import {Category} from '../../../../core/models';
import {CategoryService} from '../../../../core/services';

@Component({
  selector: 'app-category-list.component',
  standalone: false,
  templateUrl: './category-list.component.html',
  styleUrl: './category-list.component.scss',
})
export class CategoryListComponent implements OnInit {
  categories: Category[] = [];
  loading = false;
  error: string | null = null;

  constructor(private categoryService: CategoryService) {}

  ngOnInit(): void {
    this.loadCategories();
  }

  loadCategories(): void {
    this.loading = true;
    this.error = null;

    this.categoryService.getCategories().subscribe({
      next: (data) => {
        this.categories = data;
        this.loading = false;
      },
      error: (err) => {
        this.error = 'Failed to load categories';
        this.loading = false;
        console.error('Error loading categories:', err);
      }
    });
  }

  deleteCategory(id: number): void {
    if (confirm('Are you sure you want to delete this category?')) {
      this.categoryService.deleteCategory(id).subscribe({
        next: () => {
          this.loadCategories();
        },
        error: (err) => {
          this.error = 'Failed to delete category';
          console.error('Error deleting category:', err);
        }
      });
    }
  }
}
