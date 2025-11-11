import React from "react";

const WhatsAppWidgetPreview = ({ form }) => {
    const {
        ctaText,
        buttonColor,
        position,
        brandName,
        brandSubtitle,
        brandImageUrl,
        brandColor,
        onScreenMessage,
        widgetCtaText,
        openByDefault,
    } = form;

    const posStyle =
        position === "bottom-right"
            ? "bottom-4 right-4"
            : "bottom-4 left-4";

    return (
        <div className={`fixed z-50 ${posStyle}`}>
            <div className="w-72 border border-gray-300 rounded-md shadow-lg overflow-hidden bg-white">
                {openByDefault && (
                    <div className="p-3 border-b border-gray-200">
                        <div className="flex items-center gap-3">
                            {brandImageUrl && (
                                <img
                                    src={brandImageUrl}
                                    alt="Brand"
                                    className="w-10 h-10 rounded-full"
                                />
                            )}
                            <div>
                                <div className="font-semibold text-sm" style={{ color: brandColor }}>{brandName}</div>
                                <div className="text-xs text-gray-500">{brandSubtitle}</div>
                            </div>
                        </div>
                        <div className="text-sm mt-3">{onScreenMessage}</div>
                        <button
                            className="mt-3 px-4 py-2 bg-green-500 text-white text-sm rounded-md w-full"
                            style={{ backgroundColor: buttonColor }}
                        >
                            {widgetCtaText}
                        </button>
                    </div>
                )}
                <div className="p-3 flex justify-center">
                    <button
                        className="rounded-full px-4 py-2 text-white text-sm"
                        style={{ backgroundColor: buttonColor }}
                    >
                        {ctaText}
                    </button>
                </div>
            </div>
        </div>
    );
};

export default WhatsAppWidgetPreview;
