import { Request, Response } from 'express';
import httpStatus from 'http-status-codes';
import catchAsync from '../../utils/catchAsync';
import sendResponse from '../../utils/sendResponse';
import { ContactService } from './contact.service';

const getAllContacts = catchAsync(async (req: Request, res: Response) => {
    const result = await ContactService.getAllContacts();
    sendResponse(res, {
        success: true,
        statusCode: httpStatus.OK,
        message: 'Contacts retrieved successfully',
        data: result,
    });
});

export const createContact = catchAsync(async (req: Request, res: Response) => {
    // Assuming req.body contains the contact details
    const contactData = req.body;
    const newContact = await ContactService.createContact(contactData);

    sendResponse(res, {
        success: true,
        statusCode: httpStatus.CREATED,
        message: 'Contact created successfully',
        data: newContact,
    });
});

export const deleteContact = catchAsync(async (req: Request, res: Response) => {
    const contactId = req.params.id;
    const results = await ContactService.deleteContact(contactId);

    sendResponse(res, {
        success: true,
        statusCode: httpStatus.OK,
        message: 'Contact deleted successfully',
        data: results,
    });
});

export const ContactController = {
    getAllContacts,
    createContact,
    deleteContact,
};
