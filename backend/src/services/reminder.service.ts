import { PrismaClient, Reminder, ReminderStatus } from '@prisma/client';

const prisma = new PrismaClient();

export class ReminderService {
    async createReminder(data: {
        title: string;
        description?: string;
        due_date: Date;
        reminder_days_before: number[];
    }): Promise<Reminder> {
        return prisma.reminder.create({
            data: {
                title: data.title,
                description: data.description,
                due_date: data.due_date,
                reminder_days_before: data.reminder_days_before,
                status: ReminderStatus.ACTIVE,
            },
        });
    }

    async getReminders(filter?: { status?: ReminderStatus }): Promise<Reminder[]> {
        return prisma.reminder.findMany({
            where: filter,
            orderBy: { due_date: 'asc' },
        });
    }

    async getReminderById(id: string): Promise<Reminder | null> {
        return prisma.reminder.findUnique({
            where: { id },
        });
    }

    async updateReminder(id: string, data: Partial<Reminder>): Promise<Reminder> {
        return prisma.reminder.update({
            where: { id },
            data,
        });
    }

    async deleteReminder(id: string): Promise<Reminder> {
        return prisma.reminder.delete({
            where: { id },
        });
    }

    async deleteReminders(ids: string[]): Promise<void> {
        await prisma.reminder.deleteMany({
            where: {
                id: { in: ids }
            }
        });
    }
}
