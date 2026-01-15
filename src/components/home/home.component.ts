import { Component, inject, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TutorialService, Tutorial } from '../../services/tutorial.service';
import { AuthService } from '../../services/auth.service';
import { CategoryService } from '../../services/category.service';
import { RouterLink } from '@angular/router';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [CommonModule, RouterLink, FormsModule],
  templateUrl: './home.component.html'
})
export class HomeComponent implements OnInit {
  tutorialService = inject(TutorialService);
  authService = inject(AuthService);
  categoryService = inject(CategoryService);

  tutorials = signal<Tutorial[]>([]);
  allTutorials = signal<Tutorial[]>([]);
  searchQuery = signal('');
  selectedCategory = signal<string | null>(null);

  // Fallback images if tutorial has no cover
  placeholders = [
    'https://lh3.googleusercontent.com/aida-public/AB6AXuBPxMmWuM7sOgCXlUanZlBd9svs-Hzbl33UpKIVJzCOH2CTef2SZa5hzO6LAyyyrCrHTqjqdZ-15B0h_xpZuRDMYvJTGgpBh3TDkOfs0p_6wSm2Cd1L1ybFM3jhQzVm_eXkFCpyhL85V3B_AJ2H_bU0jqPyi8d-X5OTNWCUl81BITumQWdn4Q3Z62h9h3pdyJ81AjNI6vM7hCLmBFbz59LNy5ahtadr-3c5m92VIHyyx5q5T1F29Mo8F408jF6T7YmCxBkVj6Csdg',
    'https://lh3.googleusercontent.com/aida-public/AB6AXuB2QPYZAwkid33taWsNi4GqHcH5SCT0_mwTYMoVKVc5yrEeLmbOghaP1lvzlDFszhEwglm_4F-kzlkEhKTcq16OIAczf01mmBFqEE_nh1MgTuSDpX1s2ktzK1m-YR_aCV39FNB0pF8A7D-RCrEMrs0l_vVnCCJpIFi2V8XpL_QFZOn4loz1CskLwOoBT3XgNTZP5IrHYQ-AilJrBLDMBaf23UST9ZCP5paDAMc4xUK_CYKNdZpK09i-Yz-3YJPzjW9M_UMMBmwq-g',
    'https://lh3.googleusercontent.com/aida-public/AB6AXuC_Keq11MYJZ1l1Un0SiEDnswEZVY_wbHU-n7ygoI2FcFal_IE4UxEM1Tzxb-3c2xuI8_aOL6hU7z5LN85Fxu2SOXLuogzPRn82_2veuvi9oEWN7CHUgXLmfa5uTt7rVVbKVk1zyYqCNKWCiSi9kbW4IDKPQpGNwVkNlLRBqen7CgbEM56Exw6FSAF91wSR6vFtYef_BzUg6I3gBQT1pX4yZwbaC6AfDT5_hWf0m5GvrvvtZ-ExhHdSxW5GjvNQ5gnB18CxQIhKHw',
    'https://lh3.googleusercontent.com/aida-public/AB6AXuBJkVV69NhSuiRCH1oZK4AxkNOAyT9jgHXoEWVQzymbH6qtS2kPCpv6ONTbvWGiIxVOiCSac9OchtKJFnjDR9y76tDC3K46GCqzorpy7d5awwesMtprVdtrAqafqVi2S-1H_sFIEC4eyZWNDXI1Toxx4LjocqbZZ78_SSkfoTETViE02OpqoDFQ1k1RT1WpzEfAYqqfj5299Vo470NZ2YZTGizpjbGV7KAhpiku3iZ-l_ztFw_biDYwMpVTFDpQ_SZayBf3WcLX0A'
  ];

  ngOnInit() {
    this.fetchTutorials();
  }

  fetchTutorials() {
    this.tutorialService.getAll(this.searchQuery()).subscribe(data => {
      // Filter only published for the public home page
      const published = data.filter(t => t.published);
      this.allTutorials.set(published);
      this.applyFilters();
    });
  }

  applyFilters() {
    let filtered = this.allTutorials();

    if (this.selectedCategory()) {
      filtered = filtered.filter(t => t.category === this.selectedCategory());
    }

    this.tutorials.set(filtered);
  }

  selectCategory(slug: string | null) {
    this.selectedCategory.set(slug);
    this.applyFilters();
  }

  onSearch(event: Event) {
    event.preventDefault();
    this.fetchTutorials();
  }

  getAuthorName(t: Tutorial): string {
    if (typeof t.authorId === 'object' && t.authorId !== null) {
        return (t.authorId as any).email.split('@')[0];
    }
    return 'Instructor';
  }

  getRandomImage(index: number) {
    return this.placeholders[index % this.placeholders.length];
  }

  getCategoryName(slug: string | undefined): string {
    if (!slug) return 'General';
    const cat = this.categoryService.getCategoryBySlug(slug);
    return cat?.name || 'General';
  }
}
