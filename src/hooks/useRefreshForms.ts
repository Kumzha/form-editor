// useHandleOnSuccess.ts
import { useQueryClient } from "@tanstack/react-query";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "@/store/store";
import { setSelectedForm } from "@/store/forms/formSlice";
import type { Form } from "@/types/formType";

export const useRefreshForms = () => {
  const queryClient = useQueryClient();
  const dispatch = useDispatch();
  const { selectedForm } = useSelector((state: RootState) => state.userForms);

  const refreshForms = async (): Promise<Form[]> => {
    await queryClient.invalidateQueries({ queryKey: ["fetchForms"] });
    await queryClient.refetchQueries({
      queryKey: ["fetchForms"],
    });

    const forms: Form[] = queryClient.getQueryData(["fetchForms"]) || [];

    const updatedSelectedForm = forms.find(
      (form) => form.form_id === selectedForm?.form_id
    );

    if (updatedSelectedForm) {
      dispatch(setSelectedForm(updatedSelectedForm));
    }

    return forms;
  };

  return refreshForms;
};
