import express from 'express';
import { ContactController } from './contact.controller';

const router = express.Router();

router.post('/create-contact', ContactController.createContact);

router.get('/all-contacts', ContactController.getAllContacts);

router.delete('/delete-contact/:id', ContactController.deleteContact);

export const ContactRoutes = router;
