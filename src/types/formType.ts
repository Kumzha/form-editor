export interface FormQuestion {
  sub_title: string;
  prompt?: string;
  criteria?: string;
}

export interface FormPoint {
  title: string;
  subpoints: FormQuestion[];
}

export interface SubPoint {
  content: string;
}

export interface Point {
  subpoints?: SubPoint[];
}

export interface FormInterface {
  name: string;
  initial_context_questions: string[];
  questions: FormPoint[];
}

export interface AtachedFile {
  name: string;
  type: string;
}

export interface Form {
  form_id: string;
  form_type: FormInterface;
  name: string;
  initial_context: string[];
  points?: Point[];
  uploaded_files?: AtachedFile[];
}
