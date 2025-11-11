const axios = require('axios');
const User = require('../models/user');

exports.getTemplates = async (req, res) => {
  try {
    const user = await User.findById(req.user.id);
    const { whatsappBusinessAccountId: wabaId, metaAccessToken } = user;

    // const wabaId="1282998630189193"
    // const metaAccessToken="EAANyXsQKtn4BO4CXJtYccNU2CLnZBy2Ov8vhJJPzpXk6Ewkbl8xXEoucmoMybES8MFcPKvEMVAQm41Ecv0oSZAiZCUZB0WnE74YZB54ZBtKNvjhLmIyMtCL3GI8eaq2DN402pH7SDmwDuBBZAZBX4p6cP1lgy17z8rqXSvBLDZATyXjTiQfwI4Pmgehf7WeGmZAtsu90xtlqz9qB22vkJ9I45YTAPXAn0ZD"


    const result = await axios.get(`https://graph.facebook.com/v19.0/${wabaId}/message_templates`, {
      params: {
        access_token: metaAccessToken,
        fields: 'id,name,status,category,language,components,createdAt,updatedAt,sampleMediaUrl,sampleMessage,format,callToAction,quickReplies',
        // limit: 100 
      }
    });

    res.status(200).json({message:"Template retrived succussfully",templates: result.data.data});
  } catch (error) {
    console.error(error.response?.data || error.message);
    res.status(500).json({ message:error?.message || 'Failed to fetch templates. Please Try gaian later' });
  }
};

exports.getTemplateById = async (req, res) => {
  try {
    const { templateId } = req.params;
    const user = await User.findById(req.user.id);

    if (!templateId) {
      return res.status(400).json({ message: 'Template ID is required' });
    }
    const { metaAccessToken } = user;
    const response = await axios.get(`https://graph.facebook.com/v19.0/${templateId}`, {
      params: {
        access_token: metaAccessToken,
        // fields: 'id,name,status,category,language,components,created_time,updated_time,sampleMediaUrl,sampleMessage,format,callToAction,quickReplies'
      }
    });

    res.status(200).json({
      message: 'Template retrieved successfully',
      template: response.data
    });
  } catch (error) {
    console.error(error.response?.data || error.message);
    res.status(500).json({
      message: error?.response?.data?.error?.message || 'Failed to fetch template. Please try again later.'
    });
  }
};


exports.createTemplate = async (req, res) => {
  try {
    const user = await User.findById(req.user.id);
    const { whatsappBusinessAccountId: wabaId, metaAccessToken } = user;
    const { name, category, language, components } = req.body;

    const payload = { name, category, language, components };

    console.log("payload",payload) 

    const response = await axios.post(
      `https://graph.facebook.com/v19.0/${wabaId}/message_templates`,
      payload,
      { headers: { Authorization: `Bearer ${metaAccessToken}` } }
    );

    res.status(201).json({message:"Tempalate submitted successfully", template: response.data});
  } catch (error) {
    console.error(error.response?.data || error.message);
    res.status(500).json({ message:error?.message || 'Template submission failed. Please try again later',error });
  }
};


exports.deleteTemplate = async (req, res) => {
  try {
    const user = await User.findById(req.user.id);
    const { whatsappBusinessAccountId: wabaId, metaAccessToken } = user;
    const { hsm_id, name } = req.query;

    if (!hsm_id || !name) {
      return res.status(400).json({ message: "Both 'hsm_id' and 'name' query parameters are required" });
    }

    const url = `https://graph.facebook.com/v19.0/${wabaId}/message_templates?hsm_id=${hsm_id}&name=${name}`;

    const response = await axios.delete(url, {
      headers: {
        Authorization: `Bearer ${metaAccessToken}`
      }
    });

    res.status(200).json({
      message: 'Template deleted successfully',
      data: response.data
    });
  } catch (error) {
    console.error(error.response?.data || error.message);
    res.status(500).json({
      message: 'Failed to delete template',
      error: error.response?.data || error.message
    });
  }
};
