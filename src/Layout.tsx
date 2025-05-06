import { Link, NavLink, useLocation, useNavigate } from "react-router-dom";
import {
  CircleUser,
  Menu,
  LogOut,
  Settings,
  User,
  HelpCircle,
  Bell,
  X,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { ModeToggle } from "@/components/mode-toggle";
import { useAuth } from "@/hooks/useAuth";
import { navLinks } from "@/constant";
import { Outlet } from "react-router-dom";
import Logo from "@/assets/images/Logo.png";
import { hasAccess } from "@/lib/roleAccess";
import { ResponsiveDialog } from "@/components/responsive-dialog";
import { useToast } from "@/hooks/use-toast";
import { useState, useEffect } from "react";

// Add CSS for custom scrollbar styling
const scrollbarStyles = `
.scrollbar-thin::-webkit-scrollbar {
  width: 5px;
}

.scrollbar-thin::-webkit-scrollbar-track {
  background: transparent;
}

.scrollbar-thin::-webkit-scrollbar-thumb {
  background-color: rgba(155, 155, 155, 0.5);
  border-radius: 20px;
}

.dark .scrollbar-thin::-webkit-scrollbar-thumb {
  background-color: rgba(75, 75, 75, 0.5);
}

.scrollbar-thin {
  scrollbar-width: thin;
  scrollbar-color: rgba(155, 155, 155, 0.5) transparent;
}

.dark .scrollbar-thin {
  scrollbar-color: rgba(75, 75, 75, 0.5) transparent;
}
`;

export default function Layout() {
  const [isOpen, setIsOpen] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const { logout, authState } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const { toast } = useToast();
  const userRoles = authState?.roles || [];

  const filteredNavLinks = navLinks.filter((link) =>
    hasAccess(userRoles, link.path)
  );

  // Get current page title from navigation links
  const currentPage =
    navLinks.find((link) => link.path === location.pathname)?.title ||
    "Dashboard";

  // Effect to close mobile menu when route changes
  useEffect(() => {
    setIsMobileMenuOpen(false);
  }, [location.pathname]);

  const handleLogout = async () => {
    try {
      await logout();
      toast({
        title: "Logged out successfully",
        description: "You have been logged out of your account",
      });
      navigate("/login");
    } catch (error: any) {
      console.log(error);
      toast({
        title: "Logout Failed",
        description: "An error occurred while logging out",
        variant: "destructive",
      });
    }
  };

  return (
    <div className="flex h-screen w-full overflow-hidden">
      {/* Desktop Sidebar */}
      <div className="hidden border-r bg-muted dark:bg-muted/40 lg:block lg:w-64 xl:w-72">
        <div className="flex h-full flex-col">
          {/* Logo area */}
          <div className="flex items-center justify-center border-b py-6">
            <Link to="/" className="flex flex-col items-center gap-2">
              <img src={Logo} className="h-16 w-16" alt="DN Dental Logo" />
              <span className="text-xl font-bold text-primary">
                DN Dental Clinic
              </span>
            </Link>
          </div>

          {/* Navigation */}
          <div className="flex-1 py-4 overflow-hidden hover:overflow-y-auto scrollbar-thin scrollbar-thumb-rounded scrollbar-thumb-gray-300 dark:scrollbar-thumb-gray-700">
            <nav className="space-y-1 px-3">
              {filteredNavLinks.map((link) => (
                <NavLink
                  key={link.path}
                  to={link.path}
                  className={({ isActive }) =>
                    `flex items-center gap-3 rounded-lg px-4 py-3 text-sm font-medium transition-all ${
                      isActive
                        ? "bg-primary/10 text-primary"
                        : "text-muted-foreground hover:bg-muted hover:text-foreground"
                    }`
                  }
                >
                  <span className="text-lg">{link.icon}</span>
                  <span>{link.title}</span>
                </NavLink>
              ))}
            </nav>
          </div>

          {/* Elegant, minimal user section with application-matching colors */}
          <div className="mt-auto border-t border-border/40">
            <div className="flex items-center justify-between p-4 bg-muted dark:bg-muted/40">
              <div className="flex items-center gap-2">
                <div className="flex h-8 w-8 items-center justify-center rounded-full bg-primary/10 dark:bg-primary/20">
                  <CircleUser className="h-4 w-4 text-primary" />
                </div>
                <p className="text-sm font-medium text-primary/90 dark:text-primary/80">
                  {authState?.username || "User"}
                </p>
              </div>
              <Button
                variant="ghost"
                size="icon"
                className="h-8 w-8 rounded-full text-muted-foreground hover:bg-primary/10 hover:text-primary"
                onClick={() => setIsOpen(true)}
              >
                <LogOut className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </div>
      </div>

      {/* Main content */}
      <div className="flex flex-1 flex-col overflow-hidden">
        {/* Header */}
        <header className="flex h-14 items-center justify-between border-b bg-muted dark:bg-muted/40 px-4 lg:h-[60px] lg:px-6">
          {/* Left side - Mobile menu & title */}
          <div className="flex items-center gap-4">
            <Sheet open={isMobileMenuOpen} onOpenChange={setIsMobileMenuOpen}>
              <SheetTrigger asChild>
                <Button variant="ghost" size="icon" className="lg:hidden">
                  <Menu className="h-5 w-5" />
                  <span className="sr-only">Toggle navigation menu</span>
                </Button>
              </SheetTrigger>
              <SheetContent side="left" className="w-72 p-0">
                <div className="flex h-full flex-col">
                  {/* Mobile menu header */}
                  <div className="flex items-center justify-between border-b p-4">
                    <Link to="/" className="flex items-center gap-2">
                      <img src={Logo} className="h-8 w-8" alt="Logo" />
                      <span className="text-lg font-bold text-primary">
                        DN Dental
                      </span>
                    </Link>
                  </div>

                  {/* Mobile menu navigation */}
                  <div className="flex-1 py-4 overflow-hidden hover:overflow-y-auto scrollbar-thin scrollbar-thumb-rounded scrollbar-thumb-gray-300 dark:scrollbar-thumb-gray-700">
                    <nav className="space-y-1 px-3">
                      {filteredNavLinks.map((link) => (
                        <NavLink
                          key={link.path}
                          to={link.path}
                          onClick={() => setIsMobileMenuOpen(false)}
                          className={({ isActive }) =>
                            `flex items-center gap-3 rounded-lg px-4 py-3 text-sm font-medium transition-all ${
                              isActive
                                ? "bg-primary/10 text-primary"
                                : "text-muted-foreground hover:bg-muted hover:text-foreground"
                            }`
                          }
                        >
                          <span className="text-lg">{link.icon}</span>
                          <span>{link.title}</span>
                        </NavLink>
                      ))}
                    </nav>
                  </div>

                  {/* Elegant, minimal user section for mobile with application-matching colors */}
                  <div className="mt-auto border-t border-border/40">
                    <div className="flex items-center justify-between p-4 bg-muted dark:bg-muted/40">
                      <div className="flex items-center gap-2">
                        <div className="flex h-8 w-8 items-center justify-center rounded-full bg-primary/10 dark:bg-primary/20">
                          <CircleUser className="h-4 w-4 text-primary" />
                        </div>
                        <p className="text-sm font-medium text-primary/90 dark:text-primary/80">
                          {authState?.username || "User"}
                        </p>
                      </div>
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-8 w-8 rounded-full text-muted-foreground hover:bg-primary/10 hover:text-primary"
                        onClick={() => {
                          setIsMobileMenuOpen(false);
                          setIsOpen(true);
                        }}
                      >
                        <LogOut className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                </div>
              </SheetContent>
            </Sheet>

            <div className="lg:hidden">
              <Link to="/" className="flex items-center gap-2">
                <img src={Logo} className="h-8 w-8" alt="Logo" />
                <span className="font-bold text-primary">DN Dental</span>
              </Link>
            </div>

            {/* Removed the current page indicator */}
          </div>

          {/* Right side - User actions */}
          <div className="flex items-center gap-2">
            <ModeToggle />

            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button
                  variant="secondary"
                  size="icon"
                  className="rounded-full"
                >
                  <CircleUser className="h-5 w-5" />
                  <span className="sr-only">User menu</span>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-56">
                <DropdownMenuLabel>My Account</DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={() => navigate("/profile")}>
                  <User className="mr-2 h-4 w-4" />
                  Profile
                </DropdownMenuItem>
                <DropdownMenuItem>
                  <Settings className="mr-2 h-4 w-4" />
                  Settings
                </DropdownMenuItem>
                <DropdownMenuItem>
                  <HelpCircle className="mr-2 h-4 w-4" />
                  Support
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={() => setIsOpen(true)}>
                  <LogOut className="mr-2 h-4 w-4" />
                  Logout
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </header>

        {/* Main content area */}
        {/* Add the scrollbar styles to the document */}
        <style dangerouslySetInnerHTML={{ __html: scrollbarStyles }} />

        <main className="flex-1 overflow-auto p-4 lg:p-6 scrollbar-thin scrollbar-thumb-rounded scrollbar-thumb-gray-300 dark:scrollbar-thumb-gray-700">
          {/* Logout confirmation dialog */}
          {isOpen && (
            <ResponsiveDialog
              isOpen={isOpen}
              setIsOpen={setIsOpen}
              title="Logout"
              description="Are you sure you want to log out of your account?"
            >
              <div className="flex justify-between items-center gap-4 pt-6 px-2 border-t mt-6">
                <Button
                  onClick={() => setIsOpen(false)}
                  variant="outline"
                  className="flex-1 py-2"
                >
                  Cancel
                </Button>
                <Button
                  onClick={handleLogout}
                  variant="destructive"
                  className="flex-1 py-2"
                >
                  Logout
                </Button>
              </div>
            </ResponsiveDialog>
          )}

          {/* Page content */}
          <Outlet />
        </main>
      </div>
    </div>
  );
}
