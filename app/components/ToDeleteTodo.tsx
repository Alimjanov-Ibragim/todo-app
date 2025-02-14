"use client";

import React from "react";
import { removeTodo } from "../actions";

const ToDeleteTodo = ({
  postId,
  userId,
}: {
  postId: number;
  userId: number;
}) => {
  return (
    <button
      onClick={async () =>
        await removeTodo({
          postId,
          userId,
        })
      }
      className="px-[10px] py-[5px] text-white bg-red-500 rounded-sm"
    >
      Delete
    </button>
  );
};

export default ToDeleteTodo;
