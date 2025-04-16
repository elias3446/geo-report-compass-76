
import React from 'react';
import AppLayout from '@/components/layout/AppLayout';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { Button } from '@/components/ui/button';
import { HelpCircle, BookOpen, MessageSquare, Send } from 'lucide-react';

const Help = () => {
  const faqs = [
    {
      question: "How do I create a new report?",
      answer: "To create a new report, click on the 'New Report' button in the navigation bar. Fill out the required information including title, category, location, and description. Then click 'Submit Report' to complete the process."
    },
    {
      question: "How can I view reports on the map?",
      answer: "Navigate to the 'Map' page through the main navigation. The map will display all reports as pins. You can click on any pin to see more details about that specific report."
    },
    {
      question: "Can I edit my reports after submitting?",
      answer: "Yes, you can edit your own reports. Navigate to the 'Reports' page, find your report, and click the 'Edit' button. Make your changes and save to update the report."
    },
    {
      question: "How do I filter reports by category?",
      answer: "On both the 'Reports' and 'Map' pages, you'll find filter options that allow you to select specific categories to display. Use these filters to narrow down the reports you're viewing."
    },
    {
      question: "What happens after I submit a report?",
      answer: "After submitting a report, it will be visible to all users. Administrators will review your report and may update its status as they work on addressing the issue."
    }
  ];

  return (
    <AppLayout>
      <div className="mb-6">
        <h1 className="text-3xl font-bold tracking-tight">Help & Documentation</h1>
        <p className="text-muted-foreground mt-1">
          Find answers to common questions and learn how to use GeoReport
        </p>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="md:col-span-2">
          <Card className="mb-6">
            <CardHeader>
              <CardTitle className="flex items-center">
                <BookOpen className="mr-2 h-5 w-5" />
                User Guide
              </CardTitle>
              <CardDescription>
                Learn how to use GeoReport effectively
              </CardDescription>
            </CardHeader>
            <CardContent>
              <h3 className="text-lg font-medium mb-4">Frequently Asked Questions</h3>
              <Accordion type="single" collapsible className="w-full">
                {faqs.map((faq, index) => (
                  <AccordionItem key={index} value={`item-${index}`}>
                    <AccordionTrigger className="text-left">
                      {faq.question}
                    </AccordionTrigger>
                    <AccordionContent>
                      <p className="text-muted-foreground">{faq.answer}</p>
                    </AccordionContent>
                  </AccordionItem>
                ))}
              </Accordion>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <MessageSquare className="mr-2 h-5 w-5" />
                Contact Support
              </CardTitle>
              <CardDescription>
                Get help from our support team
              </CardDescription>
            </CardHeader>
            <CardContent>
              <form className="space-y-4">
                <div>
                  <label htmlFor="subject" className="block text-sm font-medium mb-1">
                    Subject
                  </label>
                  <input
                    id="subject"
                    className="w-full p-2 border rounded-md"
                    placeholder="What can we help you with?"
                  />
                </div>
                <div>
                  <label htmlFor="message" className="block text-sm font-medium mb-1">
                    Message
                  </label>
                  <textarea
                    id="message"
                    className="w-full p-2 border rounded-md min-h-[150px]"
                    placeholder="Describe your issue in detail"
                  />
                </div>
                <Button className="w-full">
                  <Send className="mr-2 h-4 w-4" />
                  Send Support Request
                </Button>
              </form>
            </CardContent>
          </Card>
        </div>
        
        <div>
          <Card className="mb-6">
            <CardHeader>
              <CardTitle className="flex items-center">
                <HelpCircle className="mr-2 h-5 w-5" />
                Quick Tips
              </CardTitle>
            </CardHeader>
            <CardContent>
              <ul className="space-y-2">
                <li className="flex items-start">
                  <div className="mr-2 h-5 w-5 text-primary flex-shrink-0">→</div>
                  <span className="text-sm">Use the map view to find reports near your location</span>
                </li>
                <li className="flex items-start">
                  <div className="mr-2 h-5 w-5 text-primary flex-shrink-0">→</div>
                  <span className="text-sm">Add detailed descriptions to your reports for better resolution</span>
                </li>
                <li className="flex items-start">
                  <div className="mr-2 h-5 w-5 text-primary flex-shrink-0">→</div>
                  <span className="text-sm">Check the dashboard for a quick overview of all reports</span>
                </li>
                <li className="flex items-start">
                  <div className="mr-2 h-5 w-5 text-primary flex-shrink-0">→</div>
                  <span className="text-sm">Filter reports by category to find specific issues</span>
                </li>
                <li className="flex items-start">
                  <div className="mr-2 h-5 w-5 text-primary flex-shrink-0">→</div>
                  <span className="text-sm">Upload images to provide visual evidence of the issue</span>
                </li>
              </ul>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <BookOpen className="mr-2 h-5 w-5" />
                Resources
              </CardTitle>
            </CardHeader>
            <CardContent>
              <ul className="space-y-3">
                <li>
                  <Button variant="outline" className="w-full justify-start">
                    <BookOpen className="mr-2 h-4 w-4" />
                    User Manual
                  </Button>
                </li>
                <li>
                  <Button variant="outline" className="w-full justify-start">
                    <BookOpen className="mr-2 h-4 w-4" />
                    Video Tutorials
                  </Button>
                </li>
                <li>
                  <Button variant="outline" className="w-full justify-start">
                    <BookOpen className="mr-2 h-4 w-4" />
                    API Documentation
                  </Button>
                </li>
                <li>
                  <Button variant="outline" className="w-full justify-start">
                    <MessageSquare className="mr-2 h-4 w-4" />
                    Community Forum
                  </Button>
                </li>
              </ul>
            </CardContent>
          </Card>
        </div>
      </div>
    </AppLayout>
  );
};

export default Help;
