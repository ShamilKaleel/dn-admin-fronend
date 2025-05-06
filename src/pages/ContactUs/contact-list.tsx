import React from "react";
import { ContactUs } from "@/types/contact-us";
import ContactCard from "./contact-card";

interface ContactListProps {
  contacts: ContactUs[];
  onSelect: (id: string | number) => void;
}

const ContactList: React.FC<ContactListProps> = ({ contacts, onSelect }) => {
  if (contacts.length === 0) {
    return null;
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
      {contacts.map((contact) => (
        <ContactCard key={contact.id} contact={contact} onSelect={onSelect} />
      ))}
    </div>
  );
};

export default ContactList;
