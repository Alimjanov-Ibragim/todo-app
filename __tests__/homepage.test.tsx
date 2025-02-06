import '@testing-library/jest-dom';
import { render, screen, waitFor } from '@testing-library/react';
import Page from '@/app/todos/page';
import { TestWrapper } from '@/lib/TestWrapper';
import { TodosServiceInstance } from '@/shared/services/todosAxios';

describe('Page', () => {
  it('renders a heading', () => {
    render(
      <TestWrapper>
        <Page />
      </TestWrapper>
    );

    const heading = screen.getByRole('heading', { level: 1 });

    expect(heading).toBeInTheDocument();
  });

  it('displays todos after fetching', async () => {
    const mockTodos = [
      {
        id: 1,
        title: 'title',
        description: 'desc',
        status: 'OPEN',
        createdAt: '2020-01-01',
        updatedAt: '2020-01-01'
      }
    ];
    jest.spyOn(TodosServiceInstance, 'fetchTodos').mockResolvedValue(mockTodos);

    render(
      <TestWrapper>
        <Page />
      </TestWrapper>
    );

    await waitFor(() => {
      expect(screen.getByText(/title/i)).toBeInTheDocument();
      expect(screen.getByText(/desc/i)).toBeInTheDocument();
      expect(screen.getByText(/OPEN/i)).toBeInTheDocument();
    });
  });
});
