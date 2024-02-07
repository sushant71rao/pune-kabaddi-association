import { Button } from "@/components/ui/button"
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog"



const DocumentView = () => {
    const imageUrl = "http://res.cloudinary.com/dp1kacqux/image/upload/v1706635672/eo66axtyukl9fpxlalxp.png";




    return (
        <Dialog >
            <DialogTrigger asChild>
                <Button variant="outline">View</Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[425px]">
                <DialogHeader>
                    <DialogTitle>Adhar Card</DialogTitle>
                </DialogHeader>
                <img src={imageUrl} alt="img" className="max-h-[900px]" />
            </DialogContent>

        </Dialog>
    )
}

export default DocumentView
