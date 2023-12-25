<template>
  <div>
    <div class="grid grid-cols-4 justify-items-center items-center p-3">
      <!-- <UCard
        class="grid grid-cols-1 mx-2 my-2"
        v-for="(item, key, index) in cards"
        :key="index"
      >
        <div class="grid grid-cols-12">{{ key }}</div>
        <div class="grid grid-cols-12">{{ cards[key] }}</div>
      </UCard> -->
      <Loader :loading="loading"/>
    </div>
  </div>
</template>

<script>
export default {
  name: "Dashboard",
  data() {
    return {
      loading: false,
      cards: null,
    };
  },
  async mounted() {
    this.loading = true;
    let token = localStorage.getItem("token");
    await $fetch(
      "https://e-commerce-pharmacy-74f9.onrender.com/api/admin/dashBoard/countOfData",
      {
        headers: { Authorization: `${token}` },
        method: "GET",
      }
    )
      .then((res) => {
        this.cards = res.data;
      })
      .finally(() => {
        this.loading = false;
      });
  },
};
</script>

<style></style>
