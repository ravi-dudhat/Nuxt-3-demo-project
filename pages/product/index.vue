<template>
  <div>
    <strong class="text-lg grid justify-items-center items-center py-2"
      >Products</strong
    ><UNotifications />
    <UDivider />
    <strong class="text-lg grid justify-items-start items-center py-2 pl-5"
      >List of Product</strong
    >
    <div class="grid grid-cols-4 justify-items-center items-center p-3"></div>
    <div class="flex px-3 py-3.5 border-b justify-end">
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
      :loading="loadingProducts"
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
      <template #actions-data="{ row }">
        <UButton
          variant="ghost"
          icon="i-heroicons-pencil-square-16-solid"
          @click="addEditProduct(row)"
        />
        <UButton
          color="red"
          variant="ghost"
          icon="i-heroicons-trash-16-solid"
          @click="onClickDelete(row)"
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
              {{ productDetails.id ? "Edit product" : "Add product" }}
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
          :validate="validate"
          :state="productDetails"
          class="grid grid-cols-2 gap-x-3"
        >
          <UFormGroup label="Product name" name="name" required class="my-2">
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
          <UFormGroup label="Category" name="category" class="my-2" required>
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
          <UFormGroup label="Price" name="price" required class="my-2">
            <UInput v-model="productDetails.price" type="number" />
          </UFormGroup>
          <UFormGroup label="Quantity" name="quantity" required class="my-2">
            <UInput v-model="productDetails.quantity" type="number" />
          </UFormGroup>
          <UFormGroup label="Meta title" name="metaTitle" required class="my-2">
            <UInput v-model="productDetails.metaTagTitle" />
          </UFormGroup>
          <UFormGroup label="Meta description" name="metaDes" class="my-2">
            <UInput v-model="productDetails.metaDescription" />
          </UFormGroup>
          <UFormGroup label="Meta keyword" name="metaKey" class="my-2">
            <UInput v-model="productDetails.metaKeyword" />
          </UFormGroup>
          <UFormGroup
            label="Composition"
            name="composition"
            required
            class="my-2"
          >
            <UInput v-model="productDetails.composition" />
          </UFormGroup>
          <UFormGroup
            label="Presentation"
            name="presentation"
            required
            class="my-2"
          >
            <UInput v-model="productDetails.presentation" />
          </UFormGroup>
          <UFormGroup label="Storage" name="storage" required class="my-2">
            <UInput v-model="productDetails.storage" />
          </UFormGroup>
          <UFormGroup
            label="Indication"
            name="indication"
            required
            class="my-2"
          >
            <UInput v-model="productDetails.indication" />
          </UFormGroup>
          <UFormGroup label="Dose" name="dose" required class="my-2">
            <UInput v-model="productDetails.dose" />
          </UFormGroup>
          <UFormGroup label="Shelf life" name="shelfLife" required class="my-2">
            <UInput v-model="productDetails.shelfLife" />
          </UFormGroup>
          <UFormGroup class="my-2" name="prescription">
            <URadioGroup
              v-model="productDetails.prescriptionRequired"
              legend="Does Prescription required for product?"
              :options="prescriptionOptions"
            />
          </UFormGroup>
          <UFormGroup label="Product image" name="image" class="my-2">
            <UInput accept="image/*"
              :value="image"
              type="file"
              @change="onChangeImage($event)"
            />
            <UButton
              v-show="this.imageData"
              :loading="imgUploading"
              class="justify-items-center"
              label="Upload"
              @click="uploadImage($event)"
            >
            </UButton>
          </UFormGroup>
          <img
            style="height: 100px; width: 100px"
            v-if="productDetails.image"
            :src="`https://e-commerce-pharmacy-74f9.onrender.com/images/${productDetails.image}`"
          />
        </UForm>
        <template #footer>
          <UButton
            :disabled="
              Boolean(validate().length)
            "
            :loading="loading"
            class="justify-items-center"
            :label="productDetails.id ? 'Edit product' : 'Add product'"
            @click="saveProduct"
          >
          </UButton>
        </template>
      </UCard>
    </UModal>
    <UModal v-model="isDelete" prevent-close>
      <UCard
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
              Delete product
            </h3>
            <UButton
              color="gray"
              variant="ghost"
              icon="i-heroicons-x-mark-20-solid"
              class=""
              @click="isDelete = false"
            />
          </div>
        </template>

        <span
          >Are you sure you want to Delete
          <strong>{{ deleteProductDetails.name }}</strong> Product?</span
        >
        <template #footer>
          <UButton
            class="justify-items-center mr-2"
            label="Cancel"
            @click="isDelete = false"
          >
          </UButton>
          <UButton
            class="justify-items-center"
            label="Okay"
            @click="deleteProduct(deleteProductDetails)"
          >
          </UButton
        ></template>
      </UCard>
    </UModal>
  </div>
