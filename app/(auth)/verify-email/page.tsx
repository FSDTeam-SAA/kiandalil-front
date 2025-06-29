"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import VerifyOtpForm from "@/components/auth/verify-otp-form";

export default function VerifyEmailPage() {
  const [email, setEmail] = useState("");
  const router = useRouter();

  useEffect(() => {
    const storedEmail = localStorage.getItem("verificationEmail");
    if (!storedEmail) {
      router.push("/register");
      return;
    }
    setEmail(storedEmail);
  }, [router]);

  if (!email) {
    return <div>Loading...</div>;
  }

  return (
    <div className="min-h-screen flex">
      {/* Left side - Image */}
      <div className="hidden lg:flex lg:w-1/2 relative">
        <Image
          src="/images/signup-bg.png"
          alt="Modern apartment interior"
          fill
          className="object-cover"
          priority
        />
        <div className="absolute top-8 left-8">
          <div className="text-white text-2xl font-bold">swag</div>
        </div>
      </div>

      {/* Right side - Form */}
      <div className="w-full lg:w-1/2 flex items-center justify-center p-8 bg-gray-50">
        <VerifyOtpForm email={email} />
      </div>
    </div>
  );
}
