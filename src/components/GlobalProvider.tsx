"use client";

import { QueryClient, QueryClientProvider } from "@tanstack/react-query";

interface GlobalProviderProps {
  children: React.ReactNode;
}

const queryClient = new QueryClient();

export const GlobalProvider = ({ children }: GlobalProviderProps) => {
  return (
    <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
  );
};
