"use client";

import { ApolloProvider } from "@apollo/client";
import { client } from "@/lib/graphql";
import { AuthProvider } from "@/contexts/AuthContext";
import { Toaster } from "react-hot-toast";

export default function Providers({ children }: { children: React.ReactNode }) {
  return (
    <ApolloProvider client={client}>
      <AuthProvider>
        {children}
        <Toaster position="top-right" />
      </AuthProvider>
    </ApolloProvider>
  );
}
