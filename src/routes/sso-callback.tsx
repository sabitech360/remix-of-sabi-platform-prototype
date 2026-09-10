import { createFileRoute } from "@tanstack/react-router";
import { AuthenticateWithRedirectCallback } from "@clerk/clerk-react";

export const Route = createFileRoute("/sso-callback")({
  component: SSOCallback,
});

function SSOCallback() {
  return (
    <div className="min-h-screen flex items-center justify-center">
      <AuthenticateWithRedirectCallback
        signInForceRedirectUrl="/tools"
        signUpForceRedirectUrl="/tools"
      />
    </div>
  );
}