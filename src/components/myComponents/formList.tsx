"use client";

import type React from "react";
import { useEffect } from "react";
import type { Form } from "@/types/formType";
import { useDispatch } from "react-redux";
import { setSelectedForm, setUserForms } from "@/store/forms/formSlice";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { fetchForms } from "@/lib/utils";
import DocumentCard from "./documentCard";
import NoProposalScreen from "./noProposalsScreen";

const FormList: React.FC = () => {
  const dispatch = useDispatch();

  const { data, isLoading, error } = useQuery<Form[], Error>({
    queryKey: ["fetchForms"],
    queryFn: fetchForms,
  });

  useEffect(() => {
    if (data) {
      dispatch(setUserForms(data));
    }
  }, [data, dispatch]);

  const queryClient = useQueryClient();

  const handleSetSelectedForm = (form: Form) => {
    queryClient.invalidateQueries({ queryKey: ["fetchForms"] });
    dispatch(setSelectedForm(form));
  };

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-screen mt-14">
        <div className="animate-spin rounded-full h-32 w-32 border-t-2 border-b-2 border-gray-900"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex justify-center items-center h-screen mt-14">
        <p className="text-red-500">Error loading forms: {error.message}</p>
      </div>
    );
  }

  if (!data || data.length === 0) {
    return (
      <div className="container mx-auto px-4 py-8 mt-14">
        <h1 className="text-2xl md:text-3xl font-bold mb-6">My Proposals</h1>
        <NoProposalScreen />
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8 mt-14">
      <h1 className="text-2xl md:text-2xl font-bold mb-6">My Proposals</h1>
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4 md:gap-6">
        {data
          .slice()
          .reverse()
          .map((form, index) => (
            <DocumentCard
              key={index}
              form_name={form.name}
              form_type={form.form_type.name}
              onClick={() => handleSetSelectedForm(form)}
            />
          ))}
      </div>
    </div>
  );
};

export default FormList;
