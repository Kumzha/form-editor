/* eslint-disable @typescript-eslint/no-unused-vars */
"use client";
import { useQuery } from "@tanstack/react-query";
import { useUserQuery } from "@/hooks/useUserQuery";
import { use, useEffect } from "react";

export default function Home() {
  const { data, isLoading, error } = useUserQuery();

  useEffect(() => {
    if (data) {
      alert(data?.email);
    }
  }, [data]);

  if (isLoading) {
    return <div>Loading...</div>;
  }
  return <div className="flex flex-col min-h-screen"></div>;
}
