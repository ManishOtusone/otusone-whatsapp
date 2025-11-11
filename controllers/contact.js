const Contact = require("../models/contact");
const ContactList = require("../models/contactList");
const xlsx = require("xlsx");
const fs = require("fs");
const path = require("path");


exports.addContactManually = async (req, res) => {
  try {
    const { name, whatsAppNumber, tags } = req.body;
    const userId = req.user._id;

    if (!name || !whatsAppNumber) {
      return res.status(400).json({ message: "Name, WhatsApp number, and list name are required." });
    }

    const existingContact = await Contact.findOne({ whatsAppNumber, userId });
    if (existingContact) {
      return res.status(409).json({ message: "Contact with this WhatsApp number already exists." });
    }

    const newContact = new Contact({
      name,
      whatsAppNumber,
      tags,
      userId,
    });

    const savedContact = await newContact.save();
    res.status(201).json({
      message: "Contact added successfully and assigned to the list.",
      contact: savedContact,
    });

  } catch (error) {
    console.error("Add Contact Error:", error);
    res.status(500).json({ message: error?.message || "Internal server error. Please try again later." });
  }
};

exports.importContactsAndSaveToList = async (req, res) => {
  try {
    const { contacts } = req.body;
    const userId = req.user._id;

    if (!Array.isArray(contacts) || contacts.length === 0) {
      return res.status(400).json({ message: "No contacts provided" });
    }

    const whatsAppNumbers = contacts.map(c => c.whatsAppNumber);
    const existingContacts = await Contact.find({
      whatsAppNumber: { $in: whatsAppNumbers },
      userId,
    });

    const existingNumbersSet = new Set(
      existingContacts.map(c => `${c.countryCode}-${c.whatsAppNumber}`)
    );

    const contactsToInsert = contacts
      .filter(c => !existingNumbersSet.has(`${c.countryCode}-${c.whatsAppNumber}`))
      .map(c => ({ ...c, userId }));

    if (contactsToInsert.length === 0) {
      return res.status(200).json({
        message: "No new contacts to import; all contacts already exist.",
        createdCount: 0,
      });
    }

    const savedContacts = await Contact.insertMany(contactsToInsert);

    res.status(200).json({
      message: "Contacts imported and grouped into lists successfully",
      createdCount: savedContacts.length,
    });

  } catch (error) {
    console.error("Import Contacts Error:", error);
    res.status(500).json({
      message: error?.message || "Internal server error. Please try again later",
    });
  }
};

exports.importContactsFromFile = async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ message: "No file uploaded" });
    }

    const filePath = path.join(__dirname, "../uploads", req.file.filename);
    const workbook = xlsx.readFile(filePath);
    const sheetName = workbook.SheetNames[0];
    const data = xlsx.utils.sheet_to_json(workbook.Sheets[sheetName]);

    const userId = req.user._id;

    if (!Array.isArray(data) || data.length === 0) {
      fs.unlinkSync(filePath);
      return res.status(400).json({ message: "Uploaded file is empty or invalid" });
    }

    const identifiers = new Set();
    const fileContacts = [];

    for (const row of data) {
      const { name, whatsAppNumber, countryCode, tags, source } = row;
      if (!whatsAppNumber || !name || !countryCode) continue;

      const id = `${countryCode}-${whatsAppNumber}`;
      identifiers.add(id);

      const formattedTags = typeof tags === "string"
        ? tags.split(",").map(t => t.trim())
        : [];

      fileContacts.push({
        name,
        whatsAppNumber,
        countryCode,
        tags: formattedTags,
        source: source || "IMPORT",
        userId,
        _idStr: id, 
      });
    }

    const existingContacts = await Contact.find({
      userId,
      $or: Array.from(identifiers).map(id => {
        const [countryCode, whatsAppNumber] = id.split("-");
        return { countryCode, whatsAppNumber };
      })
    });

    const existingSet = new Set(
      existingContacts.map(c => `${c.countryCode}-${c.whatsAppNumber}`)
    );

    const contactsToInsert = fileContacts
      .filter(c => !existingSet.has(c._idStr))
      .map(({ _idStr, ...contact }) => contact); // remove _idStr

    let savedContacts = [];
    if (contactsToInsert.length > 0) {
      savedContacts = await Contact.insertMany(contactsToInsert);
    }

    fs.unlinkSync(filePath);

    res.status(200).json({
      message: "Contacts imported from file successfully",
      createdCount: savedContacts.length,
    });
  } catch (error) {
    console.error("Import Contacts File Error:", error);
    res.status(500).json({
      message: error.message || "Internal server error. Please try again later.",
    });
  }
};

exports.getContacts = async (req, res) => {
  try {
    const userId = req.user._id;
    const contacts = await Contact.find({ userId });
    res.status(200).json({ message: "Contact list retrived successfully", contacts });
  } catch (error) {
    console.error("Get Contacts Error:", error);
    res.status(500).json({ message: "Server error" });
  }
};

