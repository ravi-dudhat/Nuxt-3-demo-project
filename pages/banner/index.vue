<template>
  <div>
    <strong class="text-lg grid justify-items-center items-center py-2"
      >Banners</strong
    ><UNotifications />
    <strong class="text-lg grid justify-items-start items-center py-2 pl-5"
      >List of Banner</strong
    >
    <div class="flex px-3 border-b justify-end">
      <UButton
        class="justify-items-end ml-2"
        icon="i-heroicons-plus"
        label="Add Banner"
      />
    </div>
    <div v-if="banners.length" class="p-3 gap-3 grid grid-cols-2">
      <UCard v-for="(item, index) in banners" :key="index" class="m-3">
        <img
          style="height: 100px; width: 100px"
          :src="`https://e-commerce-pharmacy-74f9.onrender.com/images/${item.image}`"
        />
      </UCard>
    </div>
    <div v-else>
      <div class="flex flex-col items-center justify-center py-6 gap-3">
        <span v-if="loading" class="italic text-sm">{{
          "Loading data please wait..."
        }}</span>

        <span v-else class="italic text-sm">{{
          "No banners available. Please add banner..."
        }}</span>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  data() {
    return {
      banners: [],
      loading: false,
    };
  },
  async mounted() {
    this.loading = true;
    await $fetch(
      "https://e-commerce-pharmacy-74f9.onrender.com/api/banner/listOfBanner",
      {
        headers: {
          Authorization: `${this.token}`,
        },
        body: { model: "Banner" },
        method: "POST",
      }
    )
      .then((res) => {
        this.banners = res.data;
      })
      .finally(() => {
        this.loading = false;
      });
  },
};
</script>

<style></style>
