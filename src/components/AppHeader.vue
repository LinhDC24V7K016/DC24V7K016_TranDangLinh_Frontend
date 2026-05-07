<template>
  <nav class="navbar navbar-expand navbar-dark bg-dark">
    <router-link to="/" class="navbar-brand">Ứng dụng Quản lý danh bạ</router-link>
    <div class="mr-auto navbar-nav">
      <li class="nav-item">
        <router-link :to="{ name: 'contactbook' }" class="nav-link">
          Danh bạ
          <i class="fas fa-address-book"></i>
        </router-link>
      </li>
    </div>
    
    <div class="navbar-nav ml-auto" v-if="!authStore.isLoggedIn">
      <li class="nav-item">
        <router-link to="/register" class="nav-link">
          <i class="fas fa-user-plus"></i> Đăng ký
        </router-link>
      </li>
      <li class="nav-item">
        <router-link to="/login" class="nav-link">
          <i class="fas fa-sign-in-alt"></i> Đăng nhập
        </router-link>
      </li>
    </div>

    <div class="navbar-nav ml-auto" v-else>
      <li class="nav-item">
        <span class="nav-link text-light">
          <i class="fas fa-user"></i> {{ authStore.user?.name || authStore.user?.email }}
        </span>
      </li>
      <li class="nav-item">
        <a class="nav-link" style="cursor: pointer;" @click="handleLogout">
          <i class="fas fa-sign-out-alt"></i> Đăng xuất
        </a>
      </li>
    </div>
  </nav>
</template>

<script>
import { useAuthStore } from "@/stores/auth.store";
import { useRouter } from "vue-router";

export default {
  setup() {
    const authStore = useAuthStore();
    const router = useRouter();

    const handleLogout = () => {
      authStore.logout();
      router.push("/login");
    };

    return {
      authStore,
      handleLogout,
    };
  },
};
</script>
