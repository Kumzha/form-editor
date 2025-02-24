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
import { signIn } from "@/store/user/userSlice";
import { useDispatch } from "react-redux";
import Cookies from "js-cookie";

interface LoginCredentials {
  email: string;
  password: string;
}

type Token = {
  access_token: string;
  token_type: string;
};

type LoginResponse = {
  token: Token;
  user_id: string;
};

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
  const dispatch = useDispatch();
  const [email, setEmail] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const [error, setError] = useState<string>("");
  const router = useRouter();

  const { mutate } = useMutation<LoginResponse, Error, LoginCredentials>({
    mutationFn: loginUser,
    onSuccess: (data) => {
      Cookies.set("authToken", data.token.access_token, { expires: 7 });
      localStorage.setItem("authToken", data.token.access_token);
      dispatch(
        signIn({
          token: data.token.access_token,
          user_id: data.user_id,
          email: email,
        })
      );
      router.push("/");
    },
    onError: (error: Error) => {
      console.log("Login successful");
      setError(error.message || "An error occurred during login");
    },
  });

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(""); // Reset error before submitting
    mutate({ email, password: password });
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
            <div>
              <a href="/register" className="text-blue-500 hover:underline">
                Register
              </a>
            </div>
          </div>
        </CardFooter>
      </Card>
    </div>
  );
};

export default LoginPage;
