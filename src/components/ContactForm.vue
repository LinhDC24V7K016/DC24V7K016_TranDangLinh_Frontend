<template>
  <Form @submit="submitContact" :validation-schema="contactFormSchema">
    <div class="row">
      <div class="col-md-4 text-center">
        <div class="mb-3">
          <img 
            :src="avatarPreviewUrl" 
            alt="Avatar Preview" 
            class="img-thumbnail rounded-circle" 
            style="width: 160px; height: 160px; object-fit: cover; margin-top: 20px;" 
          />
        </div>
        <div class="form-group">
          <label for="avatarFile" class="btn btn-outline-secondary btn-sm mt-2">
            <i class="fa-solid fa-camera"></i> Chọn ảnh
          </label>
          <input
            type="file"
            class="d-none"
            id="avatarFile"
            @change="onFileChange"
            accept="image/*"
          />
        </div>
      </div>

      <div class="col-md-8">
        <div class="form-group">
          <label for="name">Tên</label>
          <Field
            name="name"
            type="text"
            class="form-control"
            v-model="contactLocal.name"
          />
          <ErrorMessage name="name" class="error-feedback" />
        </div>
        <div class="form-group">
          <label for="email">Email</label>
          <Field
            name="email"
            type="email"
            class="form-control"
            v-model="contactLocal.email"
          />
          <ErrorMessage name="email" class="error-feedback" />
        </div>
        <div class="form-group">
          <label for="address">Địa chỉ</label>
          <Field
            name="address"
            type="text"
            class="form-control"
            v-model="contactLocal.address"
          />
          <ErrorMessage name="address" class="error-feedback" />
        </div>
        <div class="form-group">
          <label for="phone">Điện thoại</label>
          <Field
            name="phone"
            type="text"
            class="form-control"
            v-model="contactLocal.phone"
          />
          <ErrorMessage name="phone" class="error-feedback" />
        </div>
        
        <div class="form-group align-items-center">
          <label class="mb-2">Nhóm danh bạ:</label>
          <div class="d-flex flex-wrap align-items-center" style="gap: 15px;">
            <div class="d-flex align-items-center" v-for="grp in availableGroups" :key="grp">
              <input
                type="checkbox"
                :value="grp"
                :id="grp"
                v-model="contactLocal.group"
                style="width: 16px; height: 16px; margin: 0; cursor: pointer; margin-top: 10px;"
              />
              <label class="mb-0 ml-1" :for="grp" style="cursor: pointer;">{{ grp }}</label>
            </div>
            
            <div class="d-flex align-items-center ml-2">
              <input 
                type="text" 
                class="form-control form-control-sm" 
                v-model="newGroup" 
                placeholder="Nhóm khác..." 
                style="width: 120px;" 
                @keyup.enter.prevent="addNewGroup" 
              />
              <button 
                type="button" 
                class="btn btn-sm btn-outline-secondary ml-1" 
                @click="addNewGroup"
                title="Thêm nhóm mới"
              >
                <i class="fa-solid fa-plus"></i>
              </button>
            </div>
          </div>
        </div>

        <div class="form-group d-flex align-items-center mt-2">
          <input
            name="favorite"
            type="checkbox"
            v-model="contactLocal.favorite"
            id="favoriteCheckbox"
            style="width: 18px; height: 18px; margin: 0; cursor: pointer; margin-top: 10px;"
          />
          <label for="favoriteCheckbox" class="mb-0 ml-2" style="cursor: pointer;"
            ><strong>Liên hệ yêu thích</strong></label
          >
        </div>
        <div class="form-group mt-3">
          <button class="btn btn-primary">
            <i class="fa-regular fa-floppy-disk"></i> Lưu
          </button>
          <button
            v-if="contactLocal._id"
            type="button"
            class="ml-2 btn btn-danger"
            @click="deleteContact"
          >
            <i class="fa-solid fa-trash"></i> Xóa
          </button>
          <button type="button" class="ml-2 btn btn-danger" @click="Cancel">
            <i class="fa-solid fa-times"></i> Thoát
          </button>
        </div>
      </div>
    </div>
  </Form>
</template>

<script>
import * as yup from "yup";
import { Form, Field, ErrorMessage } from "vee-validate";

export default {
  components: {
    Form,
    Field,
    ErrorMessage,
  },
  emits: ["submit:contact", "delete:contact"],
  props: { contact: { type: Object, required: true } },
  data() {
    const contactFormSchema = yup.object().shape({
      name: yup
        .string()
        .required("Tên phải có giá trị.")
        .min(2, "Tên phải có ít nhất 2 ký tự.")
        .max(50, "Tên không được vượt quá 50 ký tự."),
      email: yup
        .string()
        .email("Email không hợp lệ")
        .max(50, "Email không được vượt quá 50 ký tự."),
      address: yup.string().max(100, "Địa chỉ không được vượt quá 100 ký tự."),
      phone: yup
        .string()
        .matches(
          /((09|03|07|08|05)+([0-9]{8})\b)/g,
          "Điện thoại không hợp lệ.",
        ),
    });
    const defaultGroups = ["Gia đình", "Bạn bè", "Cơ quan"];
    const contactGroups = this.contact.group || [];
    const mergedGroups = [...new Set([...defaultGroups, ...contactGroups])];

    return {
      contactLocal: { ...this.contact, group: contactGroups },
      contactFormSchema,
      availableGroups: mergedGroups,
      newGroup: "",
      avatarFile: null,
      avatarPreviewUrl: this.contact.avatar 
        ? `/uploads/${this.contact.avatar}` 
        : `/src/assets/default_avatar.png`,
    };
  },
  methods: {
    addNewGroup() {
      const grp = this.newGroup.trim();
      if (grp) {
        if (!this.availableGroups.includes(grp)) {
          this.availableGroups.push(grp);
        }
        if (!this.contactLocal.group.includes(grp)) {
          this.contactLocal.group.push(grp);
        }
      }
      this.newGroup = "";
    },
    onFileChange(e) {
      const files = e.target.files;
      if (files.length > 0) {
        this.avatarFile = files[0];
        this.avatarPreviewUrl = URL.createObjectURL(this.avatarFile);
      }
    },
    submitContact() {
      const formData = new FormData();
      formData.append("name", this.contactLocal.name);
      formData.append("email", this.contactLocal.email || "");
      formData.append("address", this.contactLocal.address || "");
      formData.append("phone", this.contactLocal.phone || "");
      formData.append("favorite", this.contactLocal.favorite || false);
      
      if (this.contactLocal.group && this.contactLocal.group.length > 0) {
        this.contactLocal.group.forEach(grp => formData.append("group", grp));
      }

      if (this.avatarFile) {
        formData.append("avatarFile", this.avatarFile);
      }

      if (this.contactLocal._id) {
        formData.append("_id", this.contactLocal._id);
      }

      this.$emit("submit:contact", formData);
    },
    deleteContact() {
      this.$emit("delete:contact", this.contactLocal._id);
    },
    Cancel() {
      const reply = window.confirm(
        "You have unsaved changes! Do you want to leave?",
      );
      if (!reply) {
        return false;
      } else this.$router.push({ name: "contactbook" });
    },
  },
};
</script>

<style scoped>
@import "@/assets/form.css";
</style>
