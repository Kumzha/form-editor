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
  form_id: string;
  form_type: FormInterface;
  name: string;
  initial_context: string[];
  points?: Point[];
}

export const creaFormInterface: FormInterface = {
  name: "CREA-MEDIA-2025-INNOVBUSMOD",
  initial_context_questions: [
    "Write a brief summary of your company.",
    "Write a brief summary of your project.",
    "Write a brief summary of your partnners and participats.",
    "Write a brief summary of your goals and objectives.",
  ],
  questions: [
    {
      title: "PROJECT SUMMARY",
      subpoints: [
        {
          sub_title: "Proposal Title",
          prompt: "Provide the title of your proposal.",
        },
        {
          sub_title: "Duration in Months",
          prompt: "Indicate the duration of your project in months.",
        },
        {
          sub_title: "Abstract",
          prompt: "Provide a concise and clear summary of your proposal.",
        },
      ],
    },
    {
      title: "RELEVANCE",
      subpoints: [
        {
          sub_title: "Background and General Objectives",
          prompt:
            "Define the objectives of your proposal and explain their relevance to this call for proposals.",
        },
        {
          sub_title: "Needs Analysis and Specific Objectives",
          prompt:
            "Describe how your activity meets the needs of the industry/sectors.",
        },
        {
          sub_title: "European Added Value",
          prompt:
            "Explain the European dimension of your project, including aspects like content origin, cross-border and cross-language features, potential for European expansion, the nature of the partnership, and the scope and size of the partners.",
        },
        {
          sub_title: "Environment and Sustainability",
          prompt:
            "Describe strategies to ensure a more sustainable and environmentally respectful industry.",
        },
        {
          sub_title: "Gender Balance, Inclusion, and Diversity",
          prompt:
            "Describe the strategies to ensure gender balance, inclusion, diversity, and representativeness, either in the project/content or in the way of managing activities.",
        },
      ],
    },
    {
      title: "QUALITY",
      subpoints: [
        {
          sub_title: "Concept and Methodology",
          prompt:
            "Provide a market analysis justifying your methodological and strategic choices, including target market description, competition analysis, and a methodology with a clear list of activities to be implemented.",
        },
        {
          sub_title: "Format",
          prompt:
            "Explain your business model and financial strategies. Provide an estimation of expected revenues over the next years.",
        },
        {
          sub_title: "Cost Effectiveness and Financial Management",
          prompt:
            "Demonstrate cost effectiveness and explain your budgeting strategy. Describe any co-financing strategy, if applicable.",
        },
        {
          sub_title: "Risk Management",
          prompt:
            "Describe risks, uncertainties, or difficulties, and provide a strategy for addressing them. Include a risk description, impact, likelihood, and mitigation measures.",
        },
        { sub_title: "Risk No", prompt: "Assign a number to each risk." },
        {
          sub_title: "Description",
          prompt: "Provide a detailed risk description.",
        },
        {
          sub_title: "Work Package No",
          prompt: "Associate each risk with a work package number.",
        },
        {
          sub_title: "Proposed Risk-Mitigation Measures",
          prompt: "Describe mitigation measures for each risk.",
        },
      ],
    },
    {
      title: "PROJECT MANAGEMENT",
      subpoints: [
        {
          sub_title: "Partnership and Consortium",
          prompt:
            "Explain the roles and tasks division within the consortium, including coherence, added value, and complementarity regarding work coordination, decision-making, and knowledge exchange.",
        },
        {
          sub_title: "Project Teams",
          prompt:
            "Describe project teams, how they will work together, and list the main staff by function/profile, detailing their tasks.",
        },
        {
          sub_title: "Name and Function",
          prompt: "Provide the names and functions of team members.",
        },
        {
          sub_title: "Organisation",
          prompt: "List the organisations involved.",
        },
        {
          sub_title: "Role/Tasks/Professional Profile",
          prompt:
            "Describe the roles, tasks, and expertise of each team member.",
        },
      ],
    },
    {
      title: "DISSEMINATION",
      subpoints: [
        {
          sub_title: "Dissemination and Distribution",
          prompt:
            "Describe the data collection, analysis, and dissemination methodology to share results, ensure transparency, and propose knowledge exchange.",
        },
        {
          sub_title: "Impact",
          prompt:
            "Explain the impact of your project on the visibility, availability, and audience of European works in the digital age, as well as its contribution to the competitiveness and greening of the European audiovisual industry.",
        },
      ],
    },
  ],
};

export const creaForm: Form = {
  form_id: "crea",
  form_type: creaFormInterface,
  name: "User Crea",
  initial_context: [
    "First answer.",
    "Second answer.",
    "Third answer.",
    "Fourth answer.",
  ],
  points: [
    {
      subpoints: [
        { content: "USER INPUT 1" },
        { content: "USER INPUT 2" },
        { content: "USER INPUT 3" },
      ],
    },
    {
      subpoints: [
        { content: "USER INPUT 4" },
        { content: "USER INPUT 5" },
        { content: "USER INPUT 6" },
        { content: "" },
        { content: "USER INPUT 7" },
      ],
    },
    {
      subpoints: [{ content: "" }, { content: "" }, { content: "" }],
    },
    {
      subpoints: [
        { content: "USER INPUT 8" },
        { content: "USER INPUT 9" },
        { content: "USER INPUT 10" },
      ],
    },
  ],
};
