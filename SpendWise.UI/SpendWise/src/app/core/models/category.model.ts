export interface Category {
  id: number;
  name: string;
  type: CategoryType;
  isActive: boolean;
}

export interface SaveCategoryRequest {
  name: string;
  type: CategoryType;
}

export interface UpdateCategoryRequest {
  id: number;
  name?: string;
  type?: CategoryType;
  isActive?: boolean;
}

export enum CategoryType {
  Income = 0,
  Expense = 1
}
