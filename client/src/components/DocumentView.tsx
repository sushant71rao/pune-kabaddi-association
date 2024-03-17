import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogTrigger } from "@/components/ui/dialog";
import { Eye } from "lucide-react";

interface DocumentViewProps {
  imgUrl: string;
  buttonName?: string;
}

const DocumentView: React.FC<DocumentViewProps> = ({ imgUrl, buttonName }) => {
  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button className="flex gap-2 items-center">
          {buttonName}
          <Eye />
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <img src={imgUrl} alt="img" className="max-h-[900px]" />
      </DialogContent>
    </Dialog>
  );
};

export default DocumentView;
