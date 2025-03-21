import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { Form } from "@/types/formType";

export interface UserForms {
  userForms: Form[];
  selectedForm: Form | null;
  selectedPoint: number;
  selectedSubpoint: number;
}

// TODO mock data
const initialState: UserForms = {
  userForms: [],
  selectedForm: null,
  selectedPoint: 0,
  selectedSubpoint: 0,
};

const userFormsSlice = createSlice({
  name: "userForms",
  initialState,
  reducers: {
    setUserForms(state, action: PayloadAction<Form[]>) {
      state.userForms = action.payload;
    },
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
    setSelectedForm(state, action: PayloadAction<Form | null>) {
      state.selectedForm = action.payload;
      state.selectedPoint = 0;
      state.selectedSubpoint = 0;
    },
    setSelectedPoint(state, action: PayloadAction<number>) {
      state.selectedPoint = action.payload;
      state.selectedSubpoint = 0;
    },
    setSelectedSubpoint(state, action: PayloadAction<number>) {
      state.selectedSubpoint = action.payload;
    },
    updateSelectedSubpoint(
      state,
      action: PayloadAction<{
        point: number;
        subpoint: number;
        content: string;
      }>
    ) {
      const { point, subpoint, content } = action.payload;
      const targetSubpoint =
        state.selectedForm?.points?.[point]?.subpoints?.[subpoint];

      if (targetSubpoint) {
        targetSubpoint.content = content;
      }
    },
  },
});

export const {
  addForm,
  updateForm,
  clearForms,
  deleteForm,
  setSelectedForm,
  setSelectedPoint,
  setSelectedSubpoint,
  setUserForms,
  updateSelectedSubpoint,
} = userFormsSlice.actions;
export default userFormsSlice.reducer;
