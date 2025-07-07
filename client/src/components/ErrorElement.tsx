import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { AlertCircle } from "lucide-react";
import { useEffect } from "react";
import {
  isRouteErrorResponse,
  useNavigate,
  useRouteError,
} from "react-router-dom";
// import { logErrorElementToAPI } from "@services/health"; // Uncomment once the API service is implemented

const ErrorElement = () => {
  const error = useRouteError();
  const navigate = useNavigate();

  const handleRefresh = () => {
    window.location.reload();
  };

  const handleHome = () => {
    navigate("/");
  };

  useEffect(() => {
    if (error) {
      let errorMessage = "";
      try {
        if (error instanceof Error) {
          errorMessage = error.message;
        } else if (isRouteErrorResponse(error)) {
          errorMessage = error.statusText || `HTTP ${error.status}`;
        } else {
          errorMessage = JSON.stringify(error);
        }
      } catch {
        errorMessage = "Something went wrong.";
        console.error("Error parsing error object:", errorMessage);
      }
      // logErrorElementToAPI(errorMessage);
    }
  }, [error]);

  return (
    <div className="flex h-screen w-full items-center justify-center bg-muted px-4">
      <Card className="w-full max-w-md shadow-xl">
        <CardContent className="p-6 space-y-6">
          <Alert variant="destructive">
            <AlertCircle className="h-5 w-5" />
            <AlertTitle>Oops! Something went wrong</AlertTitle>
            <AlertDescription>
              This page is playing hide and seek. We're on it!
            </AlertDescription>
          </Alert>

          <p className="text-sm text-muted-foreground text-center">
            Please try refreshing the page or go back to the homepage.
          </p>

          <div className="flex flex-col gap-3">
            <Button onClick={handleRefresh} className="w-full">
              Refresh Page
            </Button>
            <Button
              onClick={handleHome}
              variant="outline"
              className="w-full text-primary"
            >
              Go to Home
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default ErrorElement;
