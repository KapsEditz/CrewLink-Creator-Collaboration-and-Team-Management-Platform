import React, { useState } from "react";
import { FiPlus, FiMinus } from "react-icons/fi"; // Premium SVG icons
import "./faq.css";

// Store FAQs in an array for clean, scalable code
const faqs = [
  {
    question: "Is CrewLink free to use?",
    answer: "Yes. You can create an account, discover collaborators and join projects for free. Premium features will be introduced later for advanced collaboration and team management."
  },
  {
    question: "How do I find collaborators?",
    answer: "Browse creator profiles, search by specific skills, send collaboration requests, and build your perfect creative team in just a few clicks."
  },
  {
    question: "Can I join multiple projects?",
    answer: "Absolutely. You can participate in multiple projects at the same time and seamlessly manage everything from a single unified workspace."
  }
];

export default function FAQ() {
  // Set to 0 to have the first item open by default, or -1 to have all closed
  const [openIndex, setOpenIndex] = useState(0); 

  return (
    <section className="faq-section" id="faq">
      <div className="faq-container">
        
        {/* Standardized Header matching Features, How It Works, and Testimonials */}
        <div className="faq-heading">
          <span className="faq-badge">Support</span>
          <h2 className="faq-title">
            Frequently Asked <span className="text-gradient">Questions</span>
          </h2>
          <p className="faq-subtitle">
            Everything you need to know before joining CrewLink. If you still have questions, we're here to help.
          </p>
        </div>

        <div className="faq-list">
          {faqs.map((faq, index) => {
            const isOpen = openIndex === index;

            return (
              <div 
                className={`faq-item ${isOpen ? "is-open" : ""}`} 
                key={index}
              >
                <button
                  className="faq-question"
                  onClick={() => setOpenIndex(isOpen ? -1 : index)}
                  aria-expanded={isOpen}
                >
                  <span className="question-text">{faq.question}</span>
                  <div className="faq-icon-wrapper">
                    {isOpen ? <FiMinus strokeWidth={2.5} /> : <FiPlus strokeWidth={2.5} />}
                  </div>
                </button>
                
                {/* Modern Grid-based accordion animation wrapper */}
                <div className="faq-answer-wrapper">
                  <div className="faq-answer-inner">
                    <p>{faq.answer}</p>
                  </div>
                </div>
              </div>
            );
          })}
        </div>

      </div>
    </section>
  );
}