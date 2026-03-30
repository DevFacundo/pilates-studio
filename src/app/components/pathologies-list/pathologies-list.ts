import { CommonModule } from '@angular/common';
import { Component, computed, inject, OnInit, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { PathologyService } from '../../core/services/pathology.service';
import { Pathology, PathologyRequest, Severity } from '../../core/models/pathology';

@Component({
  selector: 'app-pathologies-list',
  imports: [CommonModule, FormsModule],
  templateUrl: './pathologies-list.html',
  styleUrl: './pathologies-list.css',
})
export class PathologiesList implements OnInit{

  private pathologyService = inject(PathologyService);

  pathologies  = signal<Pathology[]>([]);
  loading      = signal(true);
  searchQuery  = signal('');
  showModal    = signal(false);
  editTarget   = signal<Pathology | null>(null);
  saving       = signal(false);
  formError    = signal('');

  severities: Severity[] = ['LEVE', 'MODERADA', 'SEVERA'];

  emptyForm: PathologyRequest = {
    name: '', description: '', severity: 'LEVE', recommendations: ''
  };
  form: PathologyRequest = { ...this.emptyForm };

  filtered = computed(() => {
    const q = this.searchQuery().toLowerCase();
    return this.pathologies().filter(p =>
      !q || p.name.toLowerCase().includes(q) || p.description?.toLowerCase().includes(q)
    );
  });

  get isEdit() { return !!this.editTarget(); }

  ngOnInit() { this.load(); }

  load() {
    this.loading.set(true);
    this.pathologyService.getAll().subscribe({
      next: (d) => { this.pathologies.set(d); this.loading.set(false); },
      error: ()  => this.loading.set(false),
    });
  }

  openCreate() {
    this.form = { ...this.emptyForm };
    this.editTarget.set(null);
    this.formError.set('');
    this.showModal.set(true);
  }

  openEdit(p: Pathology) {
    this.form = {
      name:            p.name,
      description:     p.description ?? '',
      severity:        p.severity as Severity,
      recommendations: p.recommendations ?? '',
    };
    this.editTarget.set(p);
    this.formError.set('');
    this.showModal.set(true);
  }

  delete(p: Pathology) {
    if (!confirm(`¿Eliminar "${p.name}"?`)) return;
    this.pathologyService.delete(p.id).subscribe(() => this.load());
  }

  submit() {
    if (!this.form.name.trim()) { this.formError.set('El nombre es obligatorio.'); return; }
    this.formError.set('');
    this.saving.set(true);

    const req$ = this.isEdit
      ? this.pathologyService.update(this.editTarget()!.id, this.form)
      : this.pathologyService.create(this.form);

    req$.subscribe({
      next:  () => { this.saving.set(false); this.showModal.set(false); this.load(); },
      error: (e) => { this.saving.set(false); this.formError.set(e.userMessage ?? 'Error'); },
    });
  }

}
