<template>
  <div>
    <!-- <div class="grid grid-cols-3"></div> -->
    <div class="grid grid-cols-1 justify-items-center items-center">
      <UNotifications />
      <UForm :schema="schema" :state="auth" class="" @submit="onSubmit">
        <UCard>
          <template #header
            ><h5 class="justify-items-center">Login</h5>
          </template>
          <UFormGroup label="Email" name="email" class="my-2">
            <UInput v-model="auth.email" />
          </UFormGroup>

          <UFormGroup label="Password" name="password" class="my-2">
            <UInput
              v-model="auth.password"
              type="password"
            />
          </UFormGroup>

          <template #footer>
            <UButton block
              :loading="loading"
              type="submit"
              class="justify-items-center"
            >
              Submit
            </UButton>
          </template>
        </UCard>
      </UForm>
    </div>
    <!-- <div class="grid grid-cols-3"></div> -->
    <error ></error>
  </div>
</template>

<script>
import Joi from "joi";
export default {
  name: "Login",
  setup() {
    return {
      schema: Joi.object({
        email: Joi.string().required(),
        password: Joi.string().min(8).required(),
      }),
    };
  },
  data() {
    return {
      loading: false,

      toast: useToast(),
      auth: {
        email: null,
        password: null,
      },
    };
  },
  methods: {
    validate(auth) {
      const errors = [];
      if (!auth.email)
        errors.push({ path: "email", message: "The email is Required" });
      if (!auth.password)
        errors.push({ path: "password", message: "The password is Required" });
      return errors;
    },
    async onSubmit(e) {
      this.loading = true;
      await $fetch(
        "https://e-commerce-pharmacy-74f9.onrender.com/api/user/login",
        {
          method: "POST",
          body: {
            email_id: this.auth.email,
            password: this.auth.password,
            role: "Admin",
          },
        }
      )
        .then(async(res) => {
          localStorage.setItem('userId', res.data.id)
          localStorage.setItem('token', res.data.token)
          this.toast.add({
            title: "Authenticated",
            description: res.message,
            icon: "i-heroicons-check-circle",
          });
          await navigateTo({ path: '/' });
        })
        .finally(() => {
          this.loading = false;
        });
    },
  },
};
</script>
