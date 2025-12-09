import { Component, Output, EventEmitter, Input, OnChanges, SimpleChanges } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ReminderService, Reminder } from '../../services/reminder';

@Component({
  selector: 'app-reminder-form',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './reminder-form.html',
  styleUrls: ['./reminder-form.css']
})
export class ReminderFormComponent implements OnChanges {
  @Input() reminder: Reminder | null = null;

  title = '';
  description = '';
  dueDate = '';
  reminderDays: number = 7;
  isActive: boolean = true;
  isRecurring: boolean = false;
  reminderType = 'standard';

  @Output() formSubmitted = new EventEmitter<void>();
  @Output() formCancelled = new EventEmitter<void>();

  constructor(private reminderService: ReminderService) { }

  ngOnChanges(changes: SimpleChanges) {
    if (changes['reminder'] && this.reminder) {
      this.title = this.reminder.title;
      this.description = this.reminder.description || '';
      // Format date for input type="date" (yyyy-MM-dd)
      const date = new Date(this.reminder.due_date);
      this.dueDate = date.toISOString().split('T')[0];

      this.reminderDays = this.reminder.reminder_days_before && this.reminder.reminder_days_before.length > 0
        ? this.reminder.reminder_days_before[0]
        : 7;

      this.isActive = this.reminder.status === 'ACTIVE';
      // Recurrence logic not yet fully in backend model, assume false for now or inferred
    } else {
      this.resetForm();
    }
  }

  onSubmit() {
    if (!this.title || !this.dueDate) return;

    const reminderData = {
      title: this.title,
      description: this.description,
      due_date: new Date(this.dueDate),
      status: this.isActive ? 'ACTIVE' : 'CANCELLED', // Map to valid status
      reminder_days_before: [this.reminderDays]
    };

    if (this.reminder) {
      // Update
      this.reminderService.updateReminder(this.reminder.id, reminderData as Partial<Reminder>).subscribe(() => {
        alert('Reminder Updated!');
        this.formSubmitted.emit();
        this.resetForm();
      });
    } else {
      // Create
      this.reminderService.createReminder(reminderData as any).subscribe(() => {
        alert('Reminder Created!');
        this.formSubmitted.emit();
        this.resetForm();
      });
    }
  }

  onCancel() {
    this.formCancelled.emit();
    this.resetForm();
  }

  private resetForm() {
    this.title = '';
    this.description = '';
    this.dueDate = '';
    this.reminderDays = 7;
    this.isActive = true;
    this.isRecurring = false;
    this.reminder = null;
  }
}
