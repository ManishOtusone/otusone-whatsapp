import { useState } from 'react';

const faqs = [
  {
    question: "What is OTUSONE used for?",
    answer: "OTUSONE helps businesses use WhatsApp to engage customers, send campaigns, and provide support via automation."
  },
  {
    question: "How is WhatsApp pricing calculated?",
    answer: "Pricing is based on the number of conversations initiated through WhatsApp's Business API as per Meta's rules."
  },
  {
    question: "Do I need a verified Facebook Business Manager ID?",
    answer: "Yes, a verified Business Manager is required to get WhatsApp Business API access."
  },
  {
    question: "Can I cancel my plan anytime?",
    answer: "Yes, plans are flexible. You can cancel anytime without any hidden charges."
  },
];

const FAQSection=()=> {
  const [openIndex, setOpenIndex] = useState(null);

  const toggle = index => {
    setOpenIndex(openIndex === index ? null : index);
  };

  return (
    <section className="max-w-7xl mx-auto py-12 px-4">
      <h2 className="text-3xl font-bold text-center mb-8">Frequently Asked Questions</h2>
      <div className="space-y-4">
        {faqs.map((faq, i) => (
          <div key={i} className="border rounded-md shadow-sm bg-white">
            <button
              onClick={() => toggle(i)}
              className="w-full flex justify-between items-center p-4 font-medium text-left text-gray-800"
            >
              {faq.question}
              <span>{openIndex === i ? '-' : '+'}</span>
            </button>
            {openIndex === i && (
              <div className="px-4 pb-4 text-gray-600">
                {faq.answer}
              </div>
            )}
          </div>
        ))}
      </div>
    </section>
  );
}


export default FAQSection;
