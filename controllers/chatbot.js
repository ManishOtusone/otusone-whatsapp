const Chatbot = require('../models/chatbot');
const { sendWhatsAppChatbotMessage } = require('../utils/chatbotMessage');

exports.saveChatbot = async (req, res) => {
  try {
    const { _id: userId, phoneNumberId, waPhoneNumberId } = req.user;
    const { name, description, type, nodes, edges, metadata, triggers } = req.body;

    if (!userId || !name || !nodes?.length || !edges) {
      return res.status(400).json({ message: 'Missing required fields.' });
    }

    // Transform nodes to fit NodeSchema
    const transformedNodes = nodes.map(node => ({
      id: node.id,
      type: node.type,
      position: node.position,
      data: {
        label: node.label,
        description: node.description,
        icon: node.icon || null,
        type: node.type || null,
        buttons: node.buttons || [],
        inputs: node.field || {},
        outputs: {}, // you can customize if needed
        settings: {}, // you can customize if needed
        meta: {}
      },
      style: node.style || {},
      parentNode: node.parentNode || null,
      draggable: node.draggable ?? true,
      deletable: node.deletable ?? true,
      selectable: node.selectable ?? true
    }));

    let chatbot = await Chatbot.findOne({ userId, name });

    if (chatbot) {
      chatbot.description = description;
      chatbot.type = type || 'basic';
      chatbot.nodes = transformedNodes;
      chatbot.edges = edges;
      chatbot.metadata = metadata || chatbot.metadata;
      chatbot.triggers = triggers || chatbot.triggers;
      chatbot.updatedAt = Date.now();

      await chatbot.save();

      return res.status(200).json({
        message: 'Chatbot updated successfully',
        chatbot
      });
    }

    chatbot = new Chatbot({
      userId,
      phoneNumberId,
      waPhoneNumberId: phoneNumberId,
      name,
      description,
      type,
      nodes: transformedNodes,
      edges,
      metadata,
      triggers
    });

    await chatbot.save();

    return res.status(201).json({
      message: 'Chatbot created successfully',
      chatbot
    });

  } catch (error) {
    console.error('Error saving chatbot:', error);
    return res.status(500).json({ message: error.message || 'Server error' });
  }
};

exports.updateChatbot = async (req, res) => {
  try {
    const { _id: userId, phoneNumberId } = req.user;
    const { chatbotId } = req.params;
    const { name, description, type, nodes, edges, metadata, triggers } = req.body;

    if (!userId || !chatbotId) {
      return res.status(400).json({ message: 'Missing user or chatbot ID.' });
    }

    const chatbot = await Chatbot.findOne({ _id: chatbotId, userId });
    if (!chatbot) {
      return res.status(404).json({ message: 'Chatbot not found' });
    }

    // Transform nodes if present
    const transformedNodes = nodes?.map(node => ({
      id: node.id,
      type: node.type,
      position: node.position,
      data: {
        label: node.label,
        description: node.description,
        icon: node.icon || null,
        type: node.type || null,
        buttons: node.buttons || [],
        inputs: node.field || {},
        outputs: {},
        settings: {},
        meta: {}
      },
      style: node.style || {},
      parentNode: node.parentNode || null,
      draggable: node.draggable ?? true,
      deletable: node.deletable ?? true,
      selectable: node.selectable ?? true
    }));

    // Apply updates
    chatbot.name = name ?? chatbot.name;
    chatbot.description = description ?? chatbot.description;
    chatbot.type = type ?? chatbot.type;
    if (nodes) chatbot.nodes = transformedNodes;
    if (edges) chatbot.edges = edges;
    if (metadata) chatbot.metadata = metadata;
    if (triggers) chatbot.triggers = triggers;
    chatbot.updatedAt = Date.now();

    await chatbot.save();

    return res.status(200).json({
      message: 'Chatbot updated successfully',
      chatbot
    });

  } catch (error) {
    console.error('Error updating chatbot:', error);
    return res.status(500).json({ message: error.message || 'Server error' });
  }
};

exports.deleteChatbot = async (req, res) => {
  try {
    const { _id: userId } = req.user;
    const { chatbotId } = req.params;

    if (!userId || !chatbotId) {
      return res.status(400).json({ message: 'Missing user or chatbot ID.' });
    }

    const chatbot = await Chatbot.findOneAndDelete({ _id: chatbotId, userId });

    if (!chatbot) {
      return res.status(404).json({ message: 'Chatbot not found or already deleted.' });
    }

    return res.status(200).json({
      message: 'Chatbot deleted successfully.',
      chatbot
    });

  } catch (error) {
    console.error('Error deleting chatbot:', error);
    return res.status(500).json({ message: error.message || 'Server error' });
  }
};

exports.validateChatbotName = async (req, res) => {
  try {
    const { _id: userId } = req.user;
    const { name } = req.body;

    console.log("userId", userId);
    console.log("name", name);

    if (!userId || !name) {
      return res.status(400).json({ message: 'userId and name are required' });
    }

    const existing = await Chatbot.findOne({ userId, name });

    if (existing) {
      return res.status(200).json({ isValid: false, message: 'Chatbot name already exists' });
    }

    return res.status(200).json({ isValid: true, message: 'Chatbot name is available' });
  } catch (error) {
    console.error('Error validating chatbot name:', error);
    return res.status(500).json({ message: error.message || 'Server error' });
  }
};

exports.getAllChatbots = async (req, res) => {
  try {
    const { _id: userId } = req.user;
    if (!userId) {
      return res.status(401).json({ message: 'Unauthorized' });
    }

    const chatbots = await Chatbot.find({ userId }).sort({ updatedAt: -1 });

    return res.status(200).json({
      message: 'Chatbots fetched successfully',
      chatbots
    });

  } catch (error) {
    console.error('Error fetching chatbots:', error);
    return res.status(500).json({ message: error.message || 'Server error' });
  }
};

exports.getChatbotsById = async (req, res) => {
  try {
    const { _id: userId } = req.user;
    const { chatbotId } = req.params;
    const chatbot = await Chatbot.findOne({ userId, _id: chatbotId });
    return res.status(200).json({
      message: 'Chatbot fetched successfully',
      chatbot
    });

  } catch (error) {
    console.error('Error fetching chatbots:', error);
    return res.status(500).json({ message: error.message || 'Server error' });
  }
};

exports.findChatBotAndSendMessage = async (req, res) => {
  try {
    const { _id: userId, phoneNumberId, metaAccessToken } = req.user;
    const chatbot = await Chatbot.findOne({
      userId,
      waPhoneNumberId: phoneNumberId,
      'metadata.status': 'active',
    });
    // console.log("chatbot", chatbot);
    const startNode = chatbot.nodes.find((n) => n.data?.type === 'triggerChatbot');
    // console.log("startNode",startNode)
    const response = startNode?.data?.description || '[No response configured]';
    console.log("response", response)
    const message = await sendWhatsAppChatbotMessage("+919454197886", response, phoneNumberId, metaAccessToken);
    console.log("message", message)

    res.status(200).json({ message: "chatboat found successsfully", chatbot })
  } catch (error) {
    return res.status(500).json({ message: error.message || 'Server error' });
  }
}