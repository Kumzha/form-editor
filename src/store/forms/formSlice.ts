import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { Form, exampleForm } from "@/types/formType";

export interface UserForms {
  userForms: Form[];
  selectedForm: Form | null;
}

// TODO mock data
const initialState: UserForms = {
  userForms: [exampleForm],
  selectedForm: null,
};

const userFormsSlice = createSlice({
  name: "userForms",
  initialState,
  reducers: {
    addForm(state, action: PayloadAction<Form>) {
      state.userForms.push(action.payload);
    },
    updateForm(state, action: PayloadAction<{ index: number; form: Form }>) {
      const { index, form } = action.payload;
      if (state.userForms[index]) {
        state.userForms[index] = form;
      }
    },
    deleteForm(state, action: PayloadAction<number>) {
      state.userForms.splice(action.payload, 1);
    },
    clearForms(state) {
      state.userForms = [];
    },
    setSelectedForm(state, action: PayloadAction<Form>) {
      state.selectedForm = action.payload;
    },
  },
});

export const { addForm, updateForm, clearForms, deleteForm, setSelectedForm } =
  userFormsSlice.actions;
export default userFormsSlice.reducer;
