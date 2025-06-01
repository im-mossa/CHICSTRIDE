// src/app/signUp/page.jsx
import React from "react";
import SignUpForm from "@/app/components/SignUpForm";

export default function SignUpPage() {
  return (
    <div className="py-4 min-h-screen flex items-center justify-center text-black">
      <SignUpForm />
    </div>
  );
}
