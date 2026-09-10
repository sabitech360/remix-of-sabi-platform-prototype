import { createFileRoute } from "@tanstack/react-router";
import { SignUp } from "@clerk/clerk-react";

export const Route = createFileRoute("/sign-up")({
  component: SignUpPage,
});

function SignUpPage() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-background">
      <SignUp
        routing="path"
        path="/sign-up"
        signInUrl="/sign-in"
        fallbackRedirectUrl="/tools"
        forceRedirectUrl="/tools"
      />
    </div>
  );
}