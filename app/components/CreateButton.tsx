"use client";

import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";
import React from "react";

const CreateButton = () => {
  const router = useRouter();
  return (
    <Button onClick={() => router.push(`/todos/create`)}>Create todo</Button>
  );
};

export default CreateButton;
