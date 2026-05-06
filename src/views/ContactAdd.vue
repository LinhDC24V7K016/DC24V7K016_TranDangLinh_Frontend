<template>
  <div class="page">
    <h4>Thêm mới liên hệ</h4>
    <ContactForm :contact="contact" @submit:contact="addContact" />
  </div>
</template>

<script>
import ContactForm from "@/components/ContactForm.vue";
import ContactService from "@/services/contact.service";

export default {
  components: {
    ContactForm,
  },
  data() {
    return {
      contact: {
        name: "",
        email: "",
        address: "",
        phone: "",
        favorite: false,
      },
    };
  },
  methods: {
    async addContact(data) {
      try {
        await ContactService.create(data);
        alert("Thêm mới liên hệ thành công.");
        this.$router.push({ name: "contactbook" });
      } catch (error) {
        console.log(error);
      }
    },
  },
};
</script>
