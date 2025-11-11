const express = require('express');
const router = express.Router();
const WhatsAppWidget = require('../models/waWidget');
const WhatsAppWidgetCtrl = require('../controllers/widget');
const { userAuth } = require('../middlewares/auth');

// const widget = {
//   phone: "919454197886",
//   message: "Hi",
//   defaultMessage: "Hi,\nHow can I help you?",
//   brandName: "RedAntEduTech",
//   ctaText: "Start chat",
//   buttonColor: "#0A5F54",
//   position: "bottom-left"
// }

router.get('/button/widget.js', async (req, res) => {
  const { 'widget-id': widgetId } = req.query;
  if (!widgetId) return res.status(400).send('Missing widget-id');

  const widgetResponse = await WhatsAppWidget.findOne({ widgetId });
  // console.log("widget", widgetResponse)

  if (!widgetResponse) return res.status(404).send('Widget not found');
  const widget = {
    phone: widgetResponse?.phone,
    ctaText: widgetResponse.ctaText,
    buttonColor: widgetResponse.buttonColor,
    position: widgetResponse.position || "bottom-left",
    // position: "bottom-right",
    message: widgetResponse.message || "Hi",
    onScreenMsg: widgetResponse.brand.onScreenMsg || "Hi,How can I help you ?",
    brandName: widgetResponse.brand.name,
    brandSubtitle: widgetResponse.brand?.subtitle || "",
    brandImageUrl: widgetResponse.brand?.imageUrl || "",
    widgetCtaText: widgetResponse.brand.widgetCtaText,
    brandColor: widgetResponse.brand.color || "#0A5F54",
    openByDefault: widgetResponse.openByDefault || true,
    reOpenRule: widgetResponse.reOpenRule || "always",


  }
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
        background: white;
        padding: 16px;
        display: flex;
        flex-direction: column;
        align-items: center;
        justify-content: space-between;
      }
      .otusone-widget-header .title {
        font-weight: bold;
        font-size: 16px;
      }

      .brand-header {
      display: flex;
      align-items: center;
      gap: 12px;
      width: 100%;
      position: relative;
     }

    .brand-img {
    width: 40px;
    height: 40px;
    border-radius: 9999px;
   object-fit: cover;
   }

   .brand-details {
   display: flex;
   flex-direction: column;
   }

.brand-name {
  font-weight: 600;
  font-size: 14px;
  color:  ${widget.brandColor};
}

.brand-subtitle {
  font-size: 12px;
  color: #6a7282;
}

.close-btn {
  position: absolute;
  right: 0;
  top: 0;
  padding: 8px;
  font-size: 14px;
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
        padding:"5px";
        height: 52px;
        width: 320px;
        display: flex;
        align-items: center;
        justify-content: ${widget.position === 'bottom-left' ? 'left' : 'right'};
        position: relative;
        bottom: 0;
        right: 0;
      }

      .otusone-btn {
        display: flex;
        align-items: center;
        justify-content: center;
        padding:"5px";
        background: ${widget.buttonColor};
        color:white;
        height: 45px;
        width: 150px;
        border-radius:25px;
        cursor: pointer;
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
      <div class="brand-header">
        ${widget.brandImageUrl ? `<img src="${widget.brandImageUrl}" alt="Brand" class="brand-img" />` : ''}
        <div class="brand-details">
          <div class="brand-name">${widget.brandName || 'Support'}</div>
          <div class="brand-subtitle">${widget.brandSubtitle || ''}</div>
        </div>
        <div class="close-btn" style="cursor:pointer;">✕</div>
      </div>
    </div>
        <div class="otusone-widget-body">
          <p><strong>${widget.brandName}</strong><br/>${widget.onScreenMsg}</p>
        </div>
        <div class="otusone-widget-footer">
          <a href="https://wa.me/${widget.phone}?text=${encodeURIComponent(widget.message)}" target="_blank">${widget.widgetCtaText}</a>
        </div>
      </div>
      <div class="otusone-widget-button" id="wa-toggle-btn">
      <button class="otusone-btn">
        <img src="https://upload.wikimedia.org/wikipedia/commons/6/6b/WhatsApp.svg" width="28" alt="WA"> Chat with us
      </button>
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
