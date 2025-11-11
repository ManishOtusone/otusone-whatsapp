
const User = require("../models/user");
const Contact = require("../models/contact");
const Message = require("../models/message");
const axios = require('axios');
const { Parser } = require('json2csv');


exports.sendMessageToCustomer = async (req, res) => {
  try {
    const { contactId, message } = req.body;
    const user = await User.findById(req.user._id);
    const contact = await Contact.findById(contactId);
    console.log("contact", contact.whatsAppNumber);
    const payload = {
      messaging_product: "whatsapp",
      to: contact.whatsAppNumber,
      type: "text",
      text: { body: message },
    };


    const response = await axios.post(`https://graph.facebook.com/v19.0/${user.phoneNumberId}/messages`, payload, {
      headers: {
        Authorization: `Bearer ${user.metaAccessToken}`,
        "Content-Type": "application/json",
      },
    });

    console.log("response", response?.data);
    console.log("response", response?.data?.messages);
    const messageId = response?.data?.messages[0]?.id;
    const savedMessage = await Message.create({
      userId: user._id,
      messageId: messageId,
      contactId,
      direction: "outbound",
      message,
      timestamp: new Date(),
    });

    if (global._io) {
      global._io.to(contactId).emit("new_message", savedMessage);
    }

    res.status(200).json({ success: true, message: savedMessage });
  } catch (error) {
    console.error("Send message error:", error);
    res.status(500).json({ message: error?.message || "Failed to send message" });
  }
};

exports.getMessages = async (req, res) => {
  try {
    const { contactId } = req.params;
    const messages = await Message.find({ contactId }).sort({ createdAt: 1 });

    res.status(200).json({ message: "All message retrived successfully", messages });
  } catch (error) {
    console.error("Send message error:", error);
    res.status(500).json({ message: error?.message || "Failed to send message" });
  }

};

exports.userMessageWebHooks = (req, res) => {
  const body = req.body;

  console.log("Webhook received:", JSON.stringify(body, null, 2));

  if (body?.entry) {
    body.entry.forEach((entry) => {
      const changes = entry.changes;
      changes.forEach((change) => {
        const value = change.value;
        const messages = value.messages;
        const statuses = value.statuses;

        if (messages) {
          // Customer sent a message
          const message = messages[0];
          const from = message.from;
          const text = message.text?.body;

          // Save it to DB, then emit via Socket.IO
          const msgObj = {
            contactId: from,
            message: text,
            direction: "inbound",
            createdAt: new Date(),
          };

          // Save to DB, then:
          global._io.to(from).emit('new_message', msgObj);
        }

        if (statuses) {
          // Message status update
          const status = statuses[0];
          console.log("Message status update:", status.status); // delivered, read, etc.
        }
      });
    });
  }

  res.sendStatus(200);
};

exports.getUserMessageStats = async (req, res) => {
  try {
    const { _id: userId } = req.user;
    const { startDate, endDate, range } = req.query;

    let dateFilter = {};

    if (range === 'last7days') {
      const from = new Date();
      from.setDate(from.getDate() - 7);
      dateFilter.createdAt = { $gte: from };
    } else if (range === 'last30days') {
      const from = new Date();
      from.setDate(from.getDate() - 30);
      dateFilter.createdAt = { $gte: from };
    } else if (startDate && endDate) {
      dateFilter.createdAt = {
        $gte: new Date(startDate),
        $lte: new Date(endDate),
      };
    }
 const baseMatch = {
      userId,
      ...dateFilter,
    };
    const statusStats = await Message.aggregate([
      { $match: { ...baseMatch, direction: 'outbound' } },
      {
        $group: {
          _id: '$status',
          count: { $sum: 1 },
        },
      },
    ]);


    const result = {
      sent: 0,
      delivered: 0,
      failed: 0,
      read: 0,
    };

    statusStats.forEach(stat => {
      result[stat._id] = stat.count;
    });

    const totalSent = await Message.countDocuments({
      ...baseMatch,
      direction: 'outbound',
    });

    const totalReplies = await Message.countDocuments({
      ...baseMatch,
      direction: 'inbound',
      replyToMessageId: { $exists: true },
    });

    // Seen count (if tracking seen messages)
    const totalSeen = await Message.countDocuments({
      ...baseMatch,
      seen: true,
    });

    res.json({
      totalSent,
      ...result,
      replied: totalReplies,
      seen: totalSeen,
    });
  } catch (error) {
    console.error('Error getting message stats:', error);
    res.status(500).json({ message: error.message || 'Internal server error' });
  }
};

exports.getMessageTrends = async (req, res) => {
  const { _id: userId } = req.user;
  try {
    const trends = await Message.aggregate([
      { $match: { userId } },
      {
        $group: {
          _id: {
            $dateToString: { format: "%Y-%m-%d", date: "$timestamp" }
          },
          count: { $sum: 1 }
        }
      },
      { $sort: { "_id": 1 } }
    ]);
    res.status(200).json(trends.map(t => ({ date: t._id, count: t.count })));
  } catch (error) {
    console.error("Error in getMessageTrends:", error);
    res.status(500).json({ message: "Failed to fetch message trends", error: error.message });
  }
};

exports.getTopContacts = async (req, res) => {
  const { _id: userId } = req.user;
  try {
    const data = await Message.aggregate([
      { $match: { userId } },
      {
        $group: {
          _id: "$contactId",
          count: { $sum: 1 }
        }
      },
      { $sort: { count: -1 } },
      { $limit: 5 },
      {
        $lookup: {
          from: "contacts",
          localField: "_id",
          foreignField: "_id",
          as: "contact"
        }
      },
      { $unwind: "$contact" },
      {
        $project: {
          _id: 0,
          contactName: "$contact.name",
          contactNumber: "$contact.whatsAppNumber",
          count: 1
        }
      }
    ]);
    res.status(200).json(data);
  } catch (error) {
    console.error("Error in getTopContacts:", error);
    res.status(500).json({ message: "Failed to fetch top contacts", error: error.message });
  }
};

exports.exportMessagesCsv = async (req, res) => {
  const { _id: userId } = req.user;
  const messages = await Message.find({ userId }).lean();

  const fields = ["timestamp", "direction", "message", "status", "contactId"];
  const parser = new Parser({ fields });
  const csv = parser.parse(messages);

  res.header("Content-Type", "text/csv");
  res.attachment("messages.csv");
  res.send(csv);
};
