"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
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

export default function Home() {
  const router = useRouter();
  const [user, setUser] = useState({
    firstName: "",
    lastName: "",
    email: "",
    password: "",
    organization: "",
    experience: "",
    olderProjects: "",
    userType: "individual",
  });
  //   const [files, setFiles] = useState([]);
  const [profilePicture, setProfilePicture] = useState<File | null>(null);

  useEffect(() => {
    const token = localStorage.getItem("authToken");
    if (!token) {
      console.log("No token found inside main page useEffect");
      router.push("/login");
    } else {
      // Fetch user data here
      // For now, we'll use dummy data
      setUser({
        firstName: "John",
        lastName: "Doe",
        email: "john@example.com",
        password: "",
        organization: "Acme Inc.",
        experience: "10 years in software development",
        olderProjects: "Project A, Project B",
        userType: "individual",
      });
    }
  }, [router]);

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const handleInputChange = (e: { target: { name: any; value: any } }) => {
    const { name, value } = e.target;
    setUser((prevUser) => ({ ...prevUser, [name]: value }));
  };

  //   const handleFileUpload = (e) => {
  //     const newFiles = Array.from(e.target.files);
  //     setFiles((prevFiles) => [...prevFiles, ...newFiles]);
  //   };

  const handleProfilePictureUpload = (
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
    const file = e.target.files?.[0] || null;
    setProfilePicture(file);
  };

  const handleSubmit = (e: { preventDefault: () => void }) => {
    e.preventDefault();
    // Handle form submission here
    console.log("User data:", user);
    // console.log("Files:", files);
    console.log("Profile picture:", profilePicture);
  };

  return (
    <div className="flex flex-col min-h-screen w-[70%] mx-auto">
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
                    <AvatarFallback>JD</AvatarFallback>
                  </Avatar>
                  <div>
                    <Label htmlFor="profile-picture">Profile Picture</Label>
                    <Input
                      id="profile-picture"
                      type="file"
                      onChange={handleProfilePictureUpload}
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="firstName">First Name</Label>
                    <Input
                      id="firstName"
                      name="firstName"
                      value={user.firstName}
                      onChange={handleInputChange}
                    />
                  </div>
                  <div>
                    <Label htmlFor="lastName">Last Name</Label>
                    <Input
                      id="lastName"
                      name="lastName"
                      value={user.lastName}
                      onChange={handleInputChange}
                    />
                  </div>
                </div>

                <div>
                  <Label htmlFor="email">Email</Label>
                  <Input
                    id="email"
                    name="email"
                    type="email"
                    value={user.email}
                    onChange={handleInputChange}
                  />
                </div>

                <div>
                  <Label htmlFor="password">Password (to change)</Label>
                  <Input
                    id="password"
                    name="password"
                    type="password"
                    value={user.password}
                    onChange={handleInputChange}
                  />
                </div>

                <div>
                  <Label htmlFor="userType">User Type</Label>
                  <Select
                    name="userType"
                    value={user.userType}
                    onValueChange={(value) =>
                      setUser((prevUser) => ({ ...prevUser, userType: value }))
                    }
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select user type" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="individual">Individual</SelectItem>
                      <SelectItem value="organization">Organization</SelectItem>
                      <SelectItem value="agency">Agency</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <Label htmlFor="organization">Organization</Label>
                  <Input
                    id="organization"
                    name="organization"
                    value={user.organization}
                    onChange={handleInputChange}
                  />
                </div>

                <div>
                  <Label htmlFor="experience">Experience</Label>
                  <Textarea
                    id="experience"
                    name="experience"
                    value={user.experience}
                    onChange={handleInputChange}
                  />
                </div>

                <div>
                  <Label htmlFor="olderProjects">Older Projects</Label>
                  <Textarea
                    id="olderProjects"
                    name="olderProjects"
                    value={user.olderProjects}
                    onChange={handleInputChange}
                  />
                </div>

                <div>
                  <Label htmlFor="files">Upload Context Files</Label>
                  {/* <Input
                    id="files"
                    type="file"
                    multiple
                    onChange={handleFileUpload}
                  />
                  <div className="mt-2">
                    {files.map((file, index) => (
                      <div key={index} className="text-sm">
                        {file.name}
                      </div>
                    ))}
                  </div> */}
                </div>

                <Button type="submit">Update Profile</Button>
              </form>
            </CardContent>
          </Card>
        </main>
      </div>
    </div>
  );
}
