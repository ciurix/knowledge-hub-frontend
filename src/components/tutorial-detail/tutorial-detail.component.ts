import { Component, inject, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { TutorialService, Tutorial } from '../../services/tutorial.service';
import { AuthService } from '../../services/auth.service';
import { CategoryService } from '../../services/category.service';

@Component({
  selector: 'app-tutorial-detail',
  standalone: true,
  imports: [CommonModule, RouterLink],
  templateUrl: './tutorial-detail.component.html'
})
export class TutorialDetailComponent implements OnInit {
  private route = inject(ActivatedRoute);
  private router = inject(Router);
  private tutorialService = inject(TutorialService);
  authService = inject(AuthService);
  categoryService = inject(CategoryService);

  tutorial = signal<Tutorial | null>(null);
  isLoading = signal(true);
  error = signal<string | null>(null);

  // Fallback images
  placeholders = [
    'https://lh3.googleusercontent.com/aida-public/AB6AXuBPxMmWuM7sOgCXlUanZlBd9svs-Hzbl33UpKIVJzCOH2CTef2SZa5hzO6LAyyyrCrHTqjqdZ-15B0h_xpZuRDMYvJTGgpBh3TDkOfs0p_6wSm2Cd1L1ybFM3jhQzVm_eXkFCpyhL85V3B_AJ2H_bU0jqPyi8d-X5OTNWCUl81BITumQWdn4Q3Z62h9h3pdyJ81AjNI6vM7hCLmBFbz59LNy5ahtadr-3c5m92VIHyyx5q5T1F29Mo8F408jF6T7YmCxBkVj6Csdg',
    'https://lh3.googleusercontent.com/aida-public/AB6AXuB2QPYZAwkid33taWsNi4GqHcH5SCT0_mwTYMoVKVc5yrEeLmbOghaP1lvzlDFszhEwglm_4F-kzlkEhKTcq16OIAczf01mmBFqEE_nh1MgTuSDpX1s2ktzK1m-YR_aCV39FNB0pF8A7D-RCrEMrs0l_vVnCCJpIFi2V8XpL_QFZOn4loz1CskLwOoBT3XgNTZP5IrHYQ-AilJrBLDMBaf23UST9ZCP5paDAMc4xUK_CYKNdZpK09i-Yz-3YJPzjW9M_UMMBmwq-g'
  ];

  ngOnInit() {
    const id = this.route.snapshot.paramMap.get('id');
    if (id) {
      this.loadTutorial(id);
    } else {
      this.error.set('Tutorial not found');
      this.isLoading.set(false);
    }
  }

  loadTutorial(id: string) {
    this.tutorialService.getById(id).subscribe({
      next: (tutorial) => {
        this.tutorial.set(tutorial);
        this.isLoading.set(false);
      },
      error: () => {
        this.error.set('Failed to load tutorial');
        this.isLoading.set(false);
      }
    });
  }

  getCategoryName(slug: string | undefined): string {
    if (!slug) return 'General';
    const cat = this.categoryService.getCategoryBySlug(slug);
    return cat?.name || 'General';
  }

  getCategoryIcon(slug: string | undefined): string {
    if (!slug) return 'bookmark';
    const cat = this.categoryService.getCategoryBySlug(slug);
    return cat?.icon || 'bookmark';
  }

  getAuthorName(): string {
    const t = this.tutorial();
    if (!t) return 'Unknown';
    if (typeof t.authorId === 'object' && t.authorId !== null) {
      return (t.authorId as any).email?.split('@')[0] || 'Instructor';
    }
    return 'Instructor';
  }

  getCoverImage(): string {
    const t = this.tutorial();
    if (t?.coverImage) return t.coverImage;
    return this.placeholders[0];
  }

  formatDate(dateStr: string | undefined): string {
    if (!dateStr) return 'Unknown date';
    const date = new Date(dateStr);
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  }

  canEdit(): boolean {
    const user = this.authService.currentUser();
    const t = this.tutorial();
    if (!user || !t) return false;

    // Admin can edit any tutorial
    if (user.role === 'admin') return true;

    // Author can edit their own tutorial
    if (typeof t.authorId === 'object' && t.authorId !== null) {
      return (t.authorId as any).email === user.email;
    }
    return t.authorId === user.id;
  }

  editTutorial() {
    const t = this.tutorial();
    if (t?._id) {
      this.router.navigate(['/editor', t._id]);
    }
  }
}

