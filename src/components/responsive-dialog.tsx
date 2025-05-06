import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Drawer,
  DrawerClose,
  DrawerContent,
  DrawerDescription,
  DrawerFooter,
  DrawerHeader,
  DrawerTitle,
  DrawerTrigger,
} from "@/components/ui/drawer";
import { useMediaQuery } from "@/hooks/useMediaQuery";

// In your ResponsiveDialog component
export function ResponsiveDialog({
  children,
  isOpen,
  setIsOpen,
  title,
  description,
  className,
}: {
  children: React.ReactNode;
  isOpen: boolean;
  setIsOpen: React.Dispatch<React.SetStateAction<boolean>>;
  title: string;
  description?: string;
  className?: string;
}) {
  const isDesktop = useMediaQuery("(min-width: 768px)");

  if (isDesktop) {
    return (
      <Dialog open={isOpen} onOpenChange={setIsOpen}>
        <DialogContent
          className={`${className ?? "sm:max-w-[425px] "}`}
          // Add this line to fix the warning when no description is provided
          aria-describedby={description ? undefined : "dialog-content"}
        >
          <DialogHeader>
            <DialogTitle className="text-2xl font-bold mb-4">
              {title}
            </DialogTitle>
            {description && (
              <DialogDescription className=" ">{description}</DialogDescription>
            )}
          </DialogHeader>
          {children}
        </DialogContent>
      </Dialog>
    );
  }

  return (
    <Drawer open={isOpen} onOpenChange={setIsOpen}>
      <DrawerContent>
        <DrawerHeader className="text-center ">
          <DrawerTitle>{title}</DrawerTitle>
          {description && (
            // Fix this line - it should be DrawerDescription, not DialogDescription
            <DrawerDescription className="mb-3 text-center">
              {description}
            </DrawerDescription>
          )}
        </DrawerHeader>
        {children}
        <DrawerFooter className="pt-2 mt-5"></DrawerFooter>
      </DrawerContent>
    </Drawer>
  );
}
