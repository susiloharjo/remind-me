import { Component, OnInit, Output, EventEmitter, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReminderService, Reminder } from '../../services/reminder';

@Component({
    selector: 'app-dashboard',
    standalone: true,
    imports: [CommonModule],
    templateUrl: './dashboard.html',
    styleUrls: ['./dashboard.css']
})
export class DashboardComponent implements OnInit {
    reminders: Reminder[] = [];

    @Output() createClicked = new EventEmitter<void>();
    @Output() importClicked = new EventEmitter<void>();
    @Output() editClicked = new EventEmitter<Reminder>();

    constructor(
        private reminderService: ReminderService,
        private cd: ChangeDetectorRef
    ) { }

    ngOnInit() {
        this.loadReminders();
    }

    onCreate() {
        this.createClicked.emit();
    }

    onImport() {
        this.importClicked.emit();
    }

    onEdit(reminder: Reminder) {
        this.editClicked.emit(reminder);
    }

    onDelete(reminder: Reminder) {
        if (confirm(`Are you sure you want to delete "${reminder.title}"?`)) {
            this.reminderService.deleteReminder(reminder.id).subscribe(() => {
                this.loadReminders();
            });
        }
    }

    loadReminders() {
        this.reminderService.getReminders().subscribe(data => {
            this.reminders = data;
            this.cd.detectChanges();
        });
    }

    // Pagination
    currentPage = 1;
    itemsPerPage = 10;

    get paginatedReminders(): Reminder[] {
        const startIndex = (this.currentPage - 1) * this.itemsPerPage;
        return this.reminders.slice(startIndex, startIndex + this.itemsPerPage);
    }

    get totalPages(): number {
        return Math.ceil(this.reminders.length / this.itemsPerPage);
    }

    get pages(): number[] {
        return Array(this.totalPages).fill(0).map((x, i) => i + 1);
    }

    nextPage() {
        if (this.currentPage < this.totalPages) {
            this.currentPage++;
        }
    }

    prevPage() {
        if (this.currentPage > 1) {
            this.currentPage--;
        }
    }

    goToPage(page: number) {
        this.currentPage = page;
    }


    // Selection
    selectedIds: Set<string> = new Set();

    toggleSelection(id: string) {
        if (this.selectedIds.has(id)) {
            this.selectedIds.delete(id);
        } else {
            this.selectedIds.add(id);
        }
    }

    toggleAll(event: any) {
        if (event.target.checked) {
            this.reminders.forEach(r => this.selectedIds.add(r.id));
        } else {
            this.selectedIds.clear();
        }
    }

    isSelected(id: string): boolean {
        return this.selectedIds.has(id);
    }

    getSelectedReminder(): Reminder {
        const id = Array.from(this.selectedIds)[0];
        return this.reminders.find(r => r.id === id)!;
    }

    get allSelected(): boolean {
        return this.reminders.length > 0 && this.selectedIds.size === this.reminders.length;
    }

    deleteSelected() {
        if (this.selectedIds.size === 0) return;

        if (confirm(`Are you sure you want to delete ${this.selectedIds.size} reminders?`)) {
            const ids = Array.from(this.selectedIds);
            this.reminderService.deleteReminders(ids).subscribe(() => {
                this.selectedIds.clear(); // Clear selection after delete
                this.loadReminders();
            });
        }
    }

    // Helpers
    getDaysRemaining(dueDate: Date): number {
        const today = new Date();
        const due = new Date(dueDate);
        const diffTime = due.getTime() - today.getTime();
        return Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    }

    getStatusClass(reminder: Reminder): string {
        if (reminder.status === 'COMPLETED') return 'status-completed';
        if (reminder.status === 'CANCELLED') return 'status-cancelled';
        const days = this.getDaysRemaining(reminder.due_date);
        if (days < 0) return 'status-overdue';
        if (days <= 7) return 'status-urgent';
        return 'status-active';
    }

    getDaysClass(reminder: Reminder): string {
        const days = this.getDaysRemaining(reminder.due_date);
        if (days < 0) return 'text-danger';
        if (days <= 7) return 'text-warning'; // You can define text-warning if needed
        return '';
    }
}
