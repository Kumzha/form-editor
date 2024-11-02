"use client";

import React from "react";
import { Form } from "@/types/formType";

interface DropDownProps {
  forms: Form[];
  setSelectedForm: (form: Form) => void;
}

const DropDown: React.FC<DropDownProps> = ({ forms, setSelectedForm }) => {
  return (
    <details className="dropdown">
      <summary className="btn w-40 m-1 font-sans">Form List</summary>
      <ul className="menu dropdown-content bg-base-100 rounded-box z-[1] w-52 p-2 shadow">
        {forms.map((form: Form, index: number) => (
          <li key={index} onClick={() => setSelectedForm(form)}>
            <a>{form.name}</a>
          </li>
        ))}
        <li>
          <a>Form number 2</a>
        </li>
        <li>
          <a>Form number 3</a>
        </li>
      </ul>
    </details>
  );
};
export default DropDown;
