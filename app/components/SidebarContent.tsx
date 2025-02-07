'use client';

import { useQuery } from '@tanstack/react-query';
import { TodosServiceInstance } from '@/shared/services/todosAxios';
import { Spinner } from '@/app/components';
import { ErrorMessage } from '@/app/components';

type TPost = {
  userId: number;
  id: number;
  title: string;
  body: string;
};

const SidebarContent = () => {
  const {
    data: posts,
    isLoading,
    isError
  } = useQuery({
    queryKey: ['posts'],
    queryFn: TodosServiceInstance.fetchTestPosts
  });
  return (
    <div>
      <h2 className="font-bold">Sidebar</h2>
      {isLoading ? (
        <Spinner />
      ) : isError ? (
        <ErrorMessage>Failed to fetch todos</ErrorMessage>
      ) : (
        <ul className="flex flex-col gap-[10px] p-[10px] border border-green-600 rounded-sm">
          {posts &&
            posts.map((post: TPost) => (
              <li className="border-b border-green-200" key={post.id}>
                {post.title}
              </li>
            ))}
        </ul>
      )}
    </div>
  );
};

export default SidebarContent;
