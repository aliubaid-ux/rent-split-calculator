import {
    Accordion,
    AccordionContent,
    AccordionItem,
    AccordionTrigger,
  } from "@/components/ui/accordion"
  
  const faqs = [
    {
      question: "Is this service really free?",
      answer: "Yes, Rent Fairness is completely free to use. Our goal is to help roommates everywhere find a fair way to split their rent. If you want to use the AI optimization feature, you'll need your own Gemini API key, which has a generous free tier."
    },
    {
      question: "How does the AI optimization work?",
      answer: "Our AI model analyzes all the room details you provide—size, features, comfort levels, and any custom attributes. It then suggests a weight distribution for these categories that it determines to be the most equitable, based on patterns from thousands of fair rent scenarios."
    },
    {
      question: "Is my data safe?",
      answer: "Absolutely. All calculations happen directly in your browser. We don't store your rent details. If you use the sharing feature, your data is encoded in the URL, but it's not stored on our servers. The AI feature sends anonymized room data to the Gemini API, but never your total rent."
    },
    {
      question: "What if we disagree with the results?",
      answer: "The calculator is a tool to facilitate discussion, not a final verdict. Use the results as a starting point. You can manually adjust the weights in 'Step 2' to better reflect what your group values most, and see how it impacts the rent split in real-time."
    },
    {
      question: "Can I use this for more than just rooms?",
      answer: "Yes! You can use it to split costs for shared resources like parking spots, storage units, or even shared studio space. Just enter each item as a 'room' and define its attributes using the custom features."
    }
  ]
  
  export function Faq() {
    return (
      <section id="faq" className="py-12 md:py-20 lg:py-24 bg-muted/50">
        <div className="container mx-auto px-4 max-w-3xl">
          <div className="text-center mb-10">
            <h2 className="text-3xl md:text-4xl font-bold tracking-tight">Frequently Asked Questions</h2>
            <p className="mt-4 text-lg text-muted-foreground">
              Got questions? We've got answers. Here are some of the most common things people ask.
            </p>
          </div>
          <Accordion type="single" collapsible className="w-full">
            {faqs.map((faq, index) => (
              <AccordionItem key={index} value={`item-${index}`}>
                <AccordionTrigger className="text-lg text-left">{faq.question}</AccordionTrigger>
                <AccordionContent className="text-base text-muted-foreground">
                  {faq.answer}
                </AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
        </div>
      </section>
    )
  }
  