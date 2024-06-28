import { Button } from "@/components/ui/button";
import {
  type DialogProps,
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

interface Props extends DialogProps {
  onDelete: () => Promise<void>;
  onClose: () => void;
  title?: string | null | undefined;
  loading?: boolean;
}

export function ProfileDeleteDialog({
  onClose,
  open,
  title,
  onDelete,
  loading,
}: Props) {
  function closeModal() {
    onClose();
  }

  async function handleDelete() {
    try {
      await onDelete();
      closeModal();
    } catch (error) {
      console.log(error);
    }
  }

  return (
    <Dialog open={open} onOpenChange={closeModal}>
      <DialogContent className="">
        <DialogHeader>
          <DialogTitle>Delete profile</DialogTitle>
        </DialogHeader>

        <p>
          Are you sure you want to delete profile{" "}
          <span className="font-semibold">{title}</span>? You’ll lose all your
          links associated with this profile.
        </p>

        <DialogFooter>
          <Button variant="outline" onClick={closeModal} className="w-full">
            Cancel
          </Button>
          <Button
            variant="destructive"
            className="w-full"
            onClick={handleDelete}
            loading={loading}
          >
            Delete
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
