"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ContactService = void 0;
const contact_model_1 = require("./contact.model");
const getAllContacts = () => __awaiter(void 0, void 0, void 0, function* () {
    const results = yield contact_model_1.Contact.find();
    return results;
});
const createContact = (contactData) => __awaiter(void 0, void 0, void 0, function* () {
    const newContact = yield contact_model_1.Contact.create(contactData);
    return newContact;
});
const deleteContact = (contactId) => __awaiter(void 0, void 0, void 0, function* () {
    const result = yield contact_model_1.Contact.findByIdAndDelete(contactId);
    return result;
});
exports.ContactService = {
    getAllContacts,
    createContact,
    deleteContact,
};
