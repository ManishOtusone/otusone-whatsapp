// curl -i -X POST \
//   https://graph.facebook.com/v22.0/622901000913756/messages \
//   -H 'Authorization: Bearer EAANyXsQKtn4BO9TW6jAFGp46RxUFkeZBLjpS1RXJaD7l3GM4RNli9h5ex4stCQqIP6AnZCEXhdsKeqY56ub5Slu8rsqahcmhnXU8zoFc2AHZA58ZBWbQ2B69FbYhjC3PvJoRNz3HNlPlzEKLMZCf0gbZCR9WgoSjJcDQ8Ry9vUaObY57h7D1gG3pSdIaPhlohZAvhWoUz5TS0D3NvZAfGQIAe6kpaWS8' \
//   -H 'Content-Type: application/json' \
//   -d '{ "messaging_product": "whatsapp", "to": "919340312713", "type": "template", "template": { "name": "hello_world", "language": { "code": "en_US" } } }'


 

    <script 
      type="text/javascript"
      src="https://d3mkw6s8thqya7.cloudfront.net/integration-plugin.js"
      id="aisensy-wa-widget"
      widget-id="aaafh7"
    >
    </script>
	
    



  const express = require('express');
  const router = express.Router();
  const WhatsAppWidget = require('../models/waWidget');
  const WhatsAppWidgetCtrl = require('../controllers/widget');
  const { userAuth } = require('../middlewares/auth');
  
  router.get('/button/widget.js', async (req, res) => {
    const { 'widget-id': widgetId } = req.query;
    console.log("widgetId", widgetId)
    if (!widgetId) return res.status(400).send('Missing widget-id');
  
    const widget = await WhatsAppWidget.findOne({ widgetId });
    console.log("widget", widget)
  
    if (!widget) return res.status(404).send('Widget not found');
  
    // const widget = {
    //     phone: "919454197886", 1
    //     message: "Hi", 1
    //     defaultMessage: "Hi,\nHow can I help you?", 1
    //     brandName: "RedAntEduTech", 1
    //     ctaText: "Start chat", 1
    //     buttonColor: "#0A5F54",
    //     position: "bottom-right"
    // }
    res.set('Content-Type', 'application/javascript');
  
    res.send(`
    document.addEventListener("DOMContentLoaded", function () {
      // const existing = document.getElementById('otusone-wa-widget');
      // if (existing) return;
  
      const style = document.createElement('style');
      style.textContent = \`
        .otusone-widget-container {
          position: fixed;
          bottom: 20px;
          ${widget.position === 'bottom-left' ? 'left' : 'right'}: 20px;
          z-index: 999999;
          font-family: sans-serif;
        }
        .otusone-widget-box {
          background: white;
          width: 320px;
          box-shadow: 0 2px 8px rgba(0,0,0,0.15);
          border-radius: 12px;
          overflow: hidden;
          display: none;
          animation: fadeIn 0.3s ease-in-out;
        }
        .otusone-widget-header {
          background: ${widget.buttonColor};
          color: white;
          padding: 16px;
          display: flex;
          align-items: center;
          justify-content: space-between;
        }
        .otusone-widget-header .title {
          font-weight: bold;
          font-size: 16px;
        }
        .otusone-widget-body {
          padding: 16px;
          background: #f5f5f5;
        }
        .otusone-widget-body p {
          background: white;
          padding: 10px 12px;
          border-radius: 12px;
          margin: 0;
        }
        .otusone-widget-footer {
          text-align: center;
          padding: 16px;
        }
        .otusone-widget-footer a {
          background: ${widget.buttonColor};
          color: white;
          padding: 10px 24px;
          border-radius: 24px;
          text-decoration: none;
          display: inline-block;
        }
        .otusone-widget-button {
          background: ${widget.buttonColor};
          border-radius: 15%;
          color:white;
          padding:"5px";
          width: 150px;
          height: 52px;
          display: flex;
          align-items: center;
          justify-content: center;
          box-shadow: 0 2px 8px rgba(0,0,0,0.2);
          cursor: pointer;
          position: relative;
          bottom: 0;
          right: 0;
        }
        @keyframes fadeIn {
          from {opacity: 0;}
          to {opacity: 1;}
        }
      \`;
  
      const container = document.createElement('div');
      container.className = 'otusone-widget-container';
      container.id = 'otusone-wa-widget';
  
      container.innerHTML = \`
        <div class="otusone-widget-box" id="wa-widget-box">
          <div class="otusone-widget-header">
            <div class="title">${widget.brand.name || 'Support'}</div>
            <div class="close-btn" style="cursor:pointer;">✕</div>
          </div>
          <div class="otusone-widget-body">
            <p><strong>${widget.brand.name}</strong><br/>${widget.brand.onScreenMsg}</p>
          </div>
          <div class="otusone-widget-footer">
            <a href="https://wa.me/${widget.phone}?text=${encodeURIComponent(widget.message)}" target="_blank">${widget.brand.widgetCtaText}</a>
          </div>
        </div>
        <div class="otusone-widget-button" id="wa-toggle-btn">
          <img src="https://upload.wikimedia.org/wikipedia/commons/6/6b/WhatsApp.svg" width="28" alt="WA"> Chat with us
        </div>
      \`;
  
      document.head.appendChild(style);
      document.body.appendChild(container);
  
      // Toggle Logic
      const box = document.getElementById('wa-widget-box');
      const toggleBtn = document.getElementById('wa-toggle-btn');
      const closeBtn = container.querySelector('.close-btn');
  
      // Open by default
      box.style.display = 'block';
  
      toggleBtn.onclick = () => {
        box.style.display = box.style.display === 'none' ? 'block' : 'none';
      };
  
      closeBtn.onclick = () => {
        box.style.display = 'none';
      };
    });
  `);
  
  
  });
  
  
  router.post("/create-button", userAuth, WhatsAppWidgetCtrl.createWidget)
  
  module.exports = router;
  