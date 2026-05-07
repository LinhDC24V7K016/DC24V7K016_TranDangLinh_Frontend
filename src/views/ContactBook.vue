<template>
  <div class="page row">
    <div class="col-md-8 mb-3">
      <InputSearch v-model="searchText" />
    </div>
    <div class="col-md-4 mb-3">
      <select v-model="selectedGroup" class="form-control" title="Lọc theo nhóm">
        <option value="">-- Tất cả nhóm --</option>
        <option v-for="grp in availableGroups" :key="grp.id" :value="grp.id">{{ grp.label }}</option>
      </select>
    </div>
    <div class="col-md-6">
      <ul class="nav nav-tabs mb-3">
        <li class="nav-item">
          <a class="nav-link" :class="{ active: filterType === 'all' }" @click="filterType = 'all'; activeId = null" style="cursor: pointer;">Tất cả liên hệ</a>
        </li>
        <li class="nav-item">
          <a class="nav-link text-danger" :class="{ active: filterType === 'favorite' }" @click="filterType = 'favorite'; activeId = null" style="cursor: pointer;">
            Yêu thích
          </a>
        </li>
      </ul>

      <h4 v-if="filterType === 'all'">
        Danh bạ
        <i class="fas fa-address-book"></i>
      </h4>
      <h4 v-else>
        Liên hệ yêu thích
        <i class="fas fa-heart text-danger"></i>
      </h4>
      <ContactList
        v-if="filteredContactsCount > 0"
        :contacts="filteredContacts"
        v-model:activeIndex="activeIndex"
        @toggle-pin="handleTogglePin"
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
        <ContactCard :contact="activeContact" @filter-group="selectedGroup = $event.trim().toLowerCase()" />
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
      filterType: "all",
      activeId: null,
    };
  },
  watch: {
    searchText() {
      this.activeId = null;
    },
  },
  computed: {
    availableGroups() {
      const groupMap = new Map();
      this.contacts.forEach(contact => {
        if (contact.group && Array.isArray(contact.group)) {
          contact.group.forEach(g => {
            const lower = g.trim().toLowerCase();
            if (!groupMap.has(lower) && lower !== "") {
              const normalized = g.trim().charAt(0).toUpperCase() + g.trim().slice(1).toLowerCase();
              groupMap.set(lower, normalized);
            }
          });
        }
      });
      const arr = Array.from(groupMap.entries()).map(([id, label]) => ({ id, label }));
      arr.sort((a, b) => a.label.localeCompare(b.label));
      return arr;
    },
    filteredContacts() {
      let result = this.contacts.filter((contact) => {
        if (this.filterType === "favorite" && !contact.favorite) {
          return false;
        }
        if (this.selectedGroup) {
          const hasGroup = contact.group && Array.isArray(contact.group) && contact.group.some(g => g.trim().toLowerCase() === this.selectedGroup);
          if (!hasGroup) return false;
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

      return result.sort((a, b) => {
        if (a.pinned === b.pinned) return 0;
        return a.pinned ? -1 : 1;
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
    async handleTogglePin(contact) {
      try {
        const updatedContact = { ...contact, pinned: !contact.pinned };
        await ContactService.update(contact._id, updatedContact);
        const index = this.contacts.findIndex((c) => c._id === contact._id);
        if (index !== -1) {
          this.contacts[index].pinned = updatedContact.pinned;
        }
      } catch (err) {
        console.error("Lỗi khi ghim/bỏ ghim liên hệ:", err);
      }
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
