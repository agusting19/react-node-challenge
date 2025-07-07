import { login as apiLogin, logout as apiLogout } from "@/lib/api-services";
import { useAuthStore } from "@/stores/useAuthStore";
import type { LoginRequest } from "@/types/auth";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";

export const useAuth = () => {
  const { isAuthenticated, token, user, loading, setAuth, clearAuth } =
    useAuthStore();

  const queryClient = useQueryClient();

  const loginMutation = useMutation({
    mutationFn: (credentials: LoginRequest) => apiLogin(credentials),
    onSuccess: (response) => {
      if (response.success && response.token && response.user) {
        setAuth(response.token, response.user);
        toast.success("¡Inicio de sesión exitoso!");
      }
    },
    onError: (error: Error) => {
      toast.error("Error al iniciar sesión", {
        description: error.message,
      });
    },
  });

  const logoutMutation = useMutation({
    mutationFn: apiLogout,
    onSuccess: () => {
      clearAuth();
      queryClient.clear();
      toast.success("Sesión cerrada correctamente");
    },
    onError: (error: Error) => {
      clearAuth();
      queryClient.clear();
      toast.error("Error al cerrar sesión", {
        description: error.message,
      });
    },
  });

  const login = async (
    email: string,
    password: string
  ): Promise<{ success: boolean; message: string }> => {
    try {
      const response = await loginMutation.mutateAsync({ email, password });

      if (!response.success) {
        return {
          success: false,
          message: "Error",
        };
      }

      return {
        success: response.success,
        message: "Login exitoso",
      };
    } catch (error) {
      const errorMessage =
        error instanceof Error ? error.message : "Error en el login";

      return {
        success: false,
        message: errorMessage,
      };
    }
  };

  const logout = () => {
    logoutMutation.mutate();
  };

  return {
    isAuthenticated,
    token,
    user,
    loading: loading || loginMutation.isPending || logoutMutation.isPending,
    login,
    logout,
    loginMutation,
    logoutMutation,
  };
};
