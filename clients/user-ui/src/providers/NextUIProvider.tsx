"use client";

import { gqlClient } from "@/graphql/gql.setup";
import { SessionProvider } from "next-auth/react";
import { ApolloProvider } from "@apollo/client";
import { ThemeProvider as NextThemesProvider } from "next-themes";

export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <ApolloProvider client={gqlClient}>
      <SessionProvider>
        <NextThemesProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
          disableTransitionOnChange
        >
          {children}
        </NextThemesProvider>
      </SessionProvider>
    </ApolloProvider>
  );
}
