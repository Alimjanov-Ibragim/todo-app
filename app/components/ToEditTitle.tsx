"use client";

import React from "react";
import { useRouter } from "next/navigation";

const ToEditTitle = ({ title, id }: { title: string; id: number }) => {
  const router = useRouter();
  return (
    <h4
      className="font-bold cursor-pointer hover:underline"
      onClick={() => router.push(`/todos/edit/?id=${id}`)}
    >
      {title}
    </h4>
  );
};

export default ToEditTitle;
