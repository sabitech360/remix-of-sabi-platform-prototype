import { createFileRoute } from "@tanstack/react-router";
import { SignIn } from "@clerk/clerk-react";

export const Route = createFileRoute("/sign-in")({
  component: SignInPage,
});

function SignInPage() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-background">
      <SignIn
        routing="path"
        path="/sign-in"
        signUpUrl="/sign-up"
        fallbackRedirectUrl="/tools"
        forceRedirectUrl="/tools"
      />
    </div>
  );
}