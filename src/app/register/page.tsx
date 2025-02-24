"use client";

import type React from "react";

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
import { Checkbox } from "@/components/ui/checkbox";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

interface InitialRegisterCredentials {
  email: string;
  password: string;
}

interface FinalRegisterCredentials {
  id: string;
  email: string;
  first_name: string;
  last_name: string;
  grant_types: string[];
  user_type: string;
  organisation_name: string;
  organisation_description: string;
  list_of_file_names: string[];
}

type RegisterResponse = {
  token: string;
  user_id: string;
};

const GRANT_TYPE_OPTIONS = [
  "Erasmus+",
  "Horizon Europe",
  "Creative Europe",
  "LIFE Programme",
  "Digital Europe",
] as const;

const initialRegister = async (
  credentials: InitialRegisterCredentials
): Promise<RegisterResponse> => {
  const response = await fetch(`${BASE_URL}/create-user`, {
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

const finalRegister = async (
  credentials: FinalRegisterCredentials
): Promise<RegisterResponse> => {
  const authToken = localStorage.getItem("authToken");
  console.log(authToken);

  const response = await fetch(`${BASE_URL}/me/update-user`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${authToken}`,
    },
    body: JSON.stringify(credentials),
  });
  if (!response.ok) {
    const errorData = await response.json();
    throw new Error(errorData.detail || "Invalid credentials");
  }
  return response.json();
};

const RegisterPage = () => {
  const dispatch = useDispatch();
  const router = useRouter();
  const [step, setStep] = useState<1 | 2>(1);
  const [error, setError] = useState<string>("");

  // Step 1 state
  const [email, setEmail] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const [passwordConfirmation, setPasswordConfirmation] = useState<string>("");

  // Step 2 state
  const [firstName, setFirstName] = useState<string>("");
  const [lastName, setLastName] = useState<string>("");
  const [grantTypes, setGrantTypes] = useState<string[]>([]);
  const [userType, setUserType] = useState<string>("");
  const [organisationName, setOrganisationName] = useState<string>("");
  const [organisationDescription, setOrganisationDescription] =
    useState<string>("");
  const [listOfFileNames] = useState<string[]>([]);

  const initialRegisterMutation = useMutation<
    RegisterResponse,
    Error,
    InitialRegisterCredentials
  >({
    mutationFn: initialRegister,
    onSuccess: (data) => {
      // Store the token in localStorage and cookies
      console.log(data);
      localStorage.setItem("authToken", data.token);
      Cookies.set("authToken", data.token, { expires: 7 });
      setStep(2);
    },
    onError: (error: Error) => {
      setError(error.message || "An error occurred during registration");
    },
  });

  const finalRegisterMutation = useMutation<
    RegisterResponse,
    Error,
    FinalRegisterCredentials
  >({
    mutationFn: finalRegister,
    onSuccess: (data) => {
      dispatch(
        signIn({
          token: data.token,
          user_id: data.user_id,
          email: email,
        })
      );
      router.push("/");
    },
    onError: (error: Error) => {
      setError(error.message || "An error occurred during registration");
    },
  });

  const handleInitialRegister = (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    if (password !== passwordConfirmation) {
      setError("Passwords do not match");
      return;
    }
    initialRegisterMutation.mutate({
      email,
      password,
    });
  };

  const handleFinalRegister = (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    finalRegisterMutation.mutate({
      id: "", // This should be provided by the backend after initial registration
      email,
      first_name: firstName,
      last_name: lastName,
      grant_types: grantTypes,
      user_type: userType,
      organisation_name: organisationName,
      organisation_description: organisationDescription,
      list_of_file_names: listOfFileNames,
    });
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-50">
      <Card className="w-full max-w-md p-6 bg-white shadow-md rounded-xl">
        <CardHeader>
          <div className="text-xl font-semibold text-center">
            {step === 1 ? "Register" : "Complete Registration"}
          </div>
        </CardHeader>
        <CardContent>
          {step === 1 ? (
            <form
              onSubmit={handleInitialRegister}
              className="flex flex-col gap-4"
            >
              <div>
                <Label htmlFor="email">Email</Label>
                <Input
                  type="email"
                  id="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                />
              </div>
              <div>
                <Label htmlFor="password">Password</Label>
                <Input
                  type="password"
                  id="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                />
              </div>
              <div>
                <Label htmlFor="passwordConfirmation">Confirm Password</Label>
                <Input
                  type="password"
                  id="passwordConfirmation"
                  value={passwordConfirmation}
                  onChange={(e) => setPasswordConfirmation(e.target.value)}
                  required
                />
              </div>
              {error && <div className="text-red-500 text-sm">{error}</div>}
              <Button type="submit" className="w-full mt-3 bg-black">
                Next
              </Button>
            </form>
          ) : (
            <form
              onSubmit={handleFinalRegister}
              className="flex flex-col gap-4"
            >
              <div>
                <Label htmlFor="firstName">First Name</Label>
                <Input
                  type="text"
                  id="firstName"
                  value={firstName}
                  onChange={(e) => setFirstName(e.target.value)}
                  required
                />
              </div>
              <div>
                <Label htmlFor="lastName">Last Name</Label>
                <Input
                  type="text"
                  id="lastName"
                  value={lastName}
                  onChange={(e) => setLastName(e.target.value)}
                  required
                />
              </div>
              <div>
                <Label>Grant Types</Label>
                <div className="flex flex-col gap-2 mt-1">
                  {GRANT_TYPE_OPTIONS.map((grant) => (
                    <div
                      key={grant}
                      className="flex items-center space-x-2 gap-1"
                    >
                      <Checkbox
                        id={grant}
                        checked={grantTypes.includes(grant)}
                        onCheckedChange={(checked) => {
                          if (checked) {
                            setGrantTypes([...grantTypes, grant]);
                          } else {
                            setGrantTypes(
                              grantTypes.filter((g) => g !== grant)
                            );
                          }
                        }}
                      />
                      <Label htmlFor={grant}>{grant}</Label>
                    </div>
                  ))}
                </div>
              </div>
              <div>
                <Select
                  value={userType}
                  onValueChange={(value) => setUserType(value)}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select user type" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="personal">Personal</SelectItem>
                    <SelectItem value="Organisation">Organisation</SelectItem>
                    <SelectItem value="agency">Agency</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              {userType === "Organisation" && (
                <>
                  <div>
                    <Label htmlFor="organisationName">Organisation Name</Label>
                    <Input
                      type="text"
                      id="organisationName"
                      value={organisationName}
                      onChange={(e) => setOrganisationName(e.target.value)}
                      required
                    />
                  </div>
                  <div>
                    <Label htmlFor="organisationDescription">
                      Organisation Description
                    </Label>
                    <Textarea
                      className="border"
                      id="organisationDescription"
                      value={organisationDescription}
                      onChange={(e) =>
                        setOrganisationDescription(e.target.value)
                      }
                      required
                    />
                  </div>
                </>
              )}
              {error && <div className="text-red-500 text-sm">{error}</div>}
              <Button type="submit" className="w-full mt-3 bg-black">
                Complete Registration
              </Button>
            </form>
          )}
        </CardContent>
        {step === 1 ? (
          <CardFooter>
            <div className="text-sm text-gray-500">
              <div>Already have an account?</div>
              <Button variant="link" onClick={() => router.push("/login")}>
                Sign In
              </Button>
            </div>
          </CardFooter>
        ) : (
          <></>
        )}
      </Card>
    </div>
  );
};

export default RegisterPage;
