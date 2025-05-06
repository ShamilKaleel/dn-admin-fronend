import React, { useState, useEffect } from "react";
import {
  Search,
  RefreshCw,
  Clock,
  CheckCircle,
  AlertCircle,
  MessageSquare,
} from "lucide-react";
import axiosInstance from "@/api/axiosInstance";
import { ContactUs } from "@/types/contact-us";
import { ResponsiveDialog } from "@/components/responsive-dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useToast } from "@/hooks/use-toast";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import ContactList from "./contact-list";
import ContactUsReplyForm from "./contact-us-reply-form";

const ContactUsAdminPage = () => {
  const [contactUs, setContactUs] = useState<ContactUs[]>([]);
  const [filteredContacts, setFilteredContacts] = useState<ContactUs[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [selectedContactUsID, setSelectedContactUsID] = useState<
    string | number | null
  >(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [activeTab, setActiveTab] = useState("all");
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [sortCriteria, setSortCriteria] = useState("newest");
  const { toast } = useToast();

  useEffect(() => {
    fetchContacts();
  }, []);

  useEffect(() => {
    applyFilters();
  }, [contactUs, searchTerm, activeTab, sortCriteria]);

  const fetchContacts = async () => {
    try {
      setLoading(true);
      const response = await axiosInstance.get("/contacts/all");
      setContactUs(response.data);
    } catch (err) {
      setError("Failed to fetch contact messages.");
      toast({
        title: "Error",
        description: "Failed to load contact messages",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const refreshContacts = async () => {
    setIsRefreshing(true);
    await fetchContacts();
    toast({
      title: "Refreshed",
      description: "Contact messages have been refreshed",
    });
    setIsRefreshing(false);
  };

  const applyFilters = () => {
    let result = [...contactUs];

    // Apply search filter
    if (searchTerm) {
      const lowerCaseSearchTerm = searchTerm.toLowerCase();
      result = result.filter(
        (contact) =>
          contact.name.toLowerCase().includes(lowerCaseSearchTerm) ||
          contact.email.toLowerCase().includes(lowerCaseSearchTerm) ||
          contact.subject.toLowerCase().includes(lowerCaseSearchTerm) ||
          contact.message.toLowerCase().includes(lowerCaseSearchTerm)
      );
    }

    // Apply tab filter based on replySent status
    if (activeTab === "responded") {
      result = result.filter((contact) => contact.replySent);
    } else if (activeTab === "new") {
      result = result.filter((contact) => !contact.replySent);
    }

    // Apply sorting - handling both string and number IDs
    if (sortCriteria === "newest") {
      result = [...result].sort((a, b) => {
        return String(b.id).localeCompare(String(a.id));
      });
    } else if (sortCriteria === "oldest") {
      result = [...result].sort((a, b) => {
        return String(a.id).localeCompare(String(b.id));
      });
    } else if (sortCriteria === "alphabetical") {
      result = [...result].sort((a, b) => a.name.localeCompare(b.name));
    }

    setFilteredContacts(result);
  };

  const handleContactSelect = (id: string | number): void => {
    setSelectedContactUsID(id);
    setIsDialogOpen(true);
  };

  const handleReplySuccess = (contactId: string | number): void => {
    // Update the local state to mark the contact as replied
    setContactUs((prevContacts) =>
      prevContacts.map((contact) =>
        contact.id === contactId ? { ...contact, replySent: true } : contact
      )
    );

    setIsDialogOpen(false);
    toast({
      title: "Reply Sent",
      description: "Your reply has been sent successfully",
    });
  };

  if (loading && contactUs.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center h-full py-20">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mb-4"></div>
        <p className="text-lg text-gray-500">Loading contact messages...</p>
      </div>
    );
  }

  if (error && contactUs.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center h-full py-20">
        <AlertCircle className="h-12 w-12 text-red-500 mb-4" />
        <p className="text-lg text-gray-700">{error}</p>
        <Button variant="outline" className="mt-4" onClick={fetchContacts}>
          Try Again
        </Button>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-6">
      <ResponsiveDialog
        isOpen={isDialogOpen}
        setIsOpen={setIsDialogOpen}
        title="Contact Message Details"
        className="sm:max-w-screen-md"
      >
        <ContactUsReplyForm
          setIsOpen={setIsDialogOpen}
          selectedContactUsID={selectedContactUsID}
          onReplySuccess={handleReplySuccess}
        />
      </ResponsiveDialog>

      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6">
        <div>
          <h1 className="text-2xl font-bold">Contact Messages</h1>
          <p className="text-gray-500">Manage and respond to user inquiries</p>
        </div>
        <Button
          variant="outline"
          size="sm"
          className="mt-2 md:mt-0"
          onClick={refreshContacts}
          disabled={isRefreshing}
        >
          <RefreshCw
            className={`h-4 w-4 mr-2 ${isRefreshing ? "animate-spin" : ""}`}
          />
          Refresh
        </Button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6 mb-6">
        <div className="lg:col-span-3">
          <div className="flex flex-col sm:flex-row gap-3 mb-4">
            <div className="relative flex-grow">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
              <Input
                placeholder="Search contacts..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
            <Select value={sortCriteria} onValueChange={setSortCriteria}>
              <SelectTrigger className="w-full sm:w-40">
                <SelectValue placeholder="Sort by" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="newest">Newest First</SelectItem>
                <SelectItem value="oldest">Oldest First</SelectItem>
                <SelectItem value="alphabetical">Name (A-Z)</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <Tabs
            defaultValue="all"
            value={activeTab}
            onValueChange={setActiveTab}
          >
            <TabsList className="mb-4">
              <TabsTrigger value="all">All Messages</TabsTrigger>
              <TabsTrigger value="new">
                New
                <Badge variant="outline" className="ml-2 bg-primary text-white">
                  {contactUs.filter((c) => !c.replySent).length}
                </Badge>
              </TabsTrigger>
              <TabsTrigger value="responded">Responded</TabsTrigger>
            </TabsList>

            <TabsContent value="all" className="m-0">
              <ContactList
                contacts={filteredContacts}
                onSelect={handleContactSelect}
              />
            </TabsContent>
            <TabsContent value="new" className="m-0">
              <ContactList
                contacts={filteredContacts}
                onSelect={handleContactSelect}
              />
            </TabsContent>
            <TabsContent value="responded" className="m-0">
              <ContactList
                contacts={filteredContacts}
                onSelect={handleContactSelect}
              />
            </TabsContent>
          </Tabs>
        </div>

        <div className="lg:col-span-1">
          <Card>
            <CardContent className="p-4">
              <h3 className="text-lg font-medium mb-4">Contact Statistics</h3>
              <div className="space-y-4">
                <div className="flex justify-between items-center">
                  <div className="flex items-center">
                    <MessageSquare className="h-5 w-5 text-gray-500 mr-2" />
                    <span>Total Messages</span>
                  </div>
                  <Badge variant="outline" className="ml-2 font-medium">
                    {contactUs.length}
                  </Badge>
                </div>
                <div className="flex justify-between items-center">
                  <div className="flex items-center">
                    <AlertCircle className="h-5 w-5 text-amber-500 mr-2" />
                    <span>Pending</span>
                  </div>
                  <Badge
                    variant="outline"
                    className="ml-2 font-medium bg-amber-100 text-amber-800 dark:bg-amber-900 dark:text-amber-300"
                  >
                    {contactUs.filter((c) => !c.replySent).length}
                  </Badge>
                </div>
                <div className="flex justify-between items-center">
                  <div className="flex items-center">
                    <CheckCircle className="h-5 w-5 text-green-500 mr-2" />
                    <span>Responded</span>
                  </div>
                  <Badge
                    variant="outline"
                    className="ml-2 font-medium bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300"
                  >
                    {contactUs.filter((c) => c.replySent).length}
                  </Badge>
                </div>
                <div className="flex justify-between items-center">
                  <div className="flex items-center">
                    <Clock className="h-5 w-5 text-blue-500 mr-2" />
                    <span>Response Rate</span>
                  </div>
                  <Badge variant="outline" className="ml-2 font-medium">
                    {contactUs.length
                      ? Math.round(
                          (contactUs.filter((c) => c.replySent).length /
                            contactUs.length) *
                            100
                        ) + "%"
                      : "0%"}
                  </Badge>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="mt-4">
            <CardContent className="p-4">
              <h3 className="text-lg font-medium mb-4">Quick Tips</h3>
              <ul className="space-y-2 text-sm">
                <li className="flex items-start">
                  <div className="bg-primary/10 rounded-full p-1 mr-2 mt-0.5">
                    <CheckCircle className="h-3 w-3 text-primary" />
                  </div>
                  <span>Aim to respond to all inquiries within 24 hours</span>
                </li>
                <li className="flex items-start">
                  <div className="bg-primary/10 rounded-full p-1 mr-2 mt-0.5">
                    <CheckCircle className="h-3 w-3 text-primary" />
                  </div>
                  <span>Address the person by name in your response</span>
                </li>
                <li className="flex items-start">
                  <div className="bg-primary/10 rounded-full p-1 mr-2 mt-0.5">
                    <CheckCircle className="h-3 w-3 text-primary" />
                  </div>
                  <span>Be clear and concise in your communications</span>
                </li>
                <li className="flex items-start">
                  <div className="bg-primary/10 rounded-full p-1 mr-2 mt-0.5">
                    <CheckCircle className="h-3 w-3 text-primary" />
                  </div>
                  <span>Always include contact information for follow-up</span>
                </li>
              </ul>
            </CardContent>
          </Card>
        </div>
      </div>

      {filteredContacts.length === 0 && !loading && (
        <div className="flex flex-col items-center justify-center py-12 text-center">
          <MessageSquare className="h-12 w-12 text-gray-300 mb-4" />
          <h3 className="text-lg font-medium text-gray-900 dark:text-gray-100">
            No messages found
          </h3>
          <p className="text-gray-500 mt-2 max-w-md">
            {searchTerm
              ? "Try adjusting your search terms or filters"
              : "When users send contact messages, they will appear here"}
          </p>
        </div>
      )}
    </div>
  );
};

export default ContactUsAdminPage;
