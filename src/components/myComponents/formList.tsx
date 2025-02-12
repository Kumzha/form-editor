import React, { useEffect } from "react";
import { Form } from "@/types/formType";
import { useDispatch } from "react-redux";
import { setSelectedForm, setUserForms } from "@/store/forms/formSlice";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { fetchForms } from "@/lib/utils";
import DocumentCard from "./documentCard";

const FormList: React.FC = () => {
  const dispatch = useDispatch();

  const { data } = useQuery<Form[], Error>({
    queryKey: ["fetchForms"],
    queryFn: fetchForms,
  });

  useEffect(() => {
    const handleSetUserForms = (forms: Form[]) => {
      dispatch(setUserForms(forms));
    };

    if (data) {
      handleSetUserForms(data);
    }
  }, [data, dispatch]);

  const queryClient = useQueryClient();

  const handleSetSelectedForm = (form: Form) => {
    queryClient.invalidateQueries({ queryKey: ["fetchForms"] });
    dispatch(setSelectedForm(form));
  };

  if (!data) {
    return <div>Loading...</div>;
  }

  return (
    <div className="mt-20 px-4">
      <div>NEW FORM</div>
      <h1 className="text-xl font-bold mb-4">Forms</h1>
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-5">
        {data.map((form, index) => (
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
