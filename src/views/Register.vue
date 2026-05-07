<template>
  <div class="page d-flex justify-content-center align-items-center mt-5">
    <div class="card p-4 shadow" style="width: 400px; max-width: 90vw">
      <h3 class="text-center mb-4">Đăng Ký</h3>
      <div v-if="success" class="alert alert-success text-center">
        Đăng ký thành công! Đang chuyển hướng...
      </div>
      <Form v-else @submit="handleRegister" :validation-schema="registerSchema">
        <div class="form-group">
          <label for="name">Tên</label>
          <Field
            name="name"
            type="text"
            class="form-control"
            v-model="user.name"
          />
          <ErrorMessage name="name" class="error-feedback" />
        </div>
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
          <button class="btn btn-success btn-block" :disabled="loading">
            <span
              v-show="loading"
              class="spinner-border spinner-border-sm"
            ></span>
            <span>Đăng Ký</span>
          </button>
        </div>
        <div class="form-group mt-3 text-center">
          <div v-if="message" class="alert alert-danger" role="alert">
            {{ message }}
          </div>
        </div>
        <div class="text-center mt-3">
          <p>
            Đã có tài khoản? <router-link to="/login">Đăng nhập</router-link>
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
    const registerSchema = yup.object().shape({
      name: yup
        .string()
        .required("Tên là bắt buộc.")
        .min(2, "Tên phải có ít nhất 2 ký tự."),
      email: yup
        .string()
        .required("Email là bắt buộc.")
        .email("Email không hợp lệ."),
      password: yup
        .string()
        .required("Mật khẩu là bắt buộc.")
        .min(6, "Mật khẩu phải có ít nhất 6 ký tự."),
    });

    return {
      user: {
        name: "",
        email: "",
        password: "",
      },
      registerSchema,
      loading: false,
      message: "",
      success: false,
    };
  },
  methods: {
    async handleRegister() {
      this.loading = true;
      this.message = "";
      try {
        const authStore = useAuthStore();
        await authStore.register(this.user);
        this.success = true;
        setTimeout(() => {
          this.$router.push("/login");
        }, 1500);
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
