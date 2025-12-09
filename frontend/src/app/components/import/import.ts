import { Component, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';

import { ReminderService } from '../../services/reminder';

@Component({
    selector: 'app-import',
    standalone: true,
    imports: [CommonModule],
    templateUrl: './import.html',
    styleUrls: ['./import.css']
})
export class ImportComponent {
    @Output() importCompleted = new EventEmitter<void>();
    selectedFile: File | null = null;
    dragging = false;

    onDragOver(event: DragEvent) {
        event.preventDefault();
        this.dragging = true;
    }

    onDragLeave(event: DragEvent) {
        event.preventDefault();
        this.dragging = false;
    }

    onDrop(event: DragEvent) {
        event.preventDefault();
        this.dragging = false;
        if (event.dataTransfer?.files.length) {
            this.selectedFile = event.dataTransfer.files[0];
        }
    }

    onFileSelected(event: any) {
        if (event.target.files.length) {
            this.selectedFile = event.target.files[0];
        }
    }

    constructor(private reminderService: ReminderService) { }

    onUpload() {
        if (!this.selectedFile) return;

        this.reminderService.importReminders(this.selectedFile).subscribe({
            next: (res) => {
                alert(res.message || 'Import Successful!');
                this.selectedFile = null;
                this.importCompleted.emit();
            },
            error: (err) => {
                alert('Import Failed');
                console.error(err);
            }
        });
    }

    downloadTemplate() {
        const headers = ['Title', 'Description', 'DueDate (YYYY-MM-DD)', 'Days Before Due'];
        const data = [
            ['Sample Reminder', 'Description here', '2025-01-01', 7]
        ];

        import('xlsx').then(XLSX => {
            const resultData = [headers, ...data];
            const ws = XLSX.utils.aoa_to_sheet(resultData);
            const wb = XLSX.utils.book_new();
            XLSX.utils.book_append_sheet(wb, ws, 'Template');
            XLSX.writeFile(wb, 'remind_me_template.xlsx');
        });
    }
}
