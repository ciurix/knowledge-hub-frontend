import { Component, inject, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { TutorialService } from '../../services/tutorial.service';
import { AuthService } from '../../services/auth.service';
import { CategoryService } from '../../services/category.service';

@Component({
  selector: 'app-editor',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './editor.component.html'
})
export class EditorComponent implements OnInit {
  private fb = inject(FormBuilder);
  private tutorialService = inject(TutorialService);
  private authService = inject(AuthService);
  private route = inject(ActivatedRoute);
  private router = inject(Router);
  categoryService = inject(CategoryService);

  isEditing = signal(false);
  isLoading = signal(false);
  tutorialId = signal<string | null>(null);

  form = this.fb.group({
    title: ['Untitled Tutorial', [Validators.required]],
    description: ['Start writing your masterpiece here...', [Validators.required]],
    coverImage: [''],
    sourceLink: [''],
    category: ['']
  });

  ngOnInit() {
     if (!this.authService.isAuthenticated()) {
       this.router.navigate(['/login']);
       return;
     }

     const id = this.route.snapshot.paramMap.get('id');
     if (id) {
       this.isEditing.set(true);
       this.tutorialId.set(id);
       this.isLoading.set(true);
       this.tutorialService.getById(id).subscribe({
         next: (t) => {
           this.form.patchValue({
             title: t.title,
             description: t.description,
             coverImage: t.coverImage,
             sourceLink: t.sourceLink,
             category: t.category || ''
           });
           this.isLoading.set(false);
         },
         error: () => {
           this.router.navigate(['/dashboard']);
         }
       });
     }
  }

  save(publish: boolean) {
    if (this.form.invalid) return;

    this.isLoading.set(true);
    const formValue = this.form.value;
    const data = {
      title: formValue.title,
      description: formValue.description,
      coverImage: formValue.coverImage || null,
      sourceLink: formValue.sourceLink || null,
      category: formValue.category || null,
      published: publish
    };

    console.log('Saving tutorial with data:', data);

    if (this.isEditing() && this.tutorialId()) {
      this.tutorialService.update(this.tutorialId()!, data).subscribe({
        next: () => this.router.navigate(['/dashboard']),
        error: (e) => {
           console.error(e);
           this.isLoading.set(false);
        }
      });
    } else {
      this.tutorialService.create(data).subscribe({
        next: () => this.router.navigate(['/dashboard']),
        error: (e) => {
          console.error(e);
          this.isLoading.set(false);
        }
      });
    }
  }

  discard() {
    this.router.navigate(['/dashboard']);
  }
}
