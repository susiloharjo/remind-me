import { Component, Input, Output, EventEmitter, ElementRef, HostListener, ViewChild } from '@angular/core';
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

    @ViewChild('dropdownContainer') dropdownContainer!: ElementRef;

    showDropdown = false;

    @HostListener('document:click', ['$event'])
    clickout(event: Event) {
        if (this.showDropdown && this.dropdownContainer && !this.dropdownContainer.nativeElement.contains(event.target)) {
            this.showDropdown = false;
        }
    }

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
