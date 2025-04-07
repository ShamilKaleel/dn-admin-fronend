import { Link, NavLink } from "react-router-dom";
import { CircleUser, Menu } from "lucide-react";
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
import { useState } from "react";

export default function Layout() {
  const [isOpen, setIsOpen] = useState(false);
  const { logout, authState } = useAuth();
  const userRoles = authState?.roles || [];

  const filteredNavLinks = navLinks.filter((link) =>
    hasAccess(userRoles, link.path)
  );

  const handleLogout = async () => {
    try {
      await logout();
    } catch (error: any) {
      console.log(error);
    } finally {
    }
  };
  return (
    <div className="xl:grid min-h-screen w-full grid-cols-[220px_1fr] xl:grid-cols-[250px_1fr]">
      <div className="hidden border-r bg-muted dark:bg-muted/40 xl:block">
        <div className="flex h-full max-h-screen flex-col gap-2">
          <div className="flex  items-center border-b px-4  lg:px-6">
            <div className="mb-10">
              <Link
                to="/"
                className=" flex flex-col items-start gap-2 text-lg "
              >
                <div className="w-full pl-14">
                  <img src={Logo} className="h-20 w-20 " />
                </div>

                <span className="text-[25px] text-center  font-bold ">
                  DN Dental Clinic
                </span>
              </Link>
            </div>
            {/* <Button variant="outline" size="icon" className="ml-auto h-8 w-8">
              <Bell className="h-4 w-4" />
              <span className="sr-only">Toggle notifications</span>
            </Button> */}
          </div>
          <div className="flex-1">
            <nav className="grid items-start px-2 text-sm font-medium lg:px-4">
              {filteredNavLinks.map((link) => (
                <NavLink
                  key={link.path}
                  to={link.path}
                  className={({ isActive }) =>
                    isActive
                      ? "flex items-center gap-3 rounded-lg bg-muted px-3 py-2 text-primary transition-all hover:text-primary"
                      : "flex items-center gap-3 rounded-lg px-3 py-2 text-muted-foreground transition-all hover:text-primary "
                  }
                >
                  {link.icon}
                  <span>{link.title}</span>
                </NavLink>
              ))}
            </nav>
          </div>

          {/*Card*/}
          <div className="mt-auto p-4">
            {/* <Card x-chunk="dashboard-02-chunk-0">
              <CardHeader className="p-2 pt-0 md:p-4">
                <CardTitle>Upgrade to Pro</CardTitle>
                <CardDescription>
                  Unlock all features and get unlimited access to our support
                  team.
                </CardDescription>
              </CardHeader>
              <CardContent className="p-2 pt-0 md:p-4 md:pt-0">
                <Button size="sm" className="w-full">
                  Upgrade
                </Button>
              </CardContent>
            </Card> */}
          </div>
        </div>
      </div>

      <div className="flex flex-col ">
        <header className="flex h-14  items-center gap-4 border-b bg-muted dark:bg-muted/40 px-4 lg:h-[60px] lg:px-6">
          <Sheet>
            <SheetTrigger asChild>
              <Button
                variant="outline"
                size="icon"
                className="shrink-0 xl:hidden"
              >
                <Menu className="h-5 w-5" />
                <span className="sr-only">Toggle navigation menu</span>
              </Button>
            </SheetTrigger>
            <SheetContent side="left" className="flex flex-col  dark:bg-muted ">
              <nav className="grid gap-2 text-lg font-medium relative">
                <div className="mb-10">
                  <Link
                    to="/"
                    className=" flex flex-col items-start gap-2 text-lg font-bold "
                  >
                    <div className="w-full pl-14">
                      <img src={Logo} className="h-20 w-20 " />
                    </div>

                    <span className="text-[25px] text-center text-primary">
                      DN Dental Clinic
                    </span>
                  </Link>
                </div>

                {filteredNavLinks.map((link) => (
                  <NavLink
                    key={link.path}
                    to={link.path}
                    className={({ isActive }) =>
                      isActive
                        ? "mx-[-0.65rem] flex items-center gap-4 rounded-xl bg-muted px-3 py-2 text-black dark:text-foreground hover:text-foreground"
                        : "mx-[-0.65rem] flex items-center gap-4 rounded-xl px-3 py-2 dark:text-muted-foreground dark:hover:text-foreground "
                    }
                  >
                    {link.icon}
                    <span>{link.title}</span>
                  </NavLink>
                ))}
              </nav>
            </SheetContent>
          </Sheet>
          <div className="w-full  flex-1">
            <Link
              to="/"
              className=" flex justify-start items-center gap-2 text-lg xl:hidden"
            >
              <div className=" ">
                <img src={Logo} className="h-8 w-8 " />
              </div>

              <span className=" font-bold text-primary">DN Dental </span>
            </Link>
          </div>

          <ModeToggle />
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="secondary" size="icon" className="rounded-full">
                <CircleUser className="h-5 w-5" />
                <span className="sr-only">Toggle user menu</span>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuLabel>My Account</DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuItem>Settings</DropdownMenuItem>
              <DropdownMenuItem>Support</DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem onClick={() => setIsOpen(true)}>
                Logout
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </header>

        <main className=" flex flex-1  flex-col lg:p-4 pt-4 overflow-hidden  ">
          {isOpen && (
            <ResponsiveDialog
              isOpen={isOpen}
              setIsOpen={setIsOpen}
              title="Logout"
              description="Are you sure you want to log out?"
            >
              <div className="grid grid-flow-col gap-5 px-4">
                <Button
                  onClick={() => setIsOpen(false)}
                  variant="outline"
                  className="w-full"
                >
                  Cancel
                </Button>
                <Button
                  onClick={handleLogout}
                  variant="default"
                  className="w-full"
                >
                  Logout
                </Button>
              </div>
            </ResponsiveDialog>
          )}

          <Outlet />
        </main>
      </div>
    </div>
  );
}
