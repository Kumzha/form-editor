import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { Form } from "@/types/formType";

export interface UserForms {
  userForms: Form[];
}

const initialState: UserForms = {
  userForms: [],
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
  },
});

export const { addForm, updateForm, clearForms, deleteForm } =
  userFormsSlice.actions;
export default userFormsSlice.reducer;
