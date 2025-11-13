export interface Category {
  id: number;
  name: string;
}

export interface SaveCategoryRequest {
  name: string;
}

export interface UpdateCategoryRequest {
  id: number;
  name?: string;
}
