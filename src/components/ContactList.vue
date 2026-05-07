<script>
export default {
  props: {
    contacts: { type: Array, default: [] },
    activeIndex: { type: Number, default: -1 },
    isExportMode: { type: Boolean, default: false },
    selectedIds: { type: Array, default: () => [] },
  },
  emits: ["update:activeIndex", "toggle-pin", "update:selectedIds"],
  methods: {
    updateActiveIndex(index) {
      if (this.isExportMode) {
        this.toggleSelection(this.contacts[index]._id);
      } else {
        this.$emit("update:activeIndex", index);
      }
    },
    toggleSelection(id) {
      const newSelected = [...this.selectedIds];
      const idx = newSelected.indexOf(id);
      if (idx === -1) {
        newSelected.push(id);
      } else {
        newSelected.splice(idx, 1);
      }
      this.$emit("update:selectedIds", newSelected);
    }
  },
};
</script>

<template>
  <ul class="list-group contact-list">
    <li
      class="list-group-item contact-item"
      v-for="(contact, index) in contacts"
      :key="contact._id"
      :class="{ active: index === activeIndex && !isExportMode }"
      @click="updateActiveIndex(index)"
      style="cursor: pointer;"
    >
      <div class="d-flex justify-content-between align-items-center w-100">
        <div class="d-flex align-items-center">
          <input 
            v-if="isExportMode"
            type="checkbox" 
            class="mr-3"
            style="width: 18px; height: 18px;"
            :checked="selectedIds.includes(contact._id)"
            @click.stop="toggleSelection(contact._id)"
          />
          <span>{{ contact.name }}</span>
        </div>
        <div class="d-flex align-items-center">
          <i v-if="contact.favorite" class="fas fa-heart text-danger mr-2"></i>
          <button 
            v-if="!isExportMode"
            class="btn btn-sm btn-pin" 
            :class="{ 'pinned': contact.pinned }"
            @click.stop="$emit('toggle-pin', contact)"
            :title="contact.pinned ? 'Bỏ ghim' : 'Ghim lên đầu'"
          >
            <i class="fas fa-thumbtack"></i>
          </button>
        </div>
      </div>
    </li>
  </ul>
</template>

<style scoped>
.contact-item .btn-pin {
  background: transparent;
  border: none;
  color: #ccc;
  opacity: 0;
  transition: opacity 0.2s, color 0.2s;
  padding: 0 5px;
}

.contact-item:hover .btn-pin {
  opacity: 1;
}

.contact-item .btn-pin.pinned {
  opacity: 1;
  color: gray; 
}

.contact-item .btn-pin:hover {
  color: #0056b3;
}
</style>
