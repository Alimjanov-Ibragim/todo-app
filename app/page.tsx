import { redirect } from 'next/navigation';

export default function Home() {
  const token = true;
  if (token) redirect('/todos');
  return <div>Hello</div>;
}
