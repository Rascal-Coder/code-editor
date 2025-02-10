import { useCodeEditorStore } from "@/store/useCodeEditorStore";
import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

function ShareSnippetDialog({
  onClose,
  open,
}: {
  onClose: () => void;
  open: boolean;
}) {
  const [title, setTitle] = useState("");
  const [isSharing, setIsSharing] = useState(false);
  const { language, getCode } = useCodeEditorStore();

  const handleShare = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSharing(true);

    try {
      const code = getCode();
      onClose();
      setTitle("");
    } catch (error) {
      console.log("Error creating snippet:", error);
    } finally {
      setIsSharing(false);
    }
  };

  const handleClose = () => {
    setTimeout(onClose, 300);
  };

  return (
    <Dialog open={open} onOpenChange={handleClose}>
      <DialogContent className="bg-[#1e1e2e] border-[#313244] sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="text-xl font-semibold text-white">
            Share Snippet
          </DialogTitle>
          <DialogDescription className="text-gray-400">
            Share your code snippet with others by giving it a title.
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleShare} className="space-y-4">
          <div className="space-y-2">
            <label
              htmlFor="title"
              className="text-sm font-medium text-gray-400"
            >
              Title
            </label>
            <Input
              id="title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="bg-[#181825] border-[#313244] text-white focus-visible:ring-blue-500"
              placeholder="Enter snippet title"
              required
            />
          </div>

          <div className="flex justify-end gap-3">
            <Button
              type="button"
              variant="ghost"
              onClick={onClose}
              className="text-gray-400 hover:text-gray-300 hover:bg-[#313244]"
            >
              Cancel
            </Button>
            <Button
              type="submit"
              disabled={isSharing}
              className="bg-blue-500 text-white hover:bg-blue-600 
              disabled:opacity-50"
            >
              {isSharing ? "Sharing..." : "Share"}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}

export default ShareSnippetDialog;
