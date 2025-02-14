import React from "react";
import { authOptions } from "@/lib/auth";
import { getServerSession } from "next-auth/next";

import { ExtendedTodo } from "@/lib/types";
import "easymde/dist/easymde.min.css";
import {
  LogoutButton,
  CreateButton,
  ToDeleteTodo,
  ToEditTitle,
  ChangeStatus,
} from "@/app/components";
import { getTodos } from "@/app/queries";

const TodosPage = async () => {
  const session = await getServerSession(authOptions);

  const todos = await getTodos(session?.user?.id);

  if (!session) return <p>Доступ запрещён</p>;

  return (
    <div className="flex flex-col gap-[40px]">
      <div>
        <h1 className="font-bold">Todos</h1>
        <div className="flex items-end justify-between gap-[10px]">
          <CreateButton />
          <div className="flex flex-col">
            <strong>User: {session?.user?.name || session?.user?.email}</strong>
            <LogoutButton />
          </div>
        </div>
      </div>
      {todos && todos.length > 0 && (
        <div className="grid grid-cols-1 gap-[40px]">
          <div>
            <ul className="p-[10px] border rounded-[8px]">
              {todos.map((todo: ExtendedTodo) => (
                <li
                  key={todo.id}
                  className="flex justify-between items-start gap-[10px] p-[10px] border-b border-gray-500"
                >
                  <div>
                    <ToEditTitle title={todo.title} id={todo.id} />
                    <p>{todo.description}</p>
                  </div>

                  <div className="flex flex-col items-end gap-[10px]">
                    <ChangeStatus
                      postId={todo.id}
                      status={todo.status}
                      userId={session?.user?.id}
                    />
                    <ToDeleteTodo postId={todo.id} userId={session?.user?.id} />
                  </div>
                </li>
              ))}
            </ul>
          </div>
        </div>
      )}
    </div>
  );
};

export default TodosPage;
