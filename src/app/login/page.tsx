"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { BASE_URL } from "@/constants/constants";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { useMutation } from "@tanstack/react-query";

interface LoginResponse {
  token_type: string;
  access_token: string;
}

interface LoginCredentials {
  email: string;
  hashed_password: string;
}

const loginUser = async (
  credentials: LoginCredentials
): Promise<LoginResponse> => {
  const response = await fetch(BASE_URL + "/login", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(credentials),
  });

  if (!response.ok) {
    const errorData = await response.json();
    throw new Error(errorData.detail || "Invalid credentials");
  }

  return response.json();
};

const LoginPage = () => {
  const [email, setEmail] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const [error, setError] = useState<string>("");
  const router = useRouter();

  const { mutate } = useMutation<LoginResponse, Error, LoginCredentials>({
    mutationFn: loginUser,
    onSuccess: (data) => {
      console.log(data);
      localStorage.setItem("authToken", data.access_token);
      router.push("/");
    },
    onError: (error: Error) => {
      setError(error.message || "An error occurred during login");
    },
  });

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(""); // Reset error before submitting
    mutate({ email, hashed_password: password }); // Pass credentials to mutation function
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-50">
      <Card className="w-full max-w-md p-6 bg-white shadow-md rounded-xl">
        <CardHeader>
          <div className="text-xl font-semibold text-center">Login</div>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleLogin} className="flex flex-col gap-4">
            <div>
              <Label htmlFor="email" className="block text-sm font-medium">
                Email
              </Label>
              <Input
                type="email"
                id="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>
            <div>
              <Label htmlFor="password" className="block text-sm font-medium">
                Password
              </Label>
              <Input
                type="password"
                id="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
            </div>
            {error && <div className="text-red-500 text-sm">{error}</div>}
            <Button type="submit" className="w-full mt-3 bg-[#000000]">
              Sign In
            </Button>
          </form>
        </CardContent>
        <CardFooter>
          <div className="text-sm text-gray-500">
            <div>Don’t have an account?</div>
            <div>Contact us at - </div>
          </div>
        </CardFooter>
      </Card>
    </div>
  );
};

export default LoginPage;
