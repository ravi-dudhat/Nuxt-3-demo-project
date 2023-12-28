<template>
  <div>
    <strong class="text-lg grid justify-items-center items-center py-2"
      >Products</strong
    >
    <UDivider />
    <strong class="text-lg grid justify-items-start items-center py-2 pl-5"
      >List of Product</strong
    >
    <div class="grid grid-cols-4 justify-items-center items-center p-3"></div>
    <div class="flex px-3 py-3.5 border-b">
      <UInput
        class="justify-items-end"
        v-model="search"
        placeholder="Filter people..."
      />
      <UButton
        class="justify-items-end ml-2"
        icon="i-heroicons-plus"
        label="Add Product"
        @click="addEditProduct()"
      />
    </div>
    <UTable
      class="bg-white mx-4 mb-1"
      :columns="columns"
      :modelValue="filteredRows"
      :rows="filteredRows"
      :loading="loading"
      :loading-state="{
        icon: 'i-heroicons-arrow-path-20-solid',
        label: 'Loading data please wait...',
      }"
      :empty-state="{
        icon: 'i-heroicons-circle-stack-20-solid',
        label: 'No products available. Please add product...',
      }"
    >
      <template #empty-state>
        <div class="flex flex-col items-center justify-center py-6 gap-3">
          <span class="italic text-sm"
            >No products available. Please add product...</span
          >
          <UButton
            class="justify-items-end ml-2"
            icon="i-heroicons-plus"
            label="Add Product"
            @click="addEditProduct()"
          />
        </div>
      </template>
      <template #name-data="{ row }">
        <span class="'text-primary-500 dark:text-primary-400',">{{
          row.name
        }}</span>
      </template>
      <template #actions-data="{}">
        <UButton
          variant="ghost"
          icon="i-heroicons-pencil-square-16-solid"
          @click="addEditProduct()"
        />
        <UButton
          color="red"
          variant="ghost"
          icon="i-heroicons-trash-16-solid"
        />
      </template>
    </UTable>
    <UDivider />

    <UModal v-model="isOpen" prevent-close class="min-w-full">
      <UCard
        class="min-w-full overflow-y-auto"
        :ui="{
          ring: '',
          divide: 'divide-y divide-gray-100 dark:divide-gray-800',
        }"
      >
        <template #header>
          <div class="flex items-center justify-between">
            <h3
              class="text-base font-semibold leading-6 text-gray-900 dark:text-white"
            >
              Add Product
            </h3>
            <UButton
              color="gray"
              variant="ghost"
              icon="i-heroicons-x-mark-20-solid"
              class="-my-1"
              @click="isOpen = false"
            />
          </div>
        </template>

        <UForm
          :state="productDetails"
          @submit="saveProduct"
          class="grid grid-cols-3 gap-x-3"
        >
          <UFormGroup label="Product name" required class="my-2">
            <UInput v-model="productDetails.name" />
          </UFormGroup>

          <UFormGroup
            label="Product description"
            name="description"
            class="my-2"
            required
          >
            <UInput v-model="productDetails.description" />
          </UFormGroup>
          <UFormGroup label="Category" name="name" class="my-2" required>
            <USelectMenu
              v-model="categoryDetails"
              :options="categoryList"
              placeholder="Select category"
            >
              <template #label>
                <span v-if="categoryDetails" class="truncate">{{
                  categoryDetails.name
                }}</span>
              </template>
              <template #option="{ option: categoryDetails }">
                <span
                  class="'inline-block h-2 w-2 flex-shrink-0 rounded-full',"
                  aria-hidden="true"
                />
                <span class="truncate">{{ categoryDetails.name }}</span>
              </template>
            </USelectMenu>
          </UFormGroup>
          <UFormGroup label="Price" required class="my-2">
            <UInput v-model="productDetails.price" />
          </UFormGroup>
          <UFormGroup label="Quantity" required class="my-2">
            <UInput v-model="productDetails.quantity" />
          </UFormGroup>
          <UFormGroup label="Meta title" required class="my-2">
            <UInput v-model="productDetails.metaTitle" />
          </UFormGroup>
          <UFormGroup label="Meta description" class="my-2">
            <UInput v-model="productDetails.metaDescription" />
          </UFormGroup>
          <UFormGroup label="Meta keyword" class="my-2">
            <UInput v-model="productDetails.metaKeyword" />
          </UFormGroup>
          <UFormGroup label="Composition" required class="my-2">
            <UInput v-model="productDetails.composition" />
          </UFormGroup>
          <UFormGroup label="Presentation" required class="my-2">
            <UInput v-model="productDetails.presentation" />
          </UFormGroup>
          <UFormGroup label="Storage" required class="my-2">
            <UInput v-model="productDetails.storage" />
          </UFormGroup>
          <UFormGroup label="Indication" required class="my-2">
            <UInput v-model="productDetails.indication" />
          </UFormGroup>
          <UFormGroup label="Dose" required class="my-2">
            <UInput v-model="productDetails.dose" />
          </UFormGroup>
          <UFormGroup label="Shelf life" required class="my-2">
            <UInput v-model="productDetails.shelfLife" />
          </UFormGroup>
          <UFormGroup label="Image" class="my-2">
            <UInput
              v-model="productDetails.image"
              type="file"
              @change="onChangeImage($event)"
            />

            <UButton
              :loading="loading"
              type="submit"
              class="justify-items-center"
              label="Upload"
              @click="uploadImage($event)"
            >
            </UButton>
          </UFormGroup>
          <UFormGroup class="my-2">
            <URadioGroup
              v-model="productDetails.prescriptionRequired"
              legend="Does Prescription required for product?"
              :options="prescriptionOptions"
              required
            />
          </UFormGroup>
        </UForm>

        <template #footer>
          <UButton
            :loading="loading"
            type="submit"
            class="justify-items-center"
            label="Add Product"
          >
          </UButton>
        </template>
      </UCard>
    </UModal>
  </div>
