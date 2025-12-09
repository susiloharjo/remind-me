import { Component, Input, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Reminder } from '../../services/reminder';

@Component({
    selector: 'app-navbar',
    standalone: true,
    imports: [CommonModule],
    templateUrl: './navbar.html',
    styleUrls: ['./navbar.css']
})
export class NavbarComponent {
    @Input() notificationCount = 0;
    @Input() overdueReminders: Reminder[] = [];
    @Output() alertClicked = new EventEmitter<void>();
    @Output() reminderClicked = new EventEmitter<Reminder>();

    showDropdown = false;

    onAlertClick() {
        this.showDropdown = !this.showDropdown;
        this.alertClicked.emit();
    }

    onReminderClick(reminder: Reminder) {
        this.reminderClicked.emit(reminder);
        this.showDropdown = false; // Close dropdown after selection
    }

    closeDropdown() {
        this.showDropdown = false;
    }
}
