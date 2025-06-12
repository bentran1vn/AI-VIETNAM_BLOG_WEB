import {
  createContext,
  useContext,
  useState,
  ReactNode,
  useEffect,
} from "react";
import { User } from "@/types/auth";
import { useRouter, usePathname } from "next/navigation";
import { useMutation, useQuery } from "@apollo/client";
import { gql } from "@apollo/client";
import { UserRole } from "@/types/user";

const LOGOUT_MUTATION = gql`
  mutation Logout {
    logout
  }
`;

const ME_QUERY = gql`
  query Me {
    me {
      _id
      username
      email
      role
      createdAt
    }
  }
`;

interface AuthContextType {
  user: User | null;
  login: (user: User) => void;
  logout: () => void;
  isAuthenticated: boolean;
  loading: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const router = useRouter();
  const pathname = usePathname();

  const [logoutMutation] = useMutation(LOGOUT_MUTATION);
  const { loading } = useQuery(ME_QUERY, {
    onCompleted: (data) => {
      if (data?.me) {
        setUser(data.me);
        setIsAuthenticated(true);
      }
    },
    onError: () => {
      setUser(null);
      setIsAuthenticated(false);
    },
  });

  useEffect(() => {
    if (!loading) {
      // List of public paths that don't require authentication
      const publicPaths = ["/blog", "/auth/login", "/auth/register"];
      const isPublicPath = publicPaths.some((path) =>
        pathname?.startsWith(path)
      );

      if (!isAuthenticated && !isPublicPath) {
        router.push("/auth/login");
      } else if (isAuthenticated && user) {
        if (pathname?.startsWith("/auth/")) {
          // Redirect to appropriate page based on role
          if (user.role === UserRole.ADMIN) {
            router.push("/admin/users");
          } else {
            router.push("/dashboard");
          }
        } else if (
          pathname?.startsWith("/admin") &&
          user.role !== UserRole.ADMIN
        ) {
          // Redirect non-admin users trying to access admin pages
          router.push("/dashboard");
        }
      }
    }
  }, [isAuthenticated, user, loading, pathname, router]);

  const login = (newUser: User) => {
    setUser(newUser);
    setIsAuthenticated(true);
  };

  const logout = async () => {
    try {
      await logoutMutation();
    } catch (error) {
      console.error("Logout error:", error);
    } finally {
      setUser(null);
      setIsAuthenticated(false);
      router.push("/auth/login");
    }
  };

  return (
    <AuthContext.Provider
      value={{ user, login, logout, isAuthenticated, loading }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
}
