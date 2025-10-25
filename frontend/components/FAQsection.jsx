import { ChevronDown } from "lucide-react";
import { ChevronUp } from "lucide-react";
import React, { useState, useRef, useEffect } from "react";

const faqs = [
  {
    question: "What is MedHealth.ai?",
    answer:
      "MedHealth.ai is an AI-powered platform that lets you upload a prescription or medicine image to get detailed medicine information such as dosage, side effects, timing, and alternative brands.",
  },
  {
    question: "How does the image upload feature work?",
    answer:
      "You can upload a clear image of your prescription or medicine. Our AI extracts the medicine names and provides verified information.",
  },
  {
    question: "Is my medical data safe?",
    answer:
      "Yes. MedHealth.ai uses secure, encrypted storage. Your medical records are private and accessible only to you.",
  },
  {
    question: "Can I find substitute medicines?",
    answer:
      "Absolutely! Use the Medicine Search feature to find equivalent medicines under different brand names.",
  },
  {
    question: "Can I track my medicines or prescriptions?",
    answer:
      "Yes, you can save and track your medicines, dosage times, and prescription history.",
  },
  {
    question: "Is this service free to use?",
    answer:
      "Basic features are free. Premium users can access advanced insights and detailed health tracking.",
  },
  {
    question: "What should I do if I find incorrect medicine information?",
    answer:
      "You can report it via the feedback form or contact our support team. We'll verify and update it promptly.",
  },
];

const FAQItem = ({ faq, isOpen, onClick }) => {
  const contentRef = useRef(null);
  const [height, setHeight] = useState("0px");

  useEffect(() => {
    if (isOpen && contentRef.current) {
      setHeight(`${contentRef.current.scrollHeight}px`);
    } else {
      setHeight("0px");
    }
  }, [isOpen]);

  return (
    <div className="border border-gray-200  shadow-sm p-3 hover:shadow-md transition-shadow duration-300 bg-white">
      <button
        className="flex justify-between items-center w-full text-left"
        onClick={onClick}
      >
        <span className="font-medium text-gray-800 hover:underline cursor-pointer">{faq.question}</span>
        <span className="text-green-500 text-xl">{isOpen ? <ChevronUp /> : <ChevronDown />}</span>
      </button>

      <div
        ref={contentRef}
        style={{
          maxHeight: height,
          overflow: "hidden",
          transition: "max-height 0.4s ease, opacity 0.3s ease",
          opacity: isOpen ? 1 : 0,
        }}
      >
        <p className="mt-3 text-gray-500 leading-relaxed">{faq.answer}</p>
      </div>
    </div>
  );
};

const FAQSection = () => {
  const [openIndex, setOpenIndex] = useState(null);

  const toggleFAQ = (index) => {
    setOpenIndex(openIndex === index ? null : index);
  };

  return (
    <section className="max-w-3xl mx-auto px-4 py-10">
      <h2 className="text-3xl font-semibold text-center text-black mb-8">
        Frequently Asked Questions
      </h2>
      <div className="space-y-2">
        {faqs.map((faq, index) => (
          <FAQItem
            key={index}
            faq={faq}
            isOpen={openIndex === index}
            onClick={() => toggleFAQ(index)}
          />
        ))}
      </div>
    </section>
  );
};

export default FAQSection;
