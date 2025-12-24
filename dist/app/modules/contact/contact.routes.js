"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ContactRoutes = void 0;
const express_1 = __importDefault(require("express"));
const contact_controller_1 = require("./contact.controller");
const router = express_1.default.Router();
router.post('/create-contact', contact_controller_1.ContactController.createContact);
router.get('/all-contacts', contact_controller_1.ContactController.getAllContacts);
router.delete('/delete-contact/:id', contact_controller_1.ContactController.deleteContact);
exports.ContactRoutes = router;
