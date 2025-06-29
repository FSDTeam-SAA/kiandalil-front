import Image from "next/image";
import RegisterForm from "@/components/auth/register-form";

export default function RegisterPage() {
  return (
    <div className="min-h-screen flex">
      {/* Left side - Image */}
      <div className="hidden lg:flex lg:w-1/2 relative">
        <Image
          src="/register.jpg"
          alt="Modern apartment interior"
          fill
          className="object-cover"
          priority
        />
        <div className="absolute top-8 left-8">
          <div className="text-white text-2xl font-bold">Hidden Props</div>
        </div>
      </div>

      {/* Right side - Form */}
      <div className="w-full lg:w-1/2 flex items-center justify-center p-8 bg-white">
        <RegisterForm />
      </div>
    </div>
  );
}
