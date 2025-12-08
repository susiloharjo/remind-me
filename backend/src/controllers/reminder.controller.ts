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
}