exports.getContactListsWithContacts = async (req, res) => {
  try {
    const userId = req.user._id;

    const contactLists = await ContactList.find({ userId })
      .populate('contacts')
      .exec();

    res.status(200).json({ message: 'Contact lists fetched successfully', contactLists });
  } catch (error) {
    console.error('Get Contact Lists Error:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
};

exports.updateContact = async (req, res) => {
  try {
    const { contactId } = req.params;
    const { _id: userId } = req.user;
    const updateData = req.body;

    const contact = await Contact.findOne({ _id: contactId, userId });
    if (!contact) {
      return res.status(404).json({ message: 'Contact not found' });
    }

    Object.assign(contact, updateData);
    await contact.save();

    res.status(200).json({ message: 'Contact updated successfully', contact });
  } catch (error) {
    console.error('Update Contact Error:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
};

exports.deleteContact = async (req, res) => {
  try {
    const contactId = req.params.id;
    const userId = req.user._id;

    const contact = await Contact.findOneAndDelete({ _id: contactId, userId });
    if (!contact) {
      return res.status(404).json({ message: 'Contact not found' });
    }

    const ContactList = require('../models/contactList');
    await ContactList.updateMany(
      { userId },
      { $pull: { contacts: contactId } }
    );

    res.status(200).json({ message: 'Contact deleted successfully' });
  } catch (error) {
    console.error('Delete Contact Error:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
};

exports.updateContactList = async (req, res) => {
  try {
    const listId = req.params.id;
    const userId = req.user._id;
    const { name, contacts } = req.body; // contacts = array of contact IDs

    const contactList = await ContactList.findOne({ _id: listId, userId });
    if (!contactList) {
      return res.status(404).json({ message: 'Contact list not found' });
    }

    if (name) contactList.name = name;
    if (contacts) contactList.contacts = contacts;

    await contactList.save();

    res.status(200).json({ message: 'Contact list updated successfully', contactList });
  } catch (error) {
    console.error('Update Contact List Error:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
};

exports.deleteContactList = async (req, res) => {
  try {
    const listId = req.params.id;
    const userId = req.user._id;

    const contactList = await ContactList.findOneAndDelete({ _id: listId, userId });
    if (!contactList) {
      return res.status(404).json({ message: 'Contact list not found' });
    }

    // Optional: Delete contacts in this list as well
    // await Contact.deleteMany({ _id: { $in: contactList.contacts } });

    res.status(200).json({ message: 'Contact list deleted successfully' });
  } catch (error) {
    console.error('Delete Contact List Error:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
};

exports.getAllContactGroups = async (req, res) => {
  try {
    const userId = req.user._id;

    const contactLists = await ContactList.find({ userId }).select('name _id');

    res.status(200).json({
      message: 'Contact groups fetched successfully',
      contactLists
    });
  } catch (error) {
    console.error('Get Contact Groups Error:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
};

exports.getContactListByGroupId = async (req, res) => {
  try {
    const { _id: userId } = req.user;
    const { groupId } = req.params;

    const contactList = await ContactList.findOne({ _id: groupId, userId })
      .populate('contacts');

    if (!contactList) {
      return res.status(404).json({ message: 'Contact list not found' });
    }

    res.status(200).json({
      message: 'Contact list fetched successfully',
      contactList
    });
  } catch (error) {
    console.error('Get Contact List by ID Error:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
};






exports.filterContacts = async (req, res) => {
  try {
    const { optedIn, lastSeen, nameFilter, numberFilter, dateRange } = req.body;
    const query = {};

    // Filter by optedIn (true/false)
    if (typeof optedIn === 'boolean') {
      query.optedIn = optedIn;
    }

    // Filter by lastActive (last seen)
    const now = new Date();
    if (lastSeen === '24h') {
      const dayAgo = new Date(now.getTime() - 24 * 60 * 60 * 1000);
      query.lastActive = { $gte: dayAgo };
    } else if (lastSeen === 'this_week') {
      const startOfWeek = new Date(now);
      startOfWeek.setDate(now.getDate() - now.getDay()); // Sunday
      startOfWeek.setHours(0, 0, 0, 0);
      query.lastActive = { $gte: startOfWeek };
    } else if (lastSeen === 'this_month') {
      const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);
      query.lastActive = { $gte: startOfMonth };
    } else if (lastSeen === 'date_range' && dateRange?.from && dateRange?.to) {
      const fromDate = new Date(dateRange.from);
      const toDate = new Date(dateRange.to);
      query.lastActive = { $gte: fromDate, $lte: toDate };
    }

    // Filter by name with constraint
    if (nameFilter?.value && nameFilter?.operator) {
      const nameRegex = getRegex(nameFilter.value, nameFilter.operator);
      if (nameRegex) query.name = nameRegex;
    }

    // Filter by WhatsApp Number with constraint
    if (numberFilter?.value && numberFilter?.operator) {
      const numberRegex = getRegex(numberFilter.value, numberFilter.operator);
      if (numberRegex) query.whatsAppNumber = numberRegex;
    }

    console.log("query",query)
    const contacts = await Contact.find(query).lean();
    return res.status(200).json({message:"Contact list found successfully", contacts });

  } catch (err) {
    console.error('Filter error:', err);
    return res.status(500).json({ message: 'Failed to filter contacts' });
  }
};

function getRegex(value, operator) {
  switch (operator) {
    case 'contains':
      return { $regex: value, $options: 'i' };
    case 'not_contains':
      return { $not: new RegExp(value, 'i') };
    case 'is':
      return { $regex: `^${value}$`, $options: 'i' };
    case 'is_not':
      return { $not: new RegExp(`^${value}$`, 'i') };
    default:
      return null;
  }
}

