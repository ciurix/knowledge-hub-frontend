import { Injectable, signal } from '@angular/core';

export interface Category {
  _id?: string;
  name: string;
  slug: string;
  icon?: string;
}

// Default categories that always exist
const DEFAULT_CATEGORIES: Category[] = [
  { _id: 'development', name: 'Development', slug: 'development', icon: 'code' },
  { _id: 'design', name: 'Design', slug: 'design', icon: 'palette' },
  { _id: 'data-science', name: 'Data Science', slug: 'data-science', icon: 'analytics' }
];

@Injectable({
  providedIn: 'root'
})
export class CategoryService {
  categories = signal<Category[]>(DEFAULT_CATEGORIES);

  constructor() {
    this.loadCategories();
  }

  private loadCategories() {
    // Load custom categories from localStorage and merge with defaults
    const stored = localStorage.getItem('custom_categories');
    const customCats: Category[] = stored ? JSON.parse(stored) : [];
    this.categories.set([...DEFAULT_CATEGORIES, ...customCats]);
  }

  // For admin use - adds a custom category (stored in localStorage)
  addCategory(category: Omit<Category, '_id' | 'slug'>): Category {
    const slug = category.name.toLowerCase().replace(/\s+/g, '-');
    const newCat: Category = {
      _id: `custom-${Date.now()}`,
      name: category.name,
      slug: slug,
      icon: category.icon || 'bookmark'
    };

    // Save to localStorage
    const stored = localStorage.getItem('custom_categories');
    const custom: Category[] = stored ? JSON.parse(stored) : [];
    custom.push(newCat);
    localStorage.setItem('custom_categories', JSON.stringify(custom));

    this.categories.update(cats => [...cats, newCat]);
    return newCat;
  }

  deleteCategory(id: string): void {
    // Only allow deleting custom categories
    if (DEFAULT_CATEGORIES.some(c => c._id === id)) return;

    // Remove from localStorage
    const stored = localStorage.getItem('custom_categories');
    const custom: Category[] = stored ? JSON.parse(stored) : [];
    const filtered = custom.filter(c => c._id !== id);
    localStorage.setItem('custom_categories', JSON.stringify(filtered));

    this.categories.update(cats => cats.filter(c => c._id !== id));
  }

  getCategoryBySlug(slug: string): Category | undefined {
    return this.categories().find(c => c.slug === slug);
  }
}

