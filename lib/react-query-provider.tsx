'use client';

import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { ReactQueryDevtools } from '@tanstack/react-query-devtools';
import { useState } from 'react';

export function ReactQueryProvider({ children }: { children: React.ReactNode }) {
	const [queryClient] = useState(() => new QueryClient({
		defaultOptions: {
			queries: {
				// Stale time: how long data is considered fresh (5 minutes)
				staleTime: 1000 * 60 * 5,
				// Cache time: how long data stays in cache after component unmount (10 minutes)
				gcTime: 1000 * 60 * 10,
				// Retry configuration
				retry: 1,
				// Refetch configuration
				refetchOnWindowFocus: false,
				refetchOnReconnect: 'always',
			},
			mutations: {
				// Retry configuration for mutations
				retry: 0,
			},
		},
	}));

	return (
		<QueryClientProvider client={queryClient}>
			{children}
			{process.env.NODE_ENV === 'development' && <ReactQueryDevtools initialIsOpen={false} />}
		</QueryClientProvider>
	);
}