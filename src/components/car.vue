<template>
  <el-container>
    <el-header>
      <h2>Cars List</h2>
      <el-button @click="openAddModal">Add Car</el-button>
    </el-header>
    <el-main>
      <el-table :data="cars" style="width: 100%">
        <el-table-column prop="id" label="ID" width="180"></el-table-column>
        <el-table-column prop="name" label="Name" width="180"></el-table-column>
        <el-table-column prop="mcu" label="MCU" width="180"></el-table-column>
        <el-table-column prop="create_time" label="Create Time" width="180">
          <template #default="{ row }">
            {{ formatDate(row.create_time)  }}
          </template>
        </el-table-column>
        <el-table-column label="Actions">
          <template #default="{ row }">
            <el-button size="small" @click="openEditModal(row)">Edit</el-button>
            <el-button size="small" type="danger" @click="deleteCar(row.id)">Delete</el-button>
          </template>
        </el-table-column>
      </el-table>
    </el-main>

    <!-- Add Car Modal -->
    <el-dialog v-model="showAddModal" title="Add Car">
      <el-form :model="newCar">
        <el-form-item label="ID" :label-width="formLabelWidth">
          <el-input v-model="newCar.id" autocomplete="off"></el-input>
        </el-form-item>
        <el-form-item label="Name" :label-width="formLabelWidth">
          <el-input v-model="newCar.name" autocomplete="off"></el-input>
        </el-form-item>
        <el-form-item label="MCU" :label-width="formLabelWidth">
          <el-input v-model="newCar.mcu" autocomplete="off"></el-input>
        </el-form-item>
      </el-form>
      <template #footer>
        <span class="dialog-footer">
          <el-button @click="closeAddModal">Cancel</el-button>
          <el-button type="primary" @click="addCar">Add Car</el-button>
        </span>
      </template>
    </el-dialog>

    <!-- Edit Car Modal -->
    <el-dialog v-model="showEditModal" title="Edit Car">
      <el-form :model="editCar">
        <el-form-item label="ID" :label-width="formLabelWidth">
          <el-input v-model="editCar.id" disabled></el-input>
        </el-form-item>
        <el-form-item label="Name" :label-width="formLabelWidth">
          <el-input v-model="editCar.name" autocomplete="off"></el-input>
        </el-form-item>
        <el-form-item label="MCU" :label-width="formLabelWidth">
          <el-input v-model="editCar.mcu" autocomplete="off"></el-input>
        </el-form-item>
      </el-form>
      <template #footer>
        <span class="dialog-footer">
          <el-button @click="closeEditModal">Cancel</el-button>
          <el-button type="primary" @click="updateCar">Update Car</el-button>
        </span>
      </template>
    </el-dialog>
  </el-container>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import { ElMessage, ElMessageBox } from 'element-plus';
import axiosService from '@/axiosService'; // 导入您的 axiosService
import moment from 'moment'; // 导入 moment.js 用于日期格式化

const cars = ref([]);
const showAddModal = ref(false);
const showEditModal = ref(false);
const newCar = ref({ id: '', name: '', mcu: '' });
const editCar = ref({ id: '', name: '', mcu: '' });
const formLabelWidth = ref('120px');

// Fetch all cars from the server
const fetchCars = async () => {
  try {
    const response = await axiosService.request('/car/listAll', {}, 'get');
    cars.value = response.data;
  } catch (error) {
    console.error('Error fetching cars:', error);
  }
};

// Add a new car to the server
const addCar = async () => {
  try {
    const response = await axiosService.request('/car/add', newCar.value, 'post');
    if (response.status === 200) {
      fetchCars();
      closeAddModal();
      ElMessage.success('Car added successfully.');
    }
  } catch (error) {
    console.error('Error adding car:', error);
    ElMessage.error('Failed to add car.');
  }
};

// Update an existing car on the server
const updateCar = async () => {
  try {
    const response = await axiosService.request('/car/update', editCar.value, 'post');
    if (response.status === 200) {
      fetchCars();
      closeEditModal();
      ElMessage.success('Car updated successfully.');
    }
  } catch (error) {
    console.error('Error updating car:', error);
    ElMessage.error('Failed to update car.');
  }
};

// Delete a car from the server
const deleteCar = async (id) => {
  ElMessageBox.confirm('Are you sure you want to delete this car?', 'Warning', {
    confirmButtonText: 'OK',
    cancelButtonText: 'Cancel',
    type: 'warning'
  }).then(async () => {
    try {
      const response = await axiosService.request(`/car/delete?id=${id}`, {}, 'get');
      if (response.status === 200) {
        fetchCars();
        ElMessage.success('Car deleted successfully.');
      }
    } catch (error) {
      console.error('Error deleting car:', error);
      ElMessage.error('Failed to delete car.');
    }
  }).catch(() => {
    ElMessage({
      type: 'info',
      message: 'Delete operation canceled',
    });
  });
};

// Open the modal for adding a new car
const openAddModal = () => {
  showAddModal.value = true;
  newCar.value = { id: '', name: '', mcu: '' };
};

// Close the add car modal
const closeAddModal = () => {
  showAddModal.value = false;
};

// Open the modal for editing a car
const openEditModal = (car) => {
  showEditModal.value = true;
  editCar.value = { ...car };
};

// Close the edit car modal
const closeEditModal = () => {
  showEditModal.value = false;
};

// Date format filter
const formatDate = (date) => {
  return moment.utc(date).format('YYYY-MM-DD HH:mm:ss');
};

onMounted(() => {
  fetchCars();
});
</script>

<style scoped>
/* Add your custom styles here */
.el-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
}
</style>