import { useState } from "react";
import { Button } from "@/components/ui/button";
import { useReceptionist } from "@/hooks/useReceptionist";
import { useToast } from "@/hooks/use-toast";

interface ReceptionistDeleteFormProps {
  cardId: string;
  setIsOpen: (isOpen: boolean) => void;
}

const ReceptionistDeleteForm: React.FC<ReceptionistDeleteFormProps> = ({
  cardId,
  setIsOpen,
}) => {
  const [isDeleting, setIsDeleting] = useState(false);
  const { deleteReceptionist } = useReceptionist();
  const { toast } = useToast();

  const handleDelete = async () => {
    setIsDeleting(true);
    try {
      await deleteReceptionist(cardId);

      toast({
        title: "Receptionist deleted",
        description: "Receptionist deleted successfully",
      });
    } catch (error: any) {
      console.error("Error deleting receptionist:", error);
      toast({
        title: "Uh oh! Something went wrong.",
        description:
          error.response?.data?.details?.error || "An error occurred",
        variant: "destructive",
      });
    } finally {
      setIsDeleting(false);
      setIsOpen(false);
    }
  };

  return (
    <div className="flex flex-col gap-4">
      <div className="grid grid-flow-col gap-5 px-4">
        <Button
          variant="outline"
          onClick={() => setIsOpen(false)}
          disabled={isDeleting}
          className="w-full"
        >
          Cancel
        </Button>
        <Button
          variant="destructive"
          onClick={handleDelete}
          disabled={isDeleting}
          className="w-full"
        >
          {isDeleting ? "Deleting..." : "Delete"}
        </Button>
      </div>
    </div>
  );
};

export default ReceptionistDeleteForm;
