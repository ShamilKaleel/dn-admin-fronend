import React from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { ContactUs } from "@/types/contact-us";
import { User, Mail, Phone, MessageSquare, Reply } from "lucide-react";

interface ContactCardProps {
  contact: ContactUs;
  onSelect: (id: string | number) => void;
}

const ContactCard: React.FC<ContactCardProps> = ({ contact, onSelect }) => {
  return (
    <Card
      className={`
        cursor-pointer transition-all duration-300 h-full flex flex-col
        ${
          contact.replySent
            ? "border-green-200 dark:border-green-800"
            : "hover:border-primary"
        }
        hover:shadow-md
      `}
      onClick={() => onSelect(contact.id)}
    >
      <CardContent className="p-0 flex-grow">
        <div className="p-4 border-b flex justify-between items-center bg-muted/30">
          <div className="flex items-center flex-shrink min-w-0 mr-2">
            <User className="h-5 w-5 text-gray-500 mr-2 shrink-0" />
            <h3 className="font-medium w-40">
              {contact.name.length > 20
                ? `${contact.name.substring(0, 20)}...`
                : contact.name}
            </h3>
          </div>
          {contact.replySent && (
            <Badge
              variant="secondary"
              className="bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300 shrink-0 whitespace-nowrap"
            >
              Responded
            </Badge>
          )}
        </div>

        <div className="p-4 space-y-3">
          <div className="flex items-center text-sm">
            <Mail className="h-4 w-4 text-gray-500 mr-2 shrink-0" />
            <span className="truncate text-gray-600">{contact.email}</span>
          </div>

          <div className="flex items-center text-sm">
            <Phone className="h-4 w-4 text-gray-500 mr-2 shrink-0" />
            <span className="truncate text-gray-600">
              {contact.contactNumber}
            </span>
          </div>

          <div className="pt-3 border-t">
            <div className="flex items-center mb-1">
              <MessageSquare className="h-4 w-4 text-gray-500 mr-2 shrink-0" />
              <h4 className="font-medium text-sm">Subject</h4>
            </div>
            <p className="text-sm line-clamp-1 ml-6">{contact.subject}</p>
          </div>

          <div>
            <p className="text-sm line-clamp-2 text-gray-600 border-l-2 border-gray-200 pl-2 italic">
              {contact.message}
            </p>
          </div>
        </div>

        <div className="p-2 flex justify-end border-t bg-muted/20 mt-auto">
          <Button
            variant="ghost"
            size="sm"
            className="text-primary flex items-center"
          >
            <Reply className="h-4 w-4 mr-1" />
            Reply
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};

export default ContactCard;
