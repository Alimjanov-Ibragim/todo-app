'use client';

import { useQuery } from '@tanstack/react-query';
import { TodosServiceInstance } from '@/shared/services/todosAxios';
import Spinner from '@/app/components/Spinner';
import ErrorMessage from '@/app/components/ErrorMessage';

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
      <h2>Sidebar</h2>
      {isLoading ? (
        <Spinner />
      ) : isError ? (
        <ErrorMessage>Failed to fetch todos</ErrorMessage>
      ) : (
        <ul>
          {posts &&
            posts.map((post: TPost) => <li key={post.id}>{post.title}</li>)}
        </ul>
      )}
    </div>
  );
};

export default SidebarContent;
