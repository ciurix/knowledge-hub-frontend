import { Component, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { CategoryService, Category } from '../../services/category.service';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-admin',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterLink],
  templateUrl: './admin.component.html'
})
export class AdminComponent {
  categoryService = inject(CategoryService);
  authService = inject(AuthService);
  private router = inject(Router);

  newCategoryName = signal('');
  newCategoryIcon = signal('bookmark');

  // Common Material Icons for categories
  availableIcons = [
    'code', 'palette', 'analytics', 'bookmark', 'school',
    'science', 'psychology', 'architecture', 'music_note',
    'videocam', 'photo_camera', 'brush', 'draw', 'terminal',
    'cloud', 'security', 'devices', 'language', 'business'
  ];

  constructor() {
    // Check admin access
    const user = this.authService.currentUser();
    if (!user || user.role !== 'admin') {
      this.router.navigate(['/']);
    }
  }

  isAdmin(): boolean {
    const user = this.authService.currentUser();
    return user?.role === 'admin';
  }

  addCategory() {
    const name = this.newCategoryName().trim();
    if (!name) return;

    this.categoryService.addCategory({
      name: name,
      icon: this.newCategoryIcon()
    });

    this.newCategoryName.set('');
    this.newCategoryIcon.set('bookmark');
  }

  deleteCategory(id: string) {
    if (confirm('Are you sure you want to delete this category?')) {
      this.categoryService.deleteCategory(id);
    }
  }

  isDefaultCategory(id: string | undefined): boolean {
    const defaultIds = ['development', 'design', 'data-science'];
    return defaultIds.includes(id || '');
  }
}

