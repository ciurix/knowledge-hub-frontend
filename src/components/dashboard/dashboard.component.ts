import { Component, inject, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TutorialService, Tutorial } from '../../services/tutorial.service';
import { AuthService } from '../../services/auth.service';
import { Router, RouterLink } from '@angular/router';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [CommonModule, RouterLink, FormsModule],
  templateUrl: './dashboard.component.html'
})
export class DashboardComponent implements OnInit {
  tutorialService = inject(TutorialService);
  authService = inject(AuthService);
  router = inject(Router);

  myTutorials = signal<Tutorial[]>([]);
  searchFilter = signal('');

  ngOnInit() {
    if (!this.authService.isAuthenticated()) {
      this.router.navigate(['/login']);
      return;
    }
    this.fetchMyTutorials();
  }

  fetchMyTutorials() {
    this.tutorialService.getMyTutorials().subscribe({
      next: (data) => this.myTutorials.set(data),
      error: () => this.router.navigate(['/login'])
    });
  }

  deleteTutorial(id: string) {
    if (confirm('Are you sure you want to delete this tutorial?')) {
      this.tutorialService.delete(id).subscribe(() => {
        this.fetchMyTutorials();
      });
    }
  }

  editTutorial(id: string) {
    this.router.navigate(['/editor', id]);
  }

  get filteredTutorials() {
    const term = this.searchFilter().toLowerCase();
    return this.myTutorials().filter(t => t.title.toLowerCase().includes(term));
  }

  // Helper for status classes
  getStatusClass(published: boolean): string {
    return published
      ? 'bg-green-100 text-green-700 border-green-200'
      : 'bg-accent-coral/20 text-accent-coral border-accent-coral/30';
  }

  getStatusLabel(published: boolean): string {
    return published ? 'Published' : 'Draft';
  }
}
