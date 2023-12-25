<template>
  <div>
    <UModal v-model="isOpen" fullscreen>
      <UCard
        :ui="{
          base: 'h-full flex flex-col',
          rounded: '',
          divide: 'divide-y divide-gray-100 dark:divide-gray-800',
          body: {
            base: 'grow',
          },
        }"
      >
        <UButton
          block
          :loading="true"
          class="justify-items-center"
        >
        </UButton>
      </UCard>
    </UModal>
  </div>
</template>

<script>
export default {
    props: {
        loading: Boolean,
        default: false
    }
};
</script>

<style></style>
