import React, { useState } from "react";
import Modal from "../../common/Modal";
import WidgetScriptPreview from "../../common/WidgetScriptPreview";
import WhatsAppWidgetPreview from "../../common/WhatsAppWidgetPreview";
import { postApplicationJsonRequest } from "../../../services/apiServices";

const WhatsAppWidgetForm = () => {
  const [showScript, setShowScript] = useState(false);
  const [rawScript, setRawScript] = useState();
  const [form, setForm] = useState({
    phone: "",
    ctaText: "Chat with us",
    buttonColor: "#4dc247",
    position: "bottom-right",
    message: "Hi",
    brandName: "",
    brandSubtitle: "",
    brandColor: "#0A5F54",
    brandImageUrl: "",
    widgetCtaText: "Start chat",
    onScreenMessage: "Hi, How can I help you?",
    openByDefault: true,
    reOpenRule: "always"
  });

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setForm((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const payload = {
        phone: form.phone,
        ctaText: form.ctaText,
        buttonColor: form.buttonColor,
        position: form.position,
        message: form.message,
        brand: {
          name: form.brandName,
          subtitle: form.brandSubtitle,
          color: form.brandColor,
          imageUrl: form.brandImageUrl || "https://www.otusone.com/static/media/image%201.9665bcd0030245e711326e9f305807f8.svg",
          widgetCtaText: form.widgetCtaText || "Start Chat",
          onScreenMsg: form.onScreenMessage || "Hi,How can I help you ?"
        },
        openByDefault: form.openByDefault || true,
        reOpenRule: form.reOpenRule || "always"
      }
      const response = await postApplicationJsonRequest(`/wa-widget/create-button`, payload);
      if (response.status === 201) {
        const result = response.data.script;
        setRawScript(result);
        setShowScript(true);
      }
    } catch (error) {
      toast.error("Sorry we are unable to generate WhatsApp Button Script. Please try again later")
    }
  };

  return (
    <div className="p-6 max-w-4xl mx-auto bg-white shadow rounded-md space-y-8">
      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Section 1: Chat Button Configuration */}
        <div>
          <h2 className="text-xl font-semibold border-b pb-2">Configure WhatsApp Chat Button</h2>

          <div className="mt-4 space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700">WhatsApp Phone Number</label>
              <input
                type="text"
                name="phone"
                className="w-full border border-gray-300 px-3 py-2 rounded-md"
                value={form.phone}
                onChange={handleChange}
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700">Button Background</label>
                <input
                  type="color"
                  name="buttonColor"
                  className="w-16 h-10 rounded-md border border-gray-300"
                  value={form.buttonColor}
                  onChange={handleChange}
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">CTA Text</label>
                <input
                  type="text"
                  name="ctaText"
                  className="w-full border border-gray-300 px-3 py-2 rounded-md"
                  value={form.ctaText}
                  onChange={handleChange}
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700">Default Pre-filled Message</label>
              <input
                type="text"
                name="message"
                className="w-full border border-gray-300 px-3 py-2 rounded-md"
                value={form.message}
                onChange={handleChange}
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Position</label>
              <div className="flex gap-4">
                {["bottom-right", "bottom-left"].map((pos) => (
                  <button
                    type="button"
                    key={pos}
                    className={`px-4 py-2 rounded-md border ${form.position === pos
                      ? "bg-green-500 text-white"
                      : "bg-gray-100 text-gray-700"
                      }`}
                    onClick={() => setForm((prev) => ({ ...prev, position: pos }))}
                  >
                    {pos.replace("-", " ")}
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Section 2: Chat Widget Branding */}
        <div>
          <h2 className="text-xl font-semibold border-b pb-2">Chat Widget</h2>

          <div className="grid grid-cols-2 gap-4 mt-4">
            <div>
              <label className="block text-sm font-medium text-gray-700">Brand Name</label>
              <input
                type="text"
                name="brandName"
                className="w-full border border-gray-300 px-3 py-2 rounded-md"
                value={form.brandName}
                onChange={handleChange}
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">Brand Subtitle</label>
              <input
                type="text"
                name="brandSubtitle"
                className="w-full border border-gray-300 px-3 py-2 rounded-md"
                value={form.brandSubtitle}
                onChange={handleChange}
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">Brand Color</label>
              <input
                type="color"
                name="brandColor"
                className="w-16 h-10 border border-gray-300 rounded-md"
                value={form.brandColor}
                onChange={handleChange}
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">Brand Image URL</label>
              <input
                type="text"
                name="brandImageUrl"
                className="w-full border border-gray-300 px-3 py-2 rounded-md"
                value={form.brandImageUrl}
                onChange={handleChange}
              />
            </div>
          </div>

          <div className="mt-4">
            <label className="block text-sm font-medium text-gray-700">Widget CTA Text</label>
            <input
              type="text"
              name="widgetCtaText"
              className="w-full border border-gray-300 px-3 py-2 rounded-md"
              value={form.widgetCtaText}
              onChange={handleChange}
            />
          </div>

          <div className="mt-4">
            <label className="block text-sm font-medium text-gray-700">Default On-screen Message</label>
            <textarea
              name="onScreenMessage"
              className="w-full border border-gray-300 px-3 py-2 rounded-md"
              value={form.onScreenMessage}
              onChange={handleChange}
            ></textarea>
          </div>

          <div className="grid grid-cols-2 gap-4 mt-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Open widget by default</label>
              <div className="flex items-center space-x-4">
                <label className="flex items-center gap-2">
                  <input
                    type="radio"
                    name="openByDefault"
                    checked={form.openByDefault}
                    onChange={() => setForm({ ...form, openByDefault: true })}
                  />
                  Yes
                </label>
                <label className="flex items-center gap-2">
                  <input
                    type="radio"
                    name="openByDefault"
                    checked={!form.openByDefault}
                    onChange={() => setForm({ ...form, openByDefault: false })}
                  />
                  No
                </label>
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700">Re-open widget by default</label>
              <select
                name="reOpenRule"
                value={form.reOpenRule}
                onChange={handleChange}
                className="w-full border border-gray-300 px-3 py-2 rounded-md"
              >
                <option value="always">Always</option>
                <option value="after_24h">After 24 hours</option>
              </select>
            </div>
          </div>
        </div>

        {/* Submit Button */}
        <div className="pt-4">
          <button
            type="submit"
            className="bg-[#4dc247] hover:bg-[#3ca437] text-white font-semibold px-6 py-2 rounded-md transition"
          >
            Generate Script
          </button>
        </div>
      </form>

      <div className="hidden md:block">
        <WhatsAppWidgetPreview form={form} />
      </div>
      {showScript && (
        <Modal isOpen={showScript} onClose={() => setShowScript(false)} title="Here is your Widget Snippet">
          <WidgetScriptPreview
            rawScript={rawScript || `<script type="text/javascript" src="http://localhost:8000/widget/button/widget.js?widget-id=0NFukQ" id="otusone-wa-widget" widget-id="0NFukQ"></script>`}
          />
        </Modal>
      )}
    </div>
  );
};

export default WhatsAppWidgetForm;
