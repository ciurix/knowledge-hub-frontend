import { Component, inject, OnInit, signal, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterLink } from '@angular/router';
import { TutorialService, Tutorial } from '../../services/tutorial.service';
import { AuthService } from '../../services/auth.service';
import { CategoryService } from '../../services/category.service';

@Component({
  selector: 'app-profile',
  standalone: true,
  imports: [CommonModule, RouterLink],
  templateUrl: './profile.component.html'
})
export class ProfileComponent implements OnInit {
  private router = inject(Router);
  private tutorialService = inject(TutorialService);
  authService = inject(AuthService);
  categoryService = inject(CategoryService);

  tutorials = signal<Tutorial[]>([]);
  isLoading = signal(true);

  // Computed stats
  totalTutorials = computed(() => this.tutorials().length);
  publishedCount = computed(() => this.tutorials().filter(t => t.published).length);
  draftCount = computed(() => this.tutorials().filter(t => !t.published).length);

  // Category breakdown
  categoryStats = computed(() => {
    const stats: Record<string, number> = {};
    this.tutorials().forEach(t => {
      const category = t.category || 'uncategorized';
      stats[category] = (stats[category] || 0) + 1;
    });
    return Object.entries(stats).map(([slug, count]) => ({
      slug,
      name: this.getCategoryName(slug),
      icon: this.getCategoryIcon(slug),
      count
    })).sort((a, b) => b.count - a.count);
  });

  // Recent tutorials (last 5)
  recentTutorials = computed(() => {
    return [...this.tutorials()]
      .sort((a, b) => {
        const dateA = a.createdAt ? new Date(a.createdAt).getTime() : 0;
        const dateB = b.createdAt ? new Date(b.createdAt).getTime() : 0;
        return dateB - dateA;
      })
      .slice(0, 5);
  });

  // Member since (mock - we'll use the earliest tutorial date or current date)
  memberSince = computed(() => {
    const tutorials = this.tutorials();
    if (tutorials.length === 0) return new Date();
    const dates = tutorials
      .filter(t => t.createdAt)
      .map(t => new Date(t.createdAt!).getTime());
    if (dates.length === 0) return new Date();
    return new Date(Math.min(...dates));
  });

  ngOnInit() {
    if (!this.authService.isAuthenticated()) {
      this.router.navigate(['/login']);
      return;
    }
    this.loadUserTutorials();
  }

  loadUserTutorials() {
    this.tutorialService.getMyTutorials().subscribe({
      next: (data) => {
        this.tutorials.set(data);
        this.isLoading.set(false);
      },
      error: () => {
        this.isLoading.set(false);
      }
    });
  }

  getCategoryName(slug: string): string {
    if (slug === 'uncategorized') return 'Uncategorized';
    const cat = this.categoryService.getCategoryBySlug(slug);
    return cat?.name || 'General';
  }

  getCategoryIcon(slug: string): string {
    if (slug === 'uncategorized') return 'folder';
    const cat = this.categoryService.getCategoryBySlug(slug);
    return cat?.icon || 'bookmark';
  }

  formatDate(date: Date): string {
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  }

  formatShortDate(dateStr: string | undefined): string {
    if (!dateStr) return 'Unknown';
    const date = new Date(dateStr);
    return date.toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric'
    });
  }

  getUserInitial(): string {
    const email = this.authService.currentUser()?.email;
    return email ? email.charAt(0).toUpperCase() : 'U';
  }

  getUserName(): string {
    const email = this.authService.currentUser()?.email;
    return email ? email.split('@')[0] : 'User';
  }

  getUserEmail(): string {
    return this.authService.currentUser()?.email || 'user@example.com';
  }

  getUserRole(): string {
    return this.authService.currentUser()?.role || 'user';
  }

  isAdmin(): boolean {
    return this.getUserRole() === 'admin';
  }

  editTutorial(id: string) {
    this.router.navigate(['/editor', id]);
  }

  viewTutorial(id: string) {
    this.router.navigate(['/tutorial', id]);
  }
}

