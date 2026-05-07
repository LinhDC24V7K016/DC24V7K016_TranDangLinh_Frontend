<template>
  <div class="page d-flex justify-content-center align-items-center mt-5">
    <div class="card p-4 shadow" style="width: 400px; max-width: 90vw">
      <h3 class="text-center mb-4">Đăng Nhập</h3>
      <Form @submit="handleLogin" :validation-schema="loginSchema">
        <div class="form-group">
          <label for="email">Email</label>
          <Field
            name="email"
            type="email"
            class="form-control"
            v-model="user.email"
          />
          <ErrorMessage name="email" class="error-feedback" />
        </div>
        <div class="form-group">
          <label for="password">Mật khẩu</label>
          <Field
            name="password"
            type="password"
            class="form-control"
            v-model="user.password"
          />
          <ErrorMessage name="password" class="error-feedback" />
        </div>
        <div class="form-group mt-4">
          <button class="btn btn-primary btn-block" :disabled="loading">
            <span
              v-show="loading"
              class="spinner-border spinner-border-sm"
            ></span>
            <span>Đăng Nhập</span>
          </button>
        </div>
        <div class="form-group mt-3 text-center">
          <div v-if="message" class="alert alert-danger" role="alert">
            {{ message }}
          </div>
        </div>
        <div class="text-center mt-3">
          <p>
            Chưa có tài khoản?
            <router-link to="/register">Đăng ký ngay</router-link>
          </p>
        </div>
      </Form>
    </div>
  </div>
</template>

<script>
import * as yup from "yup";
import { Form, Field, ErrorMessage } from "vee-validate";
import { useAuthStore } from "@/stores/auth.store";

export default {
  components: {
    Form,
    Field,
    ErrorMessage,
  },
  data() {
    const loginSchema = yup.object().shape({
      email: yup
        .string()
        .required("Email là bắt buộc.")
        .email("Email không hợp lệ."),
      password: yup.string().required("Mật khẩu là bắt buộc."),
    });

    return {
      user: {
        email: "",
        password: "",
      },
      loginSchema,
      loading: false,
      message: "",
    };
  },
  methods: {
    async handleLogin() {
      this.loading = true;
      this.message = "";
      try {
        const authStore = useAuthStore();
        await authStore.login(this.user);
        this.$router.push("/");
      } catch (error) {
        this.message =
          (error.response &&
            error.response.data &&
            error.response.data.message) ||
          error.message ||
          error.toString();
      } finally {
        this.loading = false;
      }
    },
  },
};
</script>

<style scoped>
@import "@/assets/form.css";
</style>
