import { Component, EventEmitter, inject, Input, OnInit, Output, signal } from '@angular/core';
import { Member, MemberRequest } from '../../core/models/member';
import { MemberService } from '../../core/services/member.service';
import { PathologyService } from '../../core/services/pathology.service';
import { ClassScheduleService } from '../../core/services/class-schedule.service';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { Pathology } from '../../core/models/pathology';
import { ClassSchedule, DAY_LABELS, DAY_ORDER } from '../../core/models/class-schedule';
import { forkJoin } from 'rxjs';

@Component({
  selector: 'app-member-form',
  imports: [CommonModule, FormsModule],
  templateUrl: './member-form.html',
})
export class MemberForm implements OnInit {
  @Input() member: Member | null = null;
  @Output() saved  = new EventEmitter<void>();
  @Output() closed = new EventEmitter<void>();

  private memberService    = inject(MemberService);
  private pathologyService = inject(PathologyService);
  private scheduleService  = inject(ClassScheduleService);

  saving      = signal(false);
  error       = signal('');
  pathologies = signal<Pathology[]>([]);
  schedules   = signal<ClassSchedule[]>([]);
  dayLabels   = DAY_LABELS;
  dayOrder    = DAY_ORDER;

  form: MemberRequest = {
    dni: '', firstName: '', lastName: '',
    phoneNumber: '', auxiliaryPhoneNumber: '',
    birthDate: '',
    healthRecord: { height: 0, weight: 0, pathologyId: [] },
    classScheduleId: [],
  };

  get isEdit() { return !!this.member; }

  get title() { return this.isEdit ? 'Editar Alumna' : 'Nueva Alumna'; }

  schedulesByDay(day: string): ClassSchedule[] {
    return this.schedules().filter(s => s.day === day);
  }

  isScheduleSelected(id: number): boolean {
    return this.form.classScheduleId?.includes(id) ?? false;
  }

  toggleSchedule(id: number) {
    const ids = this.form.classScheduleId ?? [];
    this.form.classScheduleId = ids.includes(id)
      ? ids.filter(i => i !== id)
      : [...ids, id];
  }

  isPathologySelected(id: number): boolean {
    return this.form.healthRecord?.pathologyId?.includes(id) ?? false;
  }

  togglePathology(id: number) {
    const ids = this.form.healthRecord?.pathologyId ?? [];
    if (this.form.healthRecord) {
      this.form.healthRecord.pathologyId = ids.includes(id)
        ? ids.filter(i => i !== id)
        : [...ids, id];
    }
  }

  ngOnInit() {
    forkJoin({
      pathologies: this.pathologyService.getAll(),
      schedules:   this.scheduleService.getAll(),
    }).subscribe(({ pathologies, schedules }) => {
      this.pathologies.set(pathologies);
      this.schedules.set(schedules);
      if (this.member) this.patchForm(this.member);
    });
  }

  private patchForm(m: Member) {
    this.form = {
      dni:                   m.dni,
      firstName:             m.firstName,
      lastName:              m.lastName,
      phoneNumber:           m.phoneNumber,
      auxiliaryPhoneNumber:  m.auxiliaryPhoneNumber ?? '',
      birthDate:             m.birthDate ?? '',
      healthRecord: {
        height:      m.healthRecord?.height ?? 0,
        weight:      m.healthRecord?.weight ?? 0,
        pathologyId: m.healthRecord?.pathologies?.map(p => p.id) ?? [],
      },
      classScheduleId: m.classSchedules?.map(s => s.id) ?? [],
    };
  }

  submit() {
    this.error.set('');
    this.saving.set(true);

    const req$ = this.isEdit
      ? this.memberService.update(this.member!.id, this.form)
      : this.memberService.create(this.form);

    req$.subscribe({
      next:  () => { this.saving.set(false); this.saved.emit(); },
      error: (e) => { this.saving.set(false); this.error.set(e.userMessage ?? 'Error al guardar'); },
    });
  }

}
