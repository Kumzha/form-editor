import React from "react";
import { Button } from "../ui/button";
import { useDispatch, useSelector } from "react-redux";
import { setSelectedForm } from "@/store/forms/formSlice";
import { useQueryClient, useQuery } from "@tanstack/react-query";
import { toast } from "sonner";
import { Form } from "@/types/formType";
import { RootState } from "@/store/store";
import { fetchForms } from "@/lib/utils";

const RefreshForms: React.FC = () => {
  const { selectedForm } = useSelector((state: RootState) => state.userForms);
  const dispatch = useDispatch();
  const queryClient = useQueryClient();

  const { data } = useQuery<Form[], Error>({
    queryKey: ["fetchForms"],
    queryFn: fetchForms,
  });

  const handleRefresh = async () => {
    queryClient.invalidateQueries({ queryKey: ["fetchForms"] });
    await queryClient.refetchQueries({
      queryKey: ["fetchForms"],
    });

    if (!data) {
      toast.error("No forms found");
      return;
    }

    // console.log("DATA");
    // console.log("aaaa");
    // console.log(data[11].form_type.questions[0].subpoints[0].prompt);

    const updatedSelectedForm = data?.find(
      (form: Form) => form.form_id === selectedForm?.form_id
    );
    // console.log(
    //   updatedSelectedForm?.form_type.questions[0].subpoints[0].prompt
    // );

    if (!updatedSelectedForm) {
      toast.error("Form not found");
      return;
    }
    // console.log(updatedSelectedForm.form_type.questions[0].subpoints[0].prompt);
    dispatch(setSelectedForm(updatedSelectedForm));

    toast("Forms have been refreshed", {
      description: "All forms have been refreshed",
    });
  };

  return (
    <Button variant={"primary"} onClick={handleRefresh}>
      Refresh Forms
    </Button>
  );
};
export default RefreshForms;
