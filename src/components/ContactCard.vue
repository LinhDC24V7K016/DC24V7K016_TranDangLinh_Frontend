<script>
export default {
  props: {
    contact: { type: Object, required: true },
  },
  emits: ["filter-group"],
};
</script>

<template>
  <div class="card p-3 shadow-sm text-center">
    <div class="mb-3 d-flex justify-content-center">
      <img
        :src="
          contact.avatar
            ? '/uploads/' + contact.avatar
            : '/src/assets/default_avatar.png'
        "
        alt="Avatar"
        class="img-thumbnail rounded-circle"
        style="width: 170px; height: 170px; object-fit: cover"
      />
    </div>
    <div class="text-left" style="font-size: 1.1rem; line-height: 1.6">
      <div class="p-1"><strong>Tên:</strong> {{ contact.name }}</div>
      <div class="p-1"><strong>Email:</strong> {{ contact.email }}</div>
      <div class="p-1"><strong>Địa chỉ:</strong> {{ contact.address }}</div>
      <div class="p-1"><strong>Điện thoại:</strong> {{ contact.phone }}</div>
      <div class="p-1" v-if="contact.group && contact.group.length > 0">
        <strong>Nhóm: </strong>
        <span
          v-for="grp in contact.group"
          :key="grp"
          class="badge badge-info mr-1"
          style="font-size: 0.95rem; cursor: pointer"
          @click="$emit('filter-group', grp)"
          >{{ grp }}</span
        >
      </div>
      <div class="p-1">
        <strong>Liên hệ yêu thích:&nbsp;</strong>
        <i v-if="contact.favorite" class="fa-solid fa-check text-success"></i>
        <i v-else class="fa-solid fa-times text-danger"></i>
      </div>
    </div>
  </div>
</template>
