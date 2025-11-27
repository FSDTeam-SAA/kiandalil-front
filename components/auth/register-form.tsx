"use client";

import type React from "react";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { ArrowLeft, Eye, EyeOff, Loader2 } from "lucide-react";
import Link from "next/link";
import { signIn } from "next-auth/react";

export default function RegisterForm() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phonNum: "",
    password: "",
    confirmPassword: "",
  });
  const [agreeToTerms, setAgreeToTerms] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [isGoogleLoading, setIsGoogleLoading] = useState(false);
  const router = useRouter();

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError("");

    if (formData.password !== formData.confirmPassword) {
      setError("Passwords do not match");
      setIsLoading(false);
      return;
    }

    if (!agreeToTerms) {
      setError("Please agree to the Terms & Conditions");
      setIsLoading(false);
      return;
    }

    try {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/user/register`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            name: formData.name,
            email: formData.email,
            password: formData.password,
            phonNum: Number.parseInt(formData.phonNum),
          }),
        }
      );

      const data = await response.json();

      if (response.ok && data.success) {
        localStorage.setItem("verificationEmail", formData.email);
        router.push("/verify-email");
      } else {
        setError(data.message || "Registration failed. Please try again.");
      }
    } catch (error) {
      setError("An error occurred. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };
  const handleGoogleSignIn = async () => {
    setIsGoogleLoading(true);
    setError("");
    try {
      await signIn("google", { callbackUrl: "/" });
    } catch (error) {
      setError("Google sign-in failed. Please try again.");
    } finally {
      setIsGoogleLoading(false);
    }
  };

  return (
    <div className="w-full max-w-md space-y-6">
      <div className="flex flex-col md:flex-row gap-y-12 items-center gap-x-12">
        <Link href="/" className="flex items-center">
          <ArrowLeft className="inline-block w-5 h-5 mr-2" />
          <p>Go Home</p>
        </Link>
        <div className="space-y-2 text-center">
          <h1 className="text-3xl font-bold text-gray-900">Create New Account</h1>
          <p className="text-gray-600">Please enter details</p>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor="name" className="text-gray-700 font-medium">
            Name
          </Label>
          <Input
            id="name"
            name="name"
            type="text"
            placeholder="Enter your full name"
            value={formData.name}
            onChange={handleChange}
            required
            className="h-12"
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="email" className="text-gray-700 font-medium">
            Email Address
          </Label>
          <Input
            id="email"
            name="email"
            type="email"
            placeholder="Enter your email address"
            value={formData.email}
            onChange={handleChange}
            required
            className="h-12"
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="phonNum" className="text-gray-700 font-medium">
            Phone Number
          </Label>
          <Input
            id="phonNum"
            name="phonNum"
            type="tel"
            placeholder="Enter your Phone Number"
            value={formData.phonNum}
            onChange={handleChange}
            required
            className="h-12"
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="password" className="text-gray-700 font-medium">
            Password
          </Label>
          <div className="relative">
            <Input
              id="password"
              name="password"
              type={showPassword ? "text" : "password"}
              placeholder="Enter password"
              value={formData.password}
              onChange={handleChange}
              required
              className="h-12 pr-10"
            />
            <div
              className="absolute right-3 top-1/2 transform -translate-y-1/2 cursor-pointer text-gray-500"
              onClick={() => setShowPassword((prev) => !prev)}
            >
              {showPassword ? (
                <EyeOff className="w-5 h-5" />
              ) : (
                <Eye className="w-5 h-5" />
              )}
            </div>
          </div>
        </div>

        <div className="space-y-2">
          <Label
            htmlFor="confirmPassword"
            className="text-gray-700 font-medium"
          >
            Confirm Password
          </Label>
          <div className="relative">
            <Input
              id="confirmPassword"
              name="confirmPassword"
              type={showConfirmPassword ? "text" : "password"}
              placeholder="Enter Confirm password"
              value={formData.confirmPassword}
              onChange={handleChange}
              required
              className="h-12 pr-10"
            />
            <div
              className="absolute right-3 top-1/2 transform -translate-y-1/2 cursor-pointer text-gray-500"
              onClick={() => setShowConfirmPassword((prev) => !prev)}
            >
              {showConfirmPassword ? (
                <EyeOff className="w-5 h-5" />
              ) : (
                <Eye className="w-5 h-5" />
              )}
            </div>
          </div>
        </div>

        <div className="flex items-center space-x-2">
          <Checkbox
            id="terms"
            checked={agreeToTerms}
            onCheckedChange={(checked) => setAgreeToTerms(checked as boolean)}
          />
          <Label htmlFor="terms" className="text-sm text-gray-700">
            I agree to the Terms & Conditions
          </Label>
        </div>

        {error && <div className="text-red-500 text-sm">{error}</div>}

        <Button
          type="submit"
          className="w-full h-12 bg-black hover:bg-gray-800 text-white"
          disabled={isLoading}
        >
          {isLoading ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Creating account...
            </>
          ) : (
            "Signup"
          )}
        </Button>

        <div className="text-center">
          <p className="text-gray-600">
            Already have an account?{" "}
            <Link href="/login" className="text-black hover:underline">
              Sign In
            </Link>
          </p>
        </div>

        <div className="relative">
          <div className="absolute inset-0 flex items-center">
            <span className="w-full border-t" />
          </div>
          <div className="relative flex justify-center text-xs uppercase">
            <span className="bg-white px-2 text-gray-500">OR</span>
          </div>
        </div>

        <Button
          type="button"
          variant="outline"
          className="w-full h-12 bg-transparent"
          onClick={handleGoogleSignIn}
          disabled={isGoogleLoading || isLoading}
        >
          {isGoogleLoading ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Signing in with Google...
            </>
          ) : (
            <>
              <svg className="mr-2 h-4 w-4" viewBox="0 0 24 24">
                <path
                  fill="currentColor"
                  d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                />
                <path
                  fill="currentColor"
                  d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                />
                <path
                  fill="currentColor"
                  d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                />
                <path
                  fill="currentColor"
                  d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                />
              </svg>
              Continue with Google
            </>
          )}
        </Button>
      </form>
    </div>
  );
}
