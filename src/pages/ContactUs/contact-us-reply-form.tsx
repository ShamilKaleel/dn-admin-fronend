import React, { useState, useEffect } from "react";
import axiosInstance from "@/api/axiosInstance";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { ContactUs } from "@/types/contact-us";
import { useToast } from "@/hooks/use-toast";
import { ScrollArea } from "@/components/ui/scroll-area";
import { User, Mail, Phone, MessageSquare } from "lucide-react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

interface ContactUsReplyFormProps {
  setIsOpen: React.Dispatch<React.SetStateAction<boolean>>;
  selectedContactUsID: string | null;
  onReplySuccess?: (contactId: string) => void;
}

const ContactUsReplyForm: React.FC<ContactUsReplyFormProps> = ({
  setIsOpen,
  selectedContactUsID,
  onReplySuccess,
}) => {
  const [reply, setReply] = useState<string>("");
  const [contactDetails, setContactDetails] = useState<ContactUs | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [submitting, setSubmitting] = useState<boolean>(false);
  const { toast } = useToast();

  // Template responses to save time
  const templates = [
    {
      label: "General Thank You",
      text: "Thank you for reaching out to DN Dental Clinic. We appreciate your message and will address your inquiry as promptly as possible.",
    },
    {
      label: "Appointment Confirmation",
      text: "Thank you for your interest in scheduling an appointment with DN Dental Clinic. We'd be happy to assist you. Please provide your preferred date and time, and we'll check our availability.",
    },
    {
      label: "Fee Inquiry",
      text: "Thank you for your inquiry about our fees. At DN Dental Clinic, we strive to provide transparent pricing. For your specific treatment needs, we recommend scheduling a consultation to provide an accurate estimate.",
    },
  ];

  useEffect(() => {
    const fetchContactDetails = async () => {
      if (!selectedContactUsID) return;

      try {
        setLoading(true);
        const response = await axiosInstance.get<ContactUs>(
          `/contacts/${selectedContactUsID}`
        );
        setContactDetails(response.data);
      } catch (error) {
        toast({
          title: "Error",
          description: "Failed to fetch contact details",
          variant: "destructive",
        });
      } finally {
        setLoading(false);
      }
    };

    fetchContactDetails();
  }, [selectedContactUsID]);

  const handleSubmit = async () => {
    if (!reply.trim() || !selectedContactUsID) return;

    try {
      setSubmitting(true);
      await axiosInstance.put(
        `/contacts/sendReply/${selectedContactUsID}`,
        reply
      );

      toast({
        title: "Success",
        description: "Reply sent successfully!",
      });

      // Call the success handler with the contact ID if provided
      if (onReplySuccess && selectedContactUsID) {
        onReplySuccess(selectedContactUsID);
      }

      setIsOpen(false);
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to send reply",
        variant: "destructive",
      });
    } finally {
      setSubmitting(false);
    }
  };

  const applyTemplate = (templateText: string): void => {
    // Add personalization if we have contact details
    if (contactDetails) {
      const personalizedTemplate = `Dear ${contactDetails.name},\n\n${templateText}\n\nBest regards,\nDN Dental Clinic Team`;
      setReply(personalizedTemplate);
    } else {
      setReply(templateText);
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center p-4 h-40">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    );
  }

  return (
    <div className="flex flex-col max-h-[70vh]">
      {contactDetails && (
        <div className="space-y-3 p-4 overflow-y-auto scrollbar-thin scrollbar-thumb-gray-300 scrollbar-track-transparent hover:scrollbar-thumb-gray-400 dark:scrollbar-thumb-gray-600 dark:hover:scrollbar-thumb-gray-500">
          <div className="border-b pb-3">
            <div className="flex items-center mb-2">
              <User className="h-5 w-5 text-gray-500 mr-2" />
              <h3 className="text-lg font-medium">{contactDetails.name}</h3>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
              <div className="flex items-center">
                <Mail className="h-4 w-4 text-gray-500 mr-2 shrink-0" />
                <span className="text-sm text-gray-600 truncate">
                  {contactDetails.email}
                </span>
              </div>

              <div className="flex items-center">
                <Phone className="h-4 w-4 text-gray-500 mr-2 shrink-0" />
                <span className="text-sm text-gray-600 truncate">
                  {contactDetails.contactNumber}
                </span>
              </div>
            </div>
          </div>

          <div>
            <div className="flex items-center mb-2">
              <MessageSquare className="h-5 w-5 text-gray-500 mr-2" />
              <h4 className="font-medium">Subject: {contactDetails.subject}</h4>
            </div>

            <div className="bg-muted/30 border border-border rounded-md p-3">
              <div className="h-24 overflow-y-auto scrollbar-thin scrollbar-thumb-gray-300 scrollbar-track-transparent hover:scrollbar-thumb-gray-400 dark:scrollbar-thumb-gray-600 dark:hover:scrollbar-thumb-gray-500 pr-2">
                <p className="whitespace-pre-wrap text-gray-700 dark:text-gray-300">
                  {contactDetails.message}
                </p>
              </div>
            </div>
          </div>
        </div>
      )}

      <div className="p-4 border-t">
        <div className="space-y-3">
          <div>
            <div className="flex justify-between items-center mb-2">
              <Label htmlFor="reply" className="text-base font-medium">
                Your Reply
              </Label>
              <Select
                onValueChange={(value) => {
                  const template = templates.find((t) => t.label === value);
                  if (template) applyTemplate(template.text);
                }}
              >
                <SelectTrigger className="w-40">
                  <SelectValue placeholder="Use template" />
                </SelectTrigger>
                <SelectContent>
                  {templates.map((template) => (
                    <SelectItem key={template.label} value={template.label}>
                      {template.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <Textarea
              id="reply"
              value={reply}
              onChange={(e) => setReply(e.target.value)}
              placeholder="Type your reply here..."
              className="h-32 resize-none scrollbar-thin scrollbar-thumb-gray-300 scrollbar-track-transparent hover:scrollbar-thumb-gray-400 dark:scrollbar-thumb-gray-600 dark:hover:scrollbar-thumb-gray-500"
            />
          </div>

          <div className="flex justify-end gap-2 pt-2">
            <Button
              type="button"
              variant="outline"
              onClick={() => setIsOpen(false)}
              disabled={submitting}
            >
              Cancel
            </Button>
            <Button
              type="button"
              disabled={submitting || !reply.trim()}
              className="min-w-24"
              onClick={handleSubmit}
            >
              {submitting ? (
                <>
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                  Sending...
                </>
              ) : (
                "Send Reply"
              )}
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ContactUsReplyForm;
