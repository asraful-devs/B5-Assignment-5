import { Contact } from './contact.model';

const getAllContacts = async () => {
    const results = await Contact.find();
    return results;
};

const createContact = async (contactData: Partial<typeof Contact>) => {
    const newContact = await Contact.create(contactData);
    return newContact;
};

const deleteContact = async (contactId: string) => {
    const result = await Contact.findByIdAndDelete(contactId);
    return result;
};

export const ContactService = {
    getAllContacts,
    createContact,
    deleteContact,
};
