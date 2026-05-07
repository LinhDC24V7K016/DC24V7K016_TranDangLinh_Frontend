import { defineStore } from "pinia";
import authService from "@/services/auth.service";

export const useAuthStore = defineStore("auth", {
  state: () => ({
    user: JSON.parse(localStorage.getItem("user")) || null,
    token: localStorage.getItem("token") || null,
  }),
  getters: {
    isLoggedIn: (state) => !!state.token,
  },
  actions: {
    async login(data) {
      try {
        const response = await authService.login(data);
        this.user = response.user;
        this.token = response.token;
        localStorage.setItem("user", JSON.stringify(response.user));
        localStorage.setItem("token", response.token);
        return response;
      } catch (error) {
        throw error;
      }
    },
    async register(data) {
      try {
        const response = await authService.register(data);
        return response;
      } catch (error) {
        throw error;
      }
    },
    logout() {
      this.user = null;
      this.token = null;
      localStorage.removeItem("user");
      localStorage.removeItem("token");
    },
  },
});
