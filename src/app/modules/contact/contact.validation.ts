import z, { string } from 'zod';

export const ContactZodSchema = z.object({
    name: string().min(2, {
        message: 'Name must be at least 2 characters long.',
    }),
    email: string().email({ message: 'Invalid email address.' }),
    subject: string().min(5, {
        message: 'Subject must be at least 5 characters long.',
    }),
    message: string().min(10, {
        message: 'Message must be at least 10 characters long.',
    }),
});
