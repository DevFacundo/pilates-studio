import { Component, signal } from '@angular/core';
import { RouterOutlet, RouterLink, RouterLinkActive } from '@angular/router';
import { CommonModule } from '@angular/common';

interface NavItem {
  path: string;
  label: string;
  icon: string;
}

@Component({
  selector: 'app-main-layout',
  standalone: true,
  imports: [RouterOutlet, RouterLink, RouterLinkActive, CommonModule],
  templateUrl: './main-layout.html',
})
export class MainLayoutComponent {
  collapsed = signal(false);

  navItems: NavItem[] = [
    { path: 'dashboard',  label: 'Inicio',       icon: '📊' },
    { path: 'alumnos',    label: 'Alumnos',          icon: '🧘' },
    { path: 'pagos',      label: 'Pagos',            icon: '💳' },
    { path: 'clases',     label: 'Clases',           icon: '🗓️' },
    { path: 'patologias', label: 'Patologías',       icon: '🩺' },
    { path: 'planes',     label: 'Planes',           icon: '📋' },
    { path: 'estadisticas', label: 'Estadisticas',      icon: '📈' },
  ];

}
