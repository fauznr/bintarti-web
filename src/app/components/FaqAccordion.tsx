"use client";

import { useState } from "react";
import { ChevronDown } from "lucide-react";

interface FaqItem {
  id: number;
  question: string;
  answer: string;
}

export default function FaqAccordion({ faqs }: { faqs: FaqItem[] }) {
  const [openId, setOpenId] = useState<number | null>(null);

  return (
    <div className="space-y-4">
      {faqs.map((faq) => {
        const isOpen = openId === faq.id;
        return (
          <div
            key={faq.id}
            className="bg-white border border-slate-200 rounded-2xl overflow-hidden shadow-sm shadow-slate-200/50 hover:border-slate-300 transition-all duration-300"
          >
            <button
              onClick={() => setOpenId(isOpen ? null : faq.id)}
              className="w-full py-5 px-6 flex items-center justify-between text-left focus:outline-none cursor-pointer"
            >
              <span className="text-base font-bold text-slate-900 tracking-wide font-accent">
                {faq.question}
              </span>
              <span
                className={`p-1.5 rounded-lg bg-slate-100 text-slate-700 transition-transform duration-300 ${
                  isOpen ? "rotate-180" : ""
                }`}
              >
                <ChevronDown className="w-4 h-4" />
              </span>
            </button>

            <div className={`accordion-content ${isOpen ? "open" : ""}`}>
              <div className="accordion-inner">
                <div className="px-6 pb-6 pt-2 border-t border-slate-100 text-sm text-slate-700 leading-relaxed font-sans">
                  {faq.answer}
                </div>
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
}
