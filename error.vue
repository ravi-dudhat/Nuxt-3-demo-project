<template>
  <div class="error-page">
    <h1>Oops, something went wrong!</h1>
    <p>{{ error.message }}</p>
    <UButton
      @click="navigateTo({ path: '/' })"
      type="submit"
      class="justify-items-center"
    >
      Go To Home
    </UButton>
  </div>
</template>

<script>
export default {
  props: {
    //   error: Object
  },
  data() {
    return {
      error: {
        message: "Click 'Go To Home' button to Navigate to Home Page",
      },
    };
  },
};
</script>

<style scoped>
.error-page {
  text-align: center;
  margin: 50px auto;
}
</style>
