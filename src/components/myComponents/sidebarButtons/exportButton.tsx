// components/DocumentExport.tsx
import React from "react";
import { Document, Packer, Paragraph, TextRun } from "docx";
import { useSelector } from "react-redux";
import { RootState } from "@/store/store";
import { toast } from "sonner";
import SidebarItem from "./sidebarItem";
import { TbFileExport } from "react-icons/tb";

const ExportButton: React.FC<{ isOpen: boolean }> = ({ isOpen }) => {
  const { selectedForm } = useSelector((state: RootState) => state.userForms);

  const exportDocument = async () => {
    const paragraphs: Paragraph[] = [];

    if (!selectedForm) {
      toast.error("Select a form to export.");
      return;
    }

    // Form name and type header
    paragraphs.push(
      new Paragraph({
        children: [
          new TextRun({
            text: `Form Name: ${selectedForm.name}`,
            bold: true,
            size: 32, // 16pt
          }),
        ],
      })
    );
    paragraphs.push(
      new Paragraph({
        children: [
          new TextRun({
            text: `Form Type: ${selectedForm.form_type.name}`,
            bold: true,
            size: 28, // 14pt
          }),
        ],
      })
    );
    paragraphs.push(new Paragraph({ text: "" })); // Empty line for spacing

    // Initial Context Section
    paragraphs.push(
      new Paragraph({
        children: [
          new TextRun({
            text: "Initial Context",
            bold: true,
            size: 28,
          }),
        ],
      })
    );

    selectedForm.form_type.initial_context_questions.forEach(
      (question, index) => {
        const answer = selectedForm.initial_context[index] || "";
        paragraphs.push(
          new Paragraph({
            children: [
              new TextRun({
                text: `Q: ${question}`,
                bold: true,
                size: 24, // 12pt
              }),
            ],
          })
        );
        paragraphs.push(
          new Paragraph({
            children: [
              new TextRun({
                text: `A: ${answer}`,
                size: 24,
              }),
            ],
          })
        );
        paragraphs.push(new Paragraph({ text: "" }));
      }
    );

    // Iterate over question groups from form_type.questions
    selectedForm.form_type.questions.forEach((group, groupIndex) => {
      paragraphs.push(
        new Paragraph({
          children: [
            new TextRun({
              text: group.title,
              bold: true,
              size: 28,
            }),
          ],
        })
      );
      paragraphs.push(new Paragraph({ text: "" }));

      // Iterate over subpoints within the group
      group.subpoints.forEach((subpoint, subIndex) => {
        // Retrieve corresponding answer from selectedForm.points
        const answer =
          selectedForm.points?.[groupIndex]?.subpoints?.[subIndex]?.content ||
          "";

        paragraphs.push(
          new Paragraph({
            children: [
              new TextRun({
                text: `${subpoint.sub_title}:`,
                bold: true,
                size: 24,
              }),
            ],
          })
        );
        paragraphs.push(
          new Paragraph({
            children: [
              new TextRun({
                text: answer,
                size: 24,
              }),
            ],
          })
        );
        paragraphs.push(new Paragraph({ text: "" }));
      });
    });

    // Create a new Document using the generated paragraphs
    const doc = new Document({
      styles: {
        default: {
          document: {
            run: {
              font: "Arial", // Replace with your desired font
            },
          },
        },
      },
      sections: [
        {
          children: paragraphs,
        },
      ],
    });

    // Convert the Document to a Blob and trigger the download
    const blob = await Packer.toBlob(doc);
    const url = window.URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = `${selectedForm.name}.docx`;
    document.body.appendChild(link);
    link.click();

    // Clean up the link and URL
    document.body.removeChild(link);
    window.URL.revokeObjectURL(url);
  };

  return (
    <SidebarItem
      text="Export"
      logo={<TbFileExport size={20} />}
      onClick={exportDocument}
      isOpen={isOpen}
    />
  );
};

export default ExportButton;
