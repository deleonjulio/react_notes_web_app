import { RouterProvider } from 'react-router-dom'
import { HelmetProvider } from 'react-helmet-async'
import { QueryClientProvider, QueryClient } from "@tanstack/react-query";
import Root from './routes/AppRoutes';
import { NotesProvider } from './providers/NotesProvider';

const queryClient = new QueryClient()

const App = () => {
  return (
    <HelmetProvider>
      <QueryClientProvider client={queryClient}>
        <NotesProvider>
          <RouterProvider router={Root} />
        </NotesProvider>
      </QueryClientProvider>
    </HelmetProvider>
  )
}

export default App
