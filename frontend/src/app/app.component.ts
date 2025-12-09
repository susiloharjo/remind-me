import { Component, ViewChild } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { CommonModule } from '@angular/common';
import { DashboardComponent } from './components/dashboard/dashboard';
import { ReminderFormComponent } from './components/reminder-form/reminder-form';
import { ImportComponent } from './components/import/import';
import { ModalComponent } from './components/modal/modal';
import { Reminder } from './services/reminder';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, CommonModule, DashboardComponent, ReminderFormComponent, ImportComponent, ModalComponent],
  template: `
    <main>
      <h1>Remind Me</h1>
      
      <app-dashboard 
        (createClicked)="showCreateModal = true"
        (importClicked)="showImportModal = true"
        (editClicked)="onEditReminder($event)">
      </app-dashboard>

      <!-- Create Modal -->
      <app-modal [isOpen]="showCreateModal" title="Create New Reminder" (closeEvent)="showCreateModal = false">
        <app-reminder-form (formSubmitted)="showCreateModal = false; reloadDashboard()" (formCancelled)="showCreateModal = false"></app-reminder-form>
      </app-modal>

      <!-- Edit Modal -->
      <app-modal [isOpen]="showEditModal" title="Edit Reminder" (closeEvent)="showEditModal = false">
        <app-reminder-form [reminder]="selectedReminder" (formSubmitted)="showEditModal = false; reloadDashboard()" (formCancelled)="showEditModal = false"></app-reminder-form>
      </app-modal>

      <!-- Import Modal -->
      <app-modal [isOpen]="showImportModal" title="Import from Excel" (closeEvent)="showImportModal = false">
        <app-import (importCompleted)="showImportModal = false; reloadDashboard()"></app-import>
      </app-modal>

      <router-outlet></router-outlet>
    </main>
  `,
  styles: [`
    main { padding: 40px; background-color: var(--background-bg); min-height: 100vh; }
    h1 { color: var(--text-main); margin-bottom: 2rem; font-size: 2rem; }
  `]
})
export class AppComponent {
  title = 'remind-me';
  showCreateModal = false;
  showEditModal = false;
  showImportModal = false;
  selectedReminder: Reminder | null = null;

  @ViewChild(DashboardComponent) dashboard!: DashboardComponent;

  onEditReminder(reminder: Reminder) {
    this.selectedReminder = reminder;
    this.showEditModal = true;
  }

  reloadDashboard() {
    this.dashboard.loadReminders();
  }
}
