export interface FormQuestion {
  sub_title: string;
  prompt?: string;
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

export interface Form {
  form_type: FormInterface;
  name: string;
  initial_context: string[];
  points?: Point[];
}

export const exampleFormInterface: FormInterface = {
  name: "Example Form Interface",

  initial_context_questions: [
    "Hello, this is an example form.",
    "Please fill out the following information:",
    "Thank you!",
    "Have a great day!",
  ],

  questions: [
    {
      title: "The First Point",
      subpoints: [
        { sub_title: "Subpoint 1.1" },
        { sub_title: "Subpoint 1.2" },
        { sub_title: "Subpoint 1.3" },
      ],
    },
    {
      title: "The Second Point",
      subpoints: [
        { sub_title: "Subpoint 2.1" },
        { sub_title: "Subpoint 2.2" },
        { sub_title: "Subpoint 2.3" },
      ],
    },
    {
      title: "The Third Point",
      subpoints: [{ sub_title: "Subpoint 3.1" }],
    },
    {
      title: "The Fourth Point",
      subpoints: [
        { sub_title: "Subpoint 4.1" },
        { sub_title: "Subpoint 4.2" },
        { sub_title: "Subpoint 4.3" },
        { sub_title: "Subpoint 4.4" },
      ],
    },
    {
      title: "The Fifth Point",
      subpoints: [
        { sub_title: "Subpoint 5.1" },
        { sub_title: "Subpoint 5.2" },
        { sub_title: "Subpoint 5.3" },
        { sub_title: "Subpoint 5.4" },
        { sub_title: "Subpoint 5.5" },
      ],
    },
  ],
};
export const exampleForm: Form = {
  form_type: exampleFormInterface,
  name: "Example Form",
  initial_context: [
    "First answer.",
    "Second answer.",
    "Third answer.",
    "Fourth answer.",
  ],
};