</template>

<script>
import Joi from "joi";
export default {
  setup() {
    return {
      schema: Joi.object({
        name: Joi.string().required(),
        description: Joi.string().required(),
      }),
    };
  },
  data() {
    return {
      imageData: null,
      token: null,
      prescriptionOptions: [
        {
          value: 1,
          label: "Yes",
        },
        {
          value: 0,
          label: "No",
        },
      ],
      categoryDetails: null,
      isOpen: false,
      search: null,
      categoryList: [],
      products: [],
      loading: false,
      page: 1,
      pageCount: 5,
      productCount: 0,
      actions: [
        {
          label: "Completed",
          icon: "i-heroicons-check",
        },
      ],
      productDetails: {
        name: null,
        description: null,
        category: null,
        price: null,
        qurntity: null,
        metaTitle: null,
        metaDescription: null,
        metaKeyword: null,
        prescriptionRequired: null,
        composition: null,
        presentation: null,
        storage: null,
        indication: null,
        dose: null,
        shelfLife: null,
        image: null,
      },
    };
  },
  computed: {
    columns() {
      return [
        {
          key: "product_id",
          label: "ID",
        },
        {
          key: "name",
          label: "Product name",
        },
        {
          key: "quantity",
          label: "Quantity",
        },
        {
          key: "price",
          label: "Price",
        },
        {
          key: "actions",
          label: "Actions",
        },
      ];
    },
    filteredRows() {
      if (!this.search) {
        return this.products;
      }

      let data = this.products.filter((item) => {
        return Object.values(item.name).some((value) => {
          return String(value)
            .toLowerCase()
            .includes(this.search.toLowerCase());
        });
      });
      return data;
    },
  },
  async mounted() {
    this.loading = true;
    this.token = localStorage.getItem("token");
    await $fetch(
      "https://e-commerce-pharmacy-74f9.onrender.com/api/product/listOfProducts",
      {
        headers: { Authorization: `${this.token}` },
        method: "POST",
        body: {
          pageNumber: 1,
          pageSize: 8,
          sort: { product_id: "DESC" },
        },
      }
    )
      .then((res) => {
        this.products = res.data.item;
        this.productCount = res.data.count;
      })
      .finally(() => {
        this.loading = false;
      });

    await $fetch(
      "https://e-commerce-pharmacy-74f9.onrender.com/api/category/listOfCategory",
      {
        headers: { Authorization: `${this.token}` },
        method: "POST",
        body: {
          model: "Category",
          condition: { is_archived: false },
        },
      }
    )
      .then((res) => {
        this.categoryList = res.data;
        console.log("categoryList:-", this.categoryList);
      })
      .finally(() => {
        this.loading = false;
      });
  },
  methods: {
    addEditProduct() {
      this.isOpen = true;
    },
    onChangeImage(e) {
      this.imageData = e.target.files;
      console.log("Change Imgae:-", this.productDetails.image);
    },
    async uploadImage(e) {
      let formData = new FormData();
      formData.append("image", this.imageData[0]);
      console.log("Imgae:-", this.imageData[0], formData);

      await $fetch(
        "https://e-commerce-pharmacy-74f9.onrender.com/api/vendor/productImage",
        {
          headers: {
            Authorization: `${this.token}`,
          },
          body: formData,
          method: "POST",
        }
      )
        .then((res) => {
          this.productDetails.image = res.data;
          console.log("Image:-", this.productDetails);
        })
        .finally(() => {
          this.loading = false;
        });
    },
    async saveProduct() {
      // await $fetch(
      //   "https://e-commerce-pharmacy-74f9.onrender.com/api/product/addProduct",
      //   {
      //     headers: { Authorization: `${this.token}` },
      //     method: "POST",
      //     body: {
      //       category_id: productDetails.category,
      //       composition: productDetails.composition,
      //       description: productDetails.description,
      //       dose: productDetails.dose,
      //       image: productDetails.image,
      //       indication: productDetails.indication,
      //       is_prescription: productDetails.prescriptionRequired,
      //       metaTagTitle: productDetails.metaTagTitle,
      //       name: productDetails.name,
      //       presentation: productDetails.presentation,
      //       price: productDetails.price,
      //       quantity: productDetails.quantity,
      //       referral_code: productDetails.referral_code,
      //       selectedImage: productDetails.image,
      //       shelf_life: productDetails.shelfLife,
      //       storage: productDetails.storage,
      //       vendor_id: productDetails.vendor_id,
      //     },
      //   }
      // )
      //   .then((res) => {
      //     this.toast.add({
      //       title: "Product",
      //       description: res.message,
      //       icon: "i-heroicons-check-circle",
      //     });
      //   })
      //   .finally(() => {
      //     this.loading = false;
      //   });
    },
  },
};
</script>

<style></style>
