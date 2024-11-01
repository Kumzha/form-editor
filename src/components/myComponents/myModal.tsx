import React, { useState } from "react";
import { FormInterface } from "@/types/formType";

interface ModalProps {
  title: string;
  openButtonLabel: string;
  formTypes: FormInterface[];
}

const MyModal: React.FC<ModalProps> = ({
  title,
  openButtonLabel,
  formTypes,
}) => {
  const openModal = () => {
    (document.getElementById("my_modal_1") as HTMLDialogElement)?.showModal();
  };

  const [name, setName] = useState("");
  const [selectedFormType, setSelectedFormType] = useState<FormInterface>(
    formTypes[0]
  );
  const [answers, setAnswers] = useState<string[]>(Array(4).fill(""));

  const handleSelectChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    const selectedForm = formTypes.find(
      (formType) => formType.name === event.target.value
    );
    if (selectedForm) {
      setSelectedFormType(selectedForm);
    }
  };

  const handleAnswerChange = (
    index: number,
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    const newAnswers = [...answers];
    newAnswers[index] = event.target.value;
    setAnswers(newAnswers);
  };

  const handleSubmit = (event: React.FormEvent) => {
    event.preventDefault();
    console.log("Form Data:", {
      name,
      selectedFormType,
      answers,
    });
    (document.getElementById("my_modal_1") as HTMLDialogElement)?.close();
  };

  return (
    <>
      <button className="btn w-40 h-10" onClick={openModal}>
        {openButtonLabel}
      </button>
      <dialog id="my_modal_1" className="modal">
        <div className="modal-box w-full max-w-2xl">
          <h1 className="font-bold text-xl mb-2">{title}</h1>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="flex space-x-4">
              {/* Name Input */}
              <label className="flex-1">
                <span className="text-sm">Name:</span>
                <input
                  type="text"
                  className="input input-bordered w-full mt-1"
                  placeholder="The name of the form"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  required
                />
              </label>

              {/* Form Type Dropdown */}
              <label className="flex-1">
                <span className="text-sm">Form Type:</span>
                <select
                  className="select select-bordered w-full mt-1"
                  value={selectedFormType.name}
                  onChange={handleSelectChange}
                >
                  {formTypes.map((formType, index) => (
                    <option key={index} value={formType.name}>
                      {formType.name}
                    </option>
                  ))}
                </select>
              </label>
            </div>

            {/* Questions */}
            {selectedFormType.initial_context_questions.map(
              (question, index) => (
                <label className="block" key={index}>
                  <span className="text-sm">{question}</span>
                  <input
                    type="text"
                    className="input input-bordered w-full mt-1"
                    placeholder={`Answer question ${index + 1}`}
                    value={answers[index]}
                    onChange={(e) => handleAnswerChange(index, e)}
                    required
                  />
                </label>
              )
            )}

            {/* Modal Actions */}
            <div className="modal-action">
              <button type="submit" className="btn">
                Submit
              </button>
              <button
                type="button"
                className="btn"
                onClick={() =>
                  (
                    document.getElementById("my_modal_1") as HTMLDialogElement
                  )?.close()
                }
              >
                Close
              </button>
            </div>
          </form>
        </div>
      </dialog>
    </>
  );
};

export default MyModal;
