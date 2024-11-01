export interface SubPoint {
  content: string;
}

export interface Point {
  title: string;
  prompt?: string;
  subpoints: SubPoint[];
}

export interface FormInterface {
  name: string;
  initial_context_questions: string[];
  questions: Point[];
}

export interface Form {
  form_type: FormInterface;
  name: string;
  initial_context: string[];
  points: Point[];
}

export const exampleFormInterface: FormInterface = {
  name: "Example Form ",

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
        { content: "subpoint 1.1" },
        { content: "subpoint 1.2" },
        { content: "subpoint 1.3" },
      ],
    },
    {
      title: "The Second Point",
      subpoints: [
        { content: "subpoint 2.1" },
        { content: "subpoint 2.2" },
        { content: "subpoint 2.3" },
      ],
    },
    {
      title: "The Third Point",
      subpoints: [
        { content: "subpoint 3.1" },
        { content: "subpoint 3.2" },
        { content: "subpoint 3.3" },
      ],
    },
  ],
};