</template>

<script>
export default {
  data() {
    return {
      loadingProducts: false,
      deleteProductDetails: null,
      isDelete: false,
      toast: useToast(),
      image: null,
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
      imgUploading: false,
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
        quantity: null,
        metaTagTitle: null,
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
        referral_code: "",
      },
    };
  },
  watch: {
    isOpen(val) {
      if (!val) {
        this.productDetails = {
          name: null,
          description: null,
          category: null,
          price: null,
          quantity: null,
          metaTagTitle: null,
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
          referral_code: "",
        };
      }
    },
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
    this.token = sessionStorage.getItem("token");

    this.getProductList();
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
      })
      .finally(() => {
        this.loading = false;
      });
  },
  methods: {
    async getProductList() {
      this.loadingProducts = true;
      await $fetch(
        "https://e-commerce-pharmacy-74f9.onrender.com/api/product/listOfProducts",
        {
          headers: { Authorization: `${this.token}` },
          method: "POST",
          body: {
            pageNumber: 1,
            pageSize: 30,
            sort: { product_id: "DESC" },
          },
        }
      )
        .then((res) => {
          this.products = res.data.item;
          this.productCount = res.data.count;
        })
        .finally(() => {
          this.loadingProducts = false;
        });
    },
    validate() {
      const errors = [];
      if (!this.productDetails.name)
        errors.push({ path: "name", message: "Product name is Required" });
      if (!this.productDetails.description)
        errors.push({
          path: "description",
          message: "Product description is Required",
        });
      if (!this.categoryDetails)
        errors.push({
          path: "category",
          message: "Product category is Required",
        });
      if (!this.productDetails.price)
        errors.push({ path: "price", message: "Product price is Required" });
      if (!this.productDetails.quantity)
        errors.push({
          path: "quantity",
          message: "Product quantity is Required",
        });
      if (!this.productDetails.metaTagTitle)
        errors.push({ path: "metaTitle", message: "Meta title is Required" });
      // if (!this.productDetails.metaDescription)
      //   errors.push({
      //     path: "metaDes",
      //     message: "Meta Description is Required",
      //   });
      // if (!this.productDetails.metaKeyword)
      //   errors.push({ path: "metaKey", message: "Meta keyword is Required" });
      if (!this.productDetails.composition)
        errors.push({
          path: "composition",
          message: "Composition is Required",
        });
      if (!this.productDetails.presentation)
        errors.push({
          path: "presentation",
          message: "Presentation is Required",
        });
      if (!this.productDetails.storage)
        errors.push({ path: "storage", message: "Storage is Required" });
      if (!this.productDetails.indication)
        errors.push({ path: "indication", message: "Indication is Required" });
      if (!this.productDetails.dose)
        errors.push({ path: "dose", message: "Dose is Required" });
      if (!this.productDetails.shelfLife)
        errors.push({ path: "shelfLife", message: "Shelf life is Required" });
      // if (!this.productDetails.prescriptionRequired) errors.push({ path: "prescription", message: "Prescription is Required" });
      return errors;
    },
    addEditProduct(item) {
      this.isOpen = true;
      if (item) {
        let category = this.categoryList.filter(
          (i) => i.id == item.category_id
        );
        this.productDetails.id = item.product_id;
        this.categoryDetails = category[0];
        this.productDetails.composition = item.composition;
        this.productDetails.description = item.description;
        this.productDetails.dose = item.dose;
        this.productDetails.image = item.image;
        this.productDetails.indication = item.indication;
        this.productDetails.prescriptionRequired = item.is_prescription;
        this.productDetails.metaTagTitle = item.metaTagTitle;
        this.productDetails.name = item.name;
        this.productDetails.presentation = item.presentation;
        this.productDetails.price = item.price;
        this.productDetails.quantity = item.quantity;
        this.productDetails.referral_code = item.referral_code;
        this.productDetails.shelfLife = item.shelf_life;
        this.productDetails.storage = item.storage;
        this.productDetails.metaDescription = item.metaTagDescription;
        this.productDetails.metaKeyword = item.metaTagKeywords;
      }
    },
    onChangeImage(e) {
      this.imageData = e.target.files;
    },
    async uploadImage(e) {
      this.imgUploading = true;
      let formData = new FormData();
      formData.append("image", this.imageData[0]);

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
        })
        .finally(() => {
          this.imgUploading = false;
        });
    },
    async saveProduct() {
      this.loading = true;
      let payload = {
        category_id: this.categoryDetails.id,
        composition: this.productDetails.composition,
        description: this.productDetails.description,
        dose: this.productDetails.dose,
        image: Array.isArray(this.productDetails.image)
          ? this.productDetails.image
          : [this.productDetails.image],
        indication: this.productDetails.indication,
        is_prescription: Boolean(this.productDetails.prescriptionRequired),
        metaTagTitle: this.productDetails.metaTagTitle,
        name: this.productDetails.name,
        presentation: this.productDetails.presentation,
        price: this.productDetails.price,
        quantity: this.productDetails.quantity,
        referral_code: this.productDetails.referral_code,
        selectedImage: this.productDetails.image[0],
        shelf_life: this.productDetails.shelfLife,
        storage: this.productDetails.storage,
        vendor_id: 1,
        metaTagDescription: this.productDetails.metaDescription,
        metaTagKeywords: this.productDetails.metaKeyword,
      };
      if (this.productDetails.id) {
        await $fetch(
          `https://e-commerce-pharmacy-74f9.onrender.com/api/product/editProduct/${this.productDetails.id}`,
          {
            headers: { Authorization: `${this.token}` },
            method: "PUT",
            body: payload,
          }
        )
          .then((res) => {
            this.isOpen = false;
            this.toast.add({
              title: "Product",
              description: res.message,
              icon: "i-heroicons-check-circle",
            });
          })
          .finally(() => {
            this.loading = false;
          });
      } else {
        await $fetch(
          "https://e-commerce-pharmacy-74f9.onrender.com/api/product/addProduct",
          {
            headers: { Authorization: `${this.token}` },
            method: "POST",
            body: payload,
          }
        )
          .then((res) => {
            this.isOpen = false;
            this.toast.add({
              title: "Product",
              description: res.message,
              icon: "i-heroicons-check-circle",
            });
          })
          .finally(() => {
            this.loading = false;
          });
      }
      this.getProductList();
    },
    onClickDelete(data) {
      this.isDelete = true;
      this.deleteProductDetails = data;
    },
    async deleteProduct(item) {
      if (item.product_id) {
        await $fetch(
          `https://e-commerce-pharmacy-74f9.onrender.com/api/product/deleteProduct/${item.product_id}`,
          {
            headers: { Authorization: `${this.token}` },
            method: "PUT",
            body: { is_archived: true },
          }
        )
          .then((res) => {
            this.isDelete = false;
            this.toast.add({
              title: "Product",
              description: res.message,
              icon: "i-heroicons-check-circle",
            });
          })
          .finally(() => {
            this.loading = false;
          });
      }
      this.getProductList();
    },
  },
};
</script>

<style></style>
