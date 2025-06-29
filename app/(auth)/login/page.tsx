import Image from "next/image";
import LoginForm from "@/components/auth/login-form";

export default function LoginPage() {
  return (
    <div className="min-h-screen flex">
      {/* Left side - Image */}
      <div className="hidden lg:flex lg:w-1/2 relative">
        <Image
          src="/login.jpg"
          alt="Interior design"
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
        <LoginForm />
      </div>
    </div>
  );
}
