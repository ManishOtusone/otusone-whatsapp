const WhatsAppWidget = require("../models/waWidget");
// const { nanoid } = require("nanoid");

exports.createWidget = async (req, res) => {
  try {
    const { nanoid } = await import('nanoid');
    const { phone, ctaText, buttonColor, position, message, brand } = req.body;

    const widget = await WhatsAppWidget.create({
      userId: req.user._id,
      widgetId: nanoid(6),
      phone,
      ctaText,
      buttonColor,
      position,
      message,
      brand,
    });

    const script = `<script 
  type="text/javascript" 
  src="${process.env.BASE_URL}/button/widget.js?widget-id=${widget.widgetId}" 
  id="otusone-wa-widget"
  widget-id="${widget.widgetId}"></script>`;
  
    res.status(201).json({ message: "WhatsApp button script generated successfully", script, widgetId: widget.widgetId });
  } catch (error) {
    return res.status(500).json({ message: error?.message || 'Failed to send message' });
  }
};


exports.trackWidget = async (req, res) => {
  const { widgetId } = req.params;
  const { event } = req.body;
  // Store in a WidgetAnalytics collection, or increment counters
  res.status(200).json({ success: true });
};
