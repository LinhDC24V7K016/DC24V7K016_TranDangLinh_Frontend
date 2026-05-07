<script>
export default {
  props: {
    contacts: { type: Array, default: [] },
    activeIndex: { type: Number, default: -1 },
  },
  emits: ["update:activeIndex", "toggle-pin"],
  methods: {
    updateActiveIndex(index) {
      this.$emit("update:activeIndex", index);
    },
  },
};
</script>

<template>
  <ul class="list-group contact-list">
    <li
      class="list-group-item contact-item"
      v-for="(contact, index) in contacts"
      :key="contact._id"
      :class="{ active: index === activeIndex }"
      @click="updateActiveIndex(index)"
    >
      <div class="d-flex justify-content-between align-items-center w-100">
        <span>{{ contact.name }}</span>
        <div class="d-flex align-items-center">
          <i v-if="contact.favorite" class="fas fa-heart text-danger mr-2"></i>
          <button 
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
