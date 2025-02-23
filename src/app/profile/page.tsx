"use client";

import type React from "react";
import { useState, useEffect } from "react";
import {
  GRANT_TYPE_OPTIONS,
  type UserData,
  type GrantType,
} from "@/types/userType";
import Navbar from "@/components/myComponents/navbar";
import Sidebar from "@/components/myComponents/appSidebar";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { X } from "lucide-react";
import WithAuth from "@/components/hoc/withAuth";
import { useUserQuery } from "@/hooks/useUserQuery";

export default function Home() {
  const { data: userData, isLoading } = useUserQuery();
  const [user, setUser] = useState<UserData>({
    id: "",
    email: "",
    first_name: "",
    last_name: "",
    grant_types: [],
    user_type: "",
    organisation_name: "",
    organisation_description: "",
    list_of_file_names: [],
  });
  const [profilePicture, setProfilePicture] = useState<File | null>(null);
  const [customGrantType, setCustomGrantType] = useState("");

  useEffect(() => {
    if (userData) {
      console.log("userData:", userData);
      setUser((prevUser) => ({
        ...prevUser,
        ...userData,
        organisation_name: userData.organisation_name || "",
        organisation_description: userData.organisation_description || "",
      }));
    }
  }, [userData]);

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setUser((prevUser) => ({ ...prevUser, [name]: value }));
  };

  const handleProfilePictureUpload = (
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
    const file = e.target.files?.[0] || null;
    setProfilePicture(file);
  };

  const handleAddGrantType = (value: GrantType) => {
    if (value && !user.grant_types.includes(value)) {
      setUser((prevUser) => ({
        ...prevUser,
        grant_types: [...prevUser.grant_types, value],
      }));
    }
    setCustomGrantType("");
  };

  const handleRemoveGrantType = (grantType: GrantType) => {
    setUser((prevUser) => ({
      ...prevUser,
      grant_types: prevUser.grant_types.filter((type) => type !== grantType),
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const response = await fetch("/api/update-profile", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(user),
      });

      if (!response.ok) {
        throw new Error("Failed to update profile");
      }

      const updatedUser = await response.json();
      setUser(updatedUser);
      alert("Profile updated successfully");
    } catch (error) {
      console.error("Error updating profile:", error);
      alert("Failed to update profile");
    }
  };

  if (isLoading) {
    return <div>Loading...</div>;
  }

  return (
    <WithAuth>
      <div className="flex flex-col min-h-screen w-[70%] max-w-[1000px] mx-auto mt-24">
        <Navbar />
        <div className="flex flex-1">
          <Sidebar />
          <main className="flex-1 p-6">
            <Card>
              <CardHeader>
                <CardTitle>User Profile</CardTitle>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleSubmit} className="space-y-4">
                  <div className="flex items-center space-x-4">
                    <Avatar className="w-24 h-24">
                      <AvatarImage
                        src={
                          profilePicture
                            ? URL.createObjectURL(profilePicture)
                            : "/placeholder.svg"
                        }
                      />
                      <AvatarFallback>
                        {user.first_name.charAt(0)}
                        {user.last_name.charAt(0)}
                      </AvatarFallback>
                    </Avatar>
                    <div>
                      <Label htmlFor="profile-picture">Profile Picture</Label>
                      <Input
                        id="profile-picture"
                        type="file"
                        onChange={handleProfilePictureUpload}
                        accept="image/*"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="name">First Name</Label>
                      <Input
                        id="name"
                        name="name"
                        value={user.first_name}
                        onChange={handleInputChange}
                      />
                    </div>
                    <div>
                      <Label htmlFor="last_name">Last Name</Label>
                      <Input
                        id="last_name"
                        name="last_name"
                        value={user.last_name}
                        onChange={handleInputChange}
                      />
                    </div>
                  </div>

                  <div>
                    <Label htmlFor="email">Email</Label>
                    <Input
                      id="email"
                      name="email"
                      value={user.email}
                      onChange={handleInputChange}
                      type="email"
                    />
                  </div>

                  <div>
                    <Label htmlFor="user_type">User Type</Label>
                    <Select
                      value={user.user_type || "personal"}
                      onValueChange={(value) =>
                        setUser((prevUser) => ({
                          ...prevUser,
                          user_type: value,
                        }))
                      }
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Select user type" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="personal">Personal</SelectItem>
                        <SelectItem value="Organisation">
                          Organisation
                        </SelectItem>
                        <SelectItem value="agency">Agency</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  {user.user_type === "organisation" && (
                    <>
                      <div>
                        <Label htmlFor="organisation_name">
                          organisation Name
                        </Label>
                        <Input
                          id="organisation_name"
                          name="organisation_name"
                          value={user.organisation_name}
                          onChange={handleInputChange}
                        />
                      </div>
                      <div>
                        <Label htmlFor="organisation_description">
                          organisation Description
                        </Label>
                        <Textarea
                          id="organisation_description"
                          name="organisation_description"
                          value={user.organisation_description}
                          onChange={handleInputChange}
                        />
                      </div>
                    </>
                  )}

                  <div className="space-y-2">
                    <Label>Grant Types</Label>
                    <Select onValueChange={handleAddGrantType}>
                      <SelectTrigger>
                        <SelectValue placeholder="Select grant type" />
                      </SelectTrigger>
                      <SelectContent>
                        {GRANT_TYPE_OPTIONS.map((type) => (
                          <SelectItem key={type} value={type}>
                            {type}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <div className="flex items-center gap-2 mt-2">
                      <Input
                        placeholder="Add custom grant type"
                        value={customGrantType}
                        onChange={(e) => setCustomGrantType(e.target.value)}
                        onKeyPress={(e) => {
                          if (e.key === "Enter") {
                            e.preventDefault();
                            handleAddGrantType(customGrantType);
                          }
                        }}
                      />
                      <Button
                        type="button"
                        onClick={() => handleAddGrantType(customGrantType)}
                      >
                        Add
                      </Button>
                    </div>
                    <div className="flex flex-wrap gap-2 mt-2">
                      {user.grant_types.map((type) => (
                        <Badge key={type} variant="secondary">
                          {type}
                          <button
                            type="button"
                            onClick={() => handleRemoveGrantType(type)}
                            className="ml-1 hover:text-destructive"
                          >
                            <X className="h-3 w-3" />
                          </button>
                        </Badge>
                      ))}
                    </div>
                  </div>

                  <div>
                    <Label>Files</Label>
                    <div className="mt-2">
                      {user.list_of_file_names.map((fileName, index) => (
                        <div key={index} className="flex items-center gap-2">
                          <span className="text-sm">{fileName}</span>
                          <button
                            type="button"
                            onClick={() =>
                              setUser((prevUser) => ({
                                ...prevUser,
                                list_of_file_names:
                                  prevUser.list_of_file_names.filter(
                                    (_, i) => i !== index
                                  ),
                              }))
                            }
                            className="text-destructive hover:text-destructive/80"
                          >
                            <X className="h-4 w-4" />
                          </button>
                        </div>
                      ))}
                    </div>
                  </div>

                  <Button type="submit">Update Profile</Button>
                </form>
              </CardContent>
            </Card>
          </main>
        </div>
      </div>
    </WithAuth>
  );
}
