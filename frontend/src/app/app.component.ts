import { Component, ViewChild, OnInit, ChangeDetectorRef } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { CommonModule } from '@angular/common';
import { DashboardComponent } from './components/dashboard/dashboard';
import { ReminderFormComponent } from './components/reminder-form/reminder-form';
import { ImportComponent } from './components/import/import';
import { ModalComponent } from './components/modal/modal';
import { NavbarComponent } from './components/navbar/navbar';
import { Reminder, ReminderService } from './services/reminder';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, CommonModule, DashboardComponent, ReminderFormComponent, ImportComponent, ModalComponent, NavbarComponent],
  template: `
    <app-navbar 
      [notificationCount]="notificationCount" 
      [overdueReminders]="overdueReminders" 
      (alertClicked)="onAlert()"
      (reminderClicked)="onEditReminder($event)">
    </app-navbar>
    <main>
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
    main { padding: 100px 40px 40px 40px; background-color: var(--background-bg); min-height: 100vh; }
    h1 { color: var(--text-main); margin-bottom: 2rem; font-size: 2rem; }
  `]
})
export class AppComponent implements OnInit {
  title = 'remind-me';
  showCreateModal = false;
  showEditModal = false;
  showImportModal = false;
  selectedReminder: Reminder | null = null;


  @ViewChild(DashboardComponent) dashboard!: DashboardComponent;

  overdueReminders: Reminder[] = [];
  get notificationCount(): number {
    return this.overdueReminders.length;
  }

  constructor(
    private reminderService: ReminderService,
    private cd: ChangeDetectorRef
  ) { }

  ngOnInit() {
    this.checkOverdue();
  }

  onEditReminder(reminder: Reminder) {
    this.selectedReminder = reminder;
    this.showEditModal = true;
  }

  reloadDashboard() {
    this.dashboard.loadReminders();
    this.checkOverdue(); // Re-check overdue status when data changes
  }

  onAlert() {
    // Dropdown handled by Navbar component internal state for now
  }

  private checkOverdue() {
    this.reminderService.getReminders().subscribe(reminders => {
      const today = new Date();
      today.setHours(0, 0, 0, 0);

      this.overdueReminders = reminders.filter(r => {
        if (r.status !== 'ACTIVE') return false;

        const due = new Date(r.due_date);
        due.setHours(0, 0, 0, 0);

        const diffTime = due.getTime() - today.getTime();
        const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

        // 1. Overdue
        if (diffDays < 0) return true;

        // 2. Due Today
        if (diffDays === 0) return true;

        // 3. Within Remind Before window (e.g. 3 days left, remind 7 days before -> 3 <= 7 -> Show)
        if (r.reminder_days_before && r.reminder_days_before.some(days => diffDays <= days)) {
          return true;
        }

        return false;
      });

      this.cd.detectChanges();
    });
  }
}
