// useHandleOnSuccess.ts
import { useQueryClient } from "@tanstack/react-query";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "@/store/store";
import { setSelectedForm } from "@/store/forms/formSlice";
import type { Form } from "@/types/formType";

export const useRefreshForms = (data?: Form[]) => {
  const queryClient = useQueryClient();
  const dispatch = useDispatch();
  const { selectedForm } = useSelector((state: RootState) => state.userForms);

  const RefreshForms = async () => {
    // Invalidate and refetch the forms query
    await queryClient.invalidateQueries({ queryKey: ["fetchForms"] });
    await queryClient.refetchQueries({ queryKey: ["fetchForms"] });

    // Find and update the selected form from the refetched data
    const updatedSelectedForm = data?.find(
      (form: Form) => form.form_id === selectedForm?.form_id
    );

    if (!updatedSelectedForm) {
      return;
    }

    dispatch(setSelectedForm(updatedSelectedForm));
  };

  return RefreshForms;
};
