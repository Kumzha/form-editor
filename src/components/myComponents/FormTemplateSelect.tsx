import React from "react";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { FormInterface } from "@/types/formType";

interface FormTemplateSelectProps {
  value: string;
  onChange: (value: string) => void;
  templates?: FormInterface[];
}

const FormTemplateSelect: React.FC<FormTemplateSelectProps> = ({
  value,
  onChange,
  templates,
}) => {
  return (
    <div className="grid grid-cols-6 items-center gap-4">
      <Label htmlFor="formType" className="text-right">
        Form Type
      </Label>
      <Select value={value} onValueChange={onChange}>
        <SelectTrigger className="col-span-5">
          <SelectValue placeholder="Select a form template" />
        </SelectTrigger>
        <SelectContent>
          <SelectGroup>
            <SelectLabel>Form Templates</SelectLabel>
            {templates &&
              templates.map((template, index) => (
                <SelectItem key={index} value={template.name}>
                  {template.name}
                </SelectItem>
              ))}
          </SelectGroup>
        </SelectContent>
      </Select>
    </div>
  );
};

export default FormTemplateSelect;
