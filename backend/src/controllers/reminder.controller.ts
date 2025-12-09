import { Request, Response } from 'express';
import { ReminderService } from '../services/reminder.service';
import { ReminderStatus } from '@prisma/client';

const reminderService = new ReminderService();

export class ReminderController {
    async create(req: Request, res: Response) {
        try {
            const { title, description, due_date, reminder_days_before } = req.body;
            const reminder = await reminderService.createReminder({
                title,
                description,
                due_date: new Date(due_date),
                reminder_days_before: reminder_days_before || [1, 7, 30],
            });
            res.status(201).json(reminder);
        } catch (error) {
            res.status(500).json({ error: 'Failed to create reminder' });
        }
    }

    async getAll(req: Request, res: Response) {
        try {
            const status = req.query.status as ReminderStatus;
            const reminders = await reminderService.getReminders(status ? { status } : undefined);
            res.json(reminders);
        } catch (error) {
            res.status(500).json({ error: 'Failed to fetch reminders' });
        }
    }

    async getOne(req: Request, res: Response) {
        try {
            const reminder = await reminderService.getReminderById(req.params.id);
            if (!reminder) {
                return res.status(404).json({ error: 'Reminder not found' });
            }
            res.json(reminder);
        } catch (error) {
            res.status(500).json({ error: 'Failed to fetch reminder' });
        }
    }

    async update(req: Request, res: Response) {
        try {
            const reminder = await reminderService.updateReminder(req.params.id, req.body);
            res.json(reminder);
        } catch (error) {
            res.status(500).json({ error: 'Failed to update reminder' });
        }
    }

    async delete(req: Request, res: Response) {
        try {
            await reminderService.deleteReminder(req.params.id);
            res.status(204).send();
        } catch (error) {
            res.status(500).json({ error: 'Failed to delete reminder' });
        }
    }

    async deleteBatch(req: Request, res: Response) {
        try {
            const { ids } = req.body;
            if (!Array.isArray(ids) || ids.length === 0) {
                return res.status(400).json({ error: 'No IDs provided' });
            }
            await reminderService.deleteReminders(ids);
            res.status(204).send();
        } catch (error) {
            res.status(500).json({ error: 'Failed to delete reminders' });
        }
    }
    async import(req: Request, res: Response) {
        try {
            if (!req.file) {
                return res.status(400).json({ error: 'No file uploaded' });
            }

            const XLSX = require('xlsx');
            const workbook = XLSX.read(req.file.buffer, { type: 'buffer' });
            const sheetName = workbook.SheetNames[0];
            const sheet = workbook.Sheets[sheetName];
            const data = XLSX.utils.sheet_to_json(sheet, { raw: false });
            console.log(`[Import] Parsed ${data.length} rows from uploaded file.`);

            let createdCount = 0;

            for (const [index, row] of (data as any[]).entries()) {
                // Map fields checking both case variations if needed, or assume template headers
                // Headers: Title, Description, DueDate (YYYY-MM-DD), Days Before Due
                const title = row['Title'] || row['title'];
                const description = row['Description'] || row['description'];
                const dueDateStr = row['DueDate (YYYY-MM-DD)'] || row['DueDate'] || row['due_date'];

                console.log(`[Import] Row ${index + 1}: Title="${title}", DueDate="${dueDateStr}"`);

                // Collect reminder days from single column
                const days: number[] = [];
                const val = row['Days Before Due'] || row['DaysBeforeDue'] || row['reminder_days_before'];

                if (val !== undefined && val !== null && val !== '') {
                    const num = parseInt(val);
                    if (!isNaN(num)) {
                        days.push(num);
                    }
                }

                // Fallback / Default
                if (days.length === 0) {
                    days.push(7); // Default to 7 days if missing
                }

                if (title && dueDateStr) {
                    await reminderService.createReminder({
                        title,
                        description,
                        due_date: new Date(dueDateStr),
                        reminder_days_before: days,
                    });
                    createdCount++;
                } else {
                    console.log(`[Import] Skipping row ${index + 1} due to missing title or due_date`);
                }
            }

            console.log(`[Import] Successfully created ${createdCount} reminders.`);
            res.status(201).json({ message: `Successfully imported ${createdCount} reminders` });
        } catch (error) {
            console.error(error);
            res.status(500).json({ error: 'Failed to import reminders' });
        }
    }
}
