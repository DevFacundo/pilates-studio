import { CommonModule } from '@angular/common';
import { Component, computed, inject, OnInit, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ClassScheduleService } from '../../core/services/class-schedule.service';
import { ClassSchedule, ClassScheduleRequest, DAY_LABELS, DAY_ORDER, DayOfWeek } from '../../core/models/class-schedule';
import { Member } from '../../core/models/member';

@Component({
  selector: 'app-classes-list',
  imports: [CommonModule, FormsModule],
  templateUrl: './classes-list.html',
  styleUrl: './classes-list.css',
})
export class ClassesList implements OnInit {
  private scheduleService = inject(ClassScheduleService);

  schedules    = signal<ClassSchedule[]>([]);
  loading      = signal(true);
  showModal    = signal(false);
  editTarget   = signal<ClassSchedule | null>(null);
  saving       = signal(false);
  formError    = signal('');

  // Members modal
  showMembers  = signal(false);
  membersOfClass = signal<Member[]>([]);
  membersLoading = signal(false);
selectedScheduleForMembers = signal<ClassSchedule | null>(null);
  days      = DAY_ORDER;
  dayLabels = DAY_LABELS;

  form: ClassScheduleRequest = {
    day: 'MONDAY',
    startTime: '',
    endTime: '',
    maxCapacity: 6,
  };

  schedulesByDay = computed(() => {
    const map = new Map<DayOfWeek, ClassSchedule[]>();
    for (const day of this.days) map.set(day, []);
    for (const s of this.schedules()) {
      map.get(s.day)?.push(s);
    }
    // Sort by start time within each day
    for (const [, list] of map) list.sort((a, b) => a.startTime.localeCompare(b.startTime));
    return map;
  });

  get isEdit() { return !!this.editTarget(); }

  capacityColor(s: ClassSchedule): string {
    const ratio = s.memberIds.length / s.maxCapacity;
    if (ratio >= 1)    return 'bg-red-100 text-red-600 border-red-200';
    if (ratio >= 0.75) return 'bg-yellow-50 text-yellow-700 border-yellow-200';
    return 'bg-emerald-50 text-emerald-700 border-emerald-200';
  }

  ngOnInit() { this.load(); }

  load() {
    this.loading.set(true);
    this.scheduleService.getAll().subscribe({
      next: (d) => { this.schedules.set(d); this.loading.set(false); },
      error: ()  => this.loading.set(false),
    });
  }

  openCreate() {
    this.form = { day: 'MONDAY', startTime: '', endTime: '', maxCapacity: 6 };
    this.editTarget.set(null);
    this.formError.set('');
    this.showModal.set(true);
  }

  openEdit(s: ClassSchedule) {
    this.form = {
      day:         s.day,
      startTime:   s.startTime.slice(0, 5),
      endTime:     s.endTime.slice(0, 5),
      maxCapacity: s.maxCapacity,
    };
    this.editTarget.set(s);
    this.formError.set('');
    this.showModal.set(true);
  }

  viewMembers(s: ClassSchedule) {
    this.selectedScheduleForMembers.set(s);
    this.membersLoading.set(true);
    this.showMembers.set(true);
    this.scheduleService.getMembersBySchedule(s.id).subscribe(m => {
      this.membersOfClass.set(m);
      this.membersLoading.set(false);
    });
  }

  delete(s: ClassSchedule) {
    if (!confirm(`¿Eliminar clase del ${this.dayLabels[s.day]} ${s.startTime.slice(0,5)}?`)) return;
    this.scheduleService.delete(s.id).subscribe(() => this.load());
  }

  submit() {
    if (!this.form.startTime || !this.form.endTime) {
      this.formError.set('Completá horario de inicio y fin.');
      return;
    }
    this.formError.set('');
    this.saving.set(true);

    const req$ = this.isEdit
      ? this.scheduleService.update(this.editTarget()!.id, this.form)
      : this.scheduleService.create(this.form);

    req$.subscribe({
      next:  () => { this.saving.set(false); this.showModal.set(false); this.load(); },
      error: (e) => { this.saving.set(false); this.formError.set(e.userMessage ?? 'Error'); },
    });
  }
}
