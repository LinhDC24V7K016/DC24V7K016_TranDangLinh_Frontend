<template>
  <div class="page row">
    <div class="col-md-8 mb-3">
      <InputSearch v-model="searchText" />
    </div>
    <div class="col-md-4 mb-3">
      <select v-model="selectedGroup" class="form-control" title="Lọc theo nhóm">
        <option value="">-- Tất cả nhóm --</option>
        <option v-for="grp in availableGroups" :key="grp" :value="grp">{{ grp }}</option>
      </select>
    </div>
    <div class="col-md-6">
      <h4>
        Danh bạ
        <i class="fas fa-address-book"></i>
      </h4>
      <ContactList
        v-if="filteredContactsCount > 0"
        :contacts="filteredContacts"
        v-model:activeIndex="activeIndex"
      />
      <p v-else>Không có liên hệ nào.</p>

      <div class="mt-3 row justify-content-around align-items-center">
        <button class="btn btn-sm btn-primary" @click="refreshList">
          <i class="fa-solid fa-arrow-rotate-right"></i> Làm mới
        </button>

        <button class="btn btn-sm btn-success" @click="goToAddContact">
          <i class="fa-solid fa-plus"></i> Thêm mới
        </button>

        <button class="btn btn-sm btn-danger" @click="removeAllContacts">
          <i class="fa-solid fa-trash"></i> Xóa tất cả
        </button>
      </div>
    </div>
    <div class="mt-3 col-md-6">
      <div v-if="activeContact">
        <h4>
          Chi tiết liên hệ
          <i class="fas fa-address-card"></i>
        </h4>
        <ContactCard :contact="activeContact" @filter-group="selectedGroup = $event" />
        <router-link
          :to="{
            name: 'contact.edit',
            params: { id: activeContact._id },
          }"
        >
          <span class="mt-2 badge badge-warning">
            <i class="fa-solid fa-pen-to-square"></i> Hiệu chỉnh
          </span>
        </router-link>
      </div>
    </div>
  </div>
</template>

<script>
import ContactCard from "@/components/ContactCard.vue";
import InputSearch from "@/components/InputSearch.vue";
import ContactList from "@/components/ContactList.vue";
import ContactService from "@/services/contact.service";
import router from "@/router";

export default {
  components: {
    ContactCard,
    InputSearch,
    ContactList,
  },
  data() {
    return {
      contacts: [],
      searchText: "",
      selectedGroup: "",
      activeId: null,
    };
  },
  watch: {
    searchText() {
      // We don't explicitly need to clear activeId, it will auto-hide if filtered out.
      // But to match previous behavior, we can clear it on new search text:
      this.activeId = null;
    },
    // We remove the selectedGroup watch so that it DOES NOT close the contact when clicking a group badge
  },
  computed: {
    availableGroups() {
      const groups = new Set();
      this.contacts.forEach(contact => {
        if (contact.group && Array.isArray(contact.group)) {
          contact.group.forEach(g => groups.add(g));
        }
      });
      return Array.from(groups).sort();
    },
    filteredContacts() {
      return this.contacts.filter((contact) => {
        if (this.selectedGroup && (!contact.group || !contact.group.includes(this.selectedGroup))) {
          return false;
        }
        if (this.searchText) {
          const { name, email, address, phone } = contact;
          const contactString = [name, email, address, phone].join(" ").toLowerCase();
          if (!contactString.includes(this.searchText.toLowerCase())) {
            return false;
          }
        }
        return true;
      });
    },
    activeIndex: {
      get() {
        if (!this.activeId) return -1;
        return this.filteredContacts.findIndex(c => c._id === this.activeId);
      },
      set(index) {
        if (index < 0 || index >= this.filteredContacts.length) {
          this.activeId = null;
        } else {
          this.activeId = this.filteredContacts[index]._id;
        }
      }
    },
    activeContact() {
      if (!this.activeId) return null;
      return this.contacts.find(c => c._id === this.activeId) || null;
    },
    filteredContactsCount() {
      return this.filteredContacts.length;
    },
  },
  methods: {
    async retrieveContacts() {
      try {
        this.contacts = await ContactService.getAll();
      } catch (err) {
        console.error(err);
      }
    },

    async refreshList() {
      this.retrieveContacts();
      this.activeIndex = -1;
    },
    async removeAllContacts() {
      if (confirm("Bạn có muốn xóa tất cả liên hệ?")) {
        try {
          await ContactService.deleteAll();
          this.refreshList();
        } catch (err) {
          console.error(err);
        }
      }
    },
    goToAddContact() {
      this.$router.push({ name: "contact.add" });
    },
  },
  mounted() {
    this.refreshList();
  },
};
</script>

<style scoped>
.page {
  text-align: left;
  max-width: 950px;
  margin: auto;
}
</style>
