import React from "react";
import { Button } from "../ui/button";

import { useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";

const RefreshForms: React.FC = () => {
  const queryClient = useQueryClient();

  const handleRefresh = () => {
    queryClient.invalidateQueries({ queryKey: ["fetchForms"] });
    toast("forms have been refreshed", {
      description: "All forms have been refreshed",
    });
  };

  return (
    <Button variant={"primary"} onClick={handleRefresh}>
      Refresh Forms
    </Button>
  );
};
export default RefreshForms;
