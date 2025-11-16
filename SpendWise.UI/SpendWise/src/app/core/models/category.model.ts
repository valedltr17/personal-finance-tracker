export interface Category {
  id: number;
  name: string;
  color: string;
}

export interface SaveCategoryRequest {
  name: string;
  color: string;
}

export interface UpdateCategoryRequest {
  id: number;
  name?: string;
  color?: string;
}
