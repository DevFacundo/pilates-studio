import { Component, computed, inject, OnInit, signal } from '@angular/core';
import { Member } from '../../core/models/member';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { MemberService } from '../../core/services/member.service';
import { MemberForm } from '../member-form/member-form';
import { MemberDetail } from '../member-detail/member-detail';



@Component({
  selector: 'app-member-list',
  imports: [CommonModule, FormsModule, MemberForm, MemberDetail],
  templateUrl: './member-list.html',
})
export class MemberList implements OnInit {


private memberService = inject(MemberService);

  members       = signal<Member[]>([]);
  loading       = signal(true);
  searchQuery   = signal('');
  filterActive  = signal<'all' | 'active' | 'inactive'>('all');

  showFormModal   = signal(false);
  showDetailModal = signal(false);
  selectedMember  = signal<Member | null>(null);

  filtered = computed(() => {
    const q = this.searchQuery().toLowerCase();
    return this.members()
      .filter(m => {
        if (this.filterActive() === 'active')   return m.active;
        if (this.filterActive() === 'inactive') return !m.active;
        return true;
      })
      .filter(m =>
        !q ||
        m.firstName.toLowerCase().includes(q) ||
        m.lastName.toLowerCase().includes(q) ||
        m.dni.includes(q) ||
        m.phoneNumber.includes(q)
      );
  });

  activeCount   = computed(() => this.members().filter(m => m.active).length);
  inactiveCount = computed(() => this.members().filter(m => !m.active).length);

  ngOnInit() {
    this.load();
  }

  load() {
    this.loading.set(true);
    this.memberService.getAll().subscribe({
      next: (data) => { this.members.set(data); this.loading.set(false); },
      error: ()     => this.loading.set(false),
    });
  }

  openCreate() {
    this.selectedMember.set(null);
    this.showFormModal.set(true);
  }

  openEdit(member: Member) {
    this.selectedMember.set(member);
    this.showFormModal.set(true);
  }

  openDetail(member: Member) {
    this.selectedMember.set(member);
    this.showDetailModal.set(true);
  }

  onFormSaved() {
    this.showFormModal.set(false);
    this.load();
  }

  onDelete(member: Member) {
    if (!confirm(`¿Eliminar a ${member.firstName} ${member.lastName}?`)) return;
    this.memberService.delete(member.id).subscribe(() => this.load());
  }

  setFilter(f: 'all' | 'active' | 'inactive') {
    this.filterActive.set(f);
  }

  readonly filterOptions = [
  { k: 'all', l: 'Todos' },
  { k: 'active', l: 'Activos' },
  { k: 'inactive', l: 'Inactivos' }
] as const;
}
