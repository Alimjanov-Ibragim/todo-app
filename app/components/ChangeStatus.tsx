"use client";

import React from "react";

import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { TStatus } from "@/lib/types";
import { updateStatusTodo } from "../actions";

const ChangeStatus = ({
  postId,
  status,
  userId,
}: {
  postId: number;
  status: TStatus;
  userId: number;
}) => {
  const handleChangeStatus = async (status: TStatus, postId: number) => {
    try {
      await updateStatusTodo({ status, postId, userId });
    } catch (error) {
      console.log("error", error);
    }
  };

  return (
    <Select
      onValueChange={(e: TStatus) => handleChangeStatus(e, postId)}
      defaultValue={status}
    >
      <SelectTrigger className="w-[180px]">
        <SelectValue placeholder="Status" />
      </SelectTrigger>
      <SelectContent>
        <SelectGroup>
          <SelectLabel>Status</SelectLabel>
          <SelectItem value="OPEN">open</SelectItem>
          <SelectItem value="IN_PROGRESS">in progress</SelectItem>
          <SelectItem value="COMPLETED">completed</SelectItem>
        </SelectGroup>
      </SelectContent>
    </Select>
  );
};

export default ChangeStatus;
