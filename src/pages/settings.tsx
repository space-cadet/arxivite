import { useState } from "react";
import { 
  Card, 
  CardContent, 
  CardDescription, 
  CardFooter, 
  CardHeader, 
  CardTitle 
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { 
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { Trash2, RefreshCcw } from "lucide-react";
import { useBookmarkContext } from "@/lib/bookmarks/context";
import { useToast } from "@/hooks/use-toast";
import { ProfileSettings } from "@/components/settings/profile-settings";
import { ResearchInterestSettings } from "@/components/settings/research-interest-settings";

export default function SettingsPage() {
  const [isClearing, setIsClearing] = useState(false);
  const { toast } = useToast();
  const bookmarkContext = useBookmarkContext();
  
  // Function to clear all bookmarks
  const handleClearBookmarks = () => {
    try {
      setIsClearing(true);
      
      // Use the resetBookmarks function from context to properly reset
      bookmarkContext.resetBookmarks();
      
      toast({
        title: "Bookmarks cleared",
        description: "All bookmarks have been removed successfully.",
      });
    } catch (error) {
      console.error("Error clearing bookmarks:", error);
      toast({
        title: "Error clearing bookmarks",
        description: "There was a problem clearing your bookmarks.",
        variant: "destructive",
      });
    } finally {
      setIsClearing(false);
    }
  };

  return (
    <div className="w-full max-w-7xl mx-auto px-4 py-4 md:py-6 space-y-4 md:space-y-6">
      <div className="flex flex-col md:flex-row md:justify-between md:items-center gap-4">
        <h1 className="text-2xl md:text-3xl font-bold">Settings</h1>
      </div>

      <div className="grid gap-4">
        <ResearchInterestSettings />
        <Card>
          <CardHeader>
            <CardTitle>Bookmarks</CardTitle>
            <CardDescription>
              Manage your saved paper bookmarks
            </CardDescription>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-muted-foreground">
              Clear all bookmarks from your library. This action cannot be undone.
            </p>
          </CardContent>
          <CardFooter>
            <AlertDialog>
              <AlertDialogTrigger asChild>
                <Button variant="destructive" disabled={isClearing}>
                  <Trash2 className="mr-2 h-4 w-4" />
                  Clear All Bookmarks
                </Button>
              </AlertDialogTrigger>
              <AlertDialogContent>
                <AlertDialogHeader>
                  <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
                  <AlertDialogDescription>
                    This action cannot be undone. This will permanently delete all your
                    bookmarked papers from your local storage.
                  </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                  <AlertDialogCancel>Cancel</AlertDialogCancel>
                  <AlertDialogAction 
                    onClick={handleClearBookmarks}
                    className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
                  >
                    {isClearing ? (
                      <>
                        <RefreshCcw className="mr-2 h-4 w-4 animate-spin" />
                        Clearing...
                      </>
                    ) : (
                      "Delete All Bookmarks"
                    )}
                  </AlertDialogAction>
                </AlertDialogFooter>
              </AlertDialogContent>
            </AlertDialog>
          </CardFooter>
        </Card>
      </div>
    </div>
  );
}
