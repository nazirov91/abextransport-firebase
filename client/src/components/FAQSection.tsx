import { useState } from "react";
import { ChevronDown, ChevronUp } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";

interface FAQItem {
  question: string;
  answer: string;
}

const faqData: FAQItem[] = [
  {
    question: "What services do you offer?",
    answer:
      "We offer global express shipping, customs clearance, and door-to-door delivery for businesses and individuals.",
  },
  {
    question: "How can I get a shipping quote?",
    answer:
      "You can use our online quote form or contact our support team for a personalized estimate.",
  },
  {
    question: "Do you provide tracking for shipments?",
    answer:
      "Yes, all shipments include real-time tracking so you can monitor your package every step of the way.",
  },
  {
    question: "Are there any restricted items?",
    answer:
      "Certain items are restricted by international regulations. Please refer to our restricted items list or contact us for details.",
  },
  {
    question: "How do I contact customer support?",
    answer: "You can reach our support team via email, phone, or live chat on our website.",
  },
  {
    question: "What payment methods do you accept?",
    answer: "We accept major credit cards, PayPal, and bank transfers for your convenience.",
  },
];

export default function FAQSection() {
  const [openItems, setOpenItems] = useState<Set<number>>(new Set());

  const toggleItem = (index: number) => {
    const newOpenItems = new Set(openItems);
    if (newOpenItems.has(index)) {
      newOpenItems.delete(index);
    } else {
      newOpenItems.add(index);
    }
    setOpenItems(newOpenItems);
  };

  return (
    <section id="faq" className="py-20 bg-background">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">
            Frequently Asked Questions
          </h2>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
            Get answers to the most common questions about auto transport services. Don't see your
            question? Contact us for personalized assistance.
          </p>
        </div>

        <div className="space-y-4">
          {faqData.map((faq, index) => {
            const isOpen = openItems.has(index);
            return (
              <Card key={index} className="overflow-hidden">
                <button
                  className="w-full text-left p-6 hover-elevate focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2"
                  onClick={() => toggleItem(index)}
                  data-testid={`faq-question-${index}`}
                >
                  <div className="flex items-center justify-between">
                    <h3 className="text-lg font-semibold text-foreground pr-4">{faq.question}</h3>
                    <div className="flex-shrink-0">
                      {isOpen ? (
                        <ChevronUp className="h-5 w-5 text-muted-foreground" />
                      ) : (
                        <ChevronDown className="h-5 w-5 text-muted-foreground" />
                      )}
                    </div>
                  </div>
                </button>

                {isOpen && (
                  <CardContent className="px-6 pb-6 pt-0">
                    <div
                      className="text-muted-foreground leading-relaxed"
                      data-testid={`faq-answer-${index}`}
                    >
                      {faq.answer}
                    </div>
                  </CardContent>
                )}
              </Card>
            );
          })}
        </div>

        <div className="text-center mt-12">
          <p className="text-muted-foreground mb-4">Still have questions? We're here to help!</p>
          <a
            href="#contact"
            className="inline-flex items-center justify-center px-6 py-3 text-base font-medium text-primary-foreground bg-primary rounded-md hover-elevate active-elevate-2 transition-colors"
            data-testid="button-contact-from-faq"
          >
            Contact Our Experts
          </a>
        </div>
      </div>
    </section>
  );
}
