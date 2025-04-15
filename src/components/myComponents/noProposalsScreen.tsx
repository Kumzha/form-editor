import React, { useState } from "react";
import { Button } from "../ui/button";
import { PlusCircle, FileText } from "lucide-react";
import { motion } from "framer-motion";
import FormCreationDialog from "./FormCreationDialog";

const NoProposalScreen: React.FC = () => {
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  return (
    <FormCreationDialog
      isOpen={isDialogOpen}
      onOpenChange={setIsDialogOpen}
      trigger={
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex flex-col items-center justify-center min-h-[400px] p-8 text-center rounded-lg"
        >
          <div className="relative mb-6">
            <motion.div
              animate={{
                scale: [1, 1.1, 1],
              }}
              transition={{
                duration: 2,
                repeat: Number.POSITIVE_INFINITY,
                repeatType: "reverse",
              }}
            >
              <FileText className="w-16 h-16 text-muted-foreground/60" />
            </motion.div>
            <motion.div
              className="absolute -right-2 -top-2"
              animate={{
                rotate: [0, 15, 0],
              }}
              transition={{
                duration: 2,
                repeat: Number.POSITIVE_INFINITY,
                repeatType: "reverse",
              }}
            >
              <PlusCircle className="w-6 h-6 text-primary" />
            </motion.div>
          </div>

          <h3 className="text-lg font-semibold mb-2">No proposals yet</h3>
          <p className="text-muted-foreground mb-6 max-w-sm">
            Create your first proposal to get started. It only takes a few
            minutes to draft your ideas.
          </p>

          <Button size="lg" className="gap-2">
            <PlusCircle className="w-4 h-4" />
            Create New Proposal
          </Button>
        </motion.div>
      }
    />
  );
};

export default NoProposalScreen;
