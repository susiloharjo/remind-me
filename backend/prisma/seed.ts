import { PrismaClient, ReminderStatus } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
    console.log('Start seeding ...');

    const reminders = [
        {
            title: 'Domain Renewal - starbit.id',
            description: 'Renew domain name via registry',
            due_date: new Date('2025-02-15'),
            status: ReminderStatus.ACTIVE,
            reminder_days_before: [1, 7, 30],
        },
        {
            title: 'Server Payment - DigitalOcean',
            description: 'Monthly droplet payment',
            due_date: new Date('2025-01-05'),
            status: ReminderStatus.ACTIVE,
            reminder_days_before: [1, 3],
        },
        {
            title: 'SSL Certificate Expiry',
            description: 'Update SSL for api.starbit.id',
            due_date: new Date('2024-12-20'),
            status: ReminderStatus.ACTIVE,
            reminder_days_before: [1, 7],
        },
        {
            title: 'Office Rent',
            description: 'Yearly office rent payment',
            due_date: new Date('2024-12-01'),
            status: ReminderStatus.COMPLETED,
            reminder_days_before: [30],
        },
        {
            title: 'Meeting with Client',
            description: 'Discuss Q1 Roadmap',
            due_date: new Date('2024-12-15'),
            status: ReminderStatus.ACTIVE,
            reminder_days_before: [1],
        }
    ];

    for (const r of reminders) {
        const reminder = await prisma.reminder.create({
            data: r,
        });
        console.log(`Created reminder with id: ${reminder.id}`);
    }

    console.log('Seeding finished.');
}

main()
    .catch((e) => {
        console.error(e);
        process.exit(1);
    })
    .finally(async () => {
        await prisma.$disconnect();
    });
