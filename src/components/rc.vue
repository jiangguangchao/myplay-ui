<template>
  <el-container>
    <el-header>
      <h2>RCs List</h2>
      <el-button @click="openAddModal">Add RC</el-button>
    </el-header>
    <el-main>
      <el-table :data="rcs" style="width: 100%">
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
            <el-button size="small" type="danger" @click="deleteRc(row.id)">Delete</el-button>
          </template>
        </el-table-column>
      </el-table>
    </el-main>

    <!-- Add RC Modal -->
    <el-dialog v-model="showAddModal" title="Add RC">
      <el-form :model="newRc">
        <el-form-item label="ID" :label-width="formLabelWidth">
          <el-input v-model="newRc.id" autocomplete="off"></el-input>
        </el-form-item>
        <el-form-item label="Name" :label-width="formLabelWidth">
          <el-input v-model="newRc.name" autocomplete="off"></el-input>
        </el-form-item>
        <el-form-item label="MCU" :label-width="formLabelWidth">
          <el-input v-model="newRc.mcu" autocomplete="off"></el-input>
        </el-form-item>
      </el-form>
      <template #footer>
        <span class="dialog-footer">
          <el-button @click="closeAddModal">Cancel</el-button>
          <el-button type="primary" @click="addRc">Add RC</el-button>
        </span>
      </template>
    </el-dialog>

    <!-- Edit RC Modal -->
    <el-dialog v-model="showEditModal" title="Edit RC">
      <el-form :model="editRc">
        <el-form-item label="ID" :label-width="formLabelWidth">
          <el-input v-model="editRc.id" disabled></el-input>
        </el-form-item>
        <el-form-item label="Name" :label-width="formLabelWidth">
          <el-input v-model="editRc.name" autocomplete="off"></el-input>
        </el-form-item>
        <el-form-item label="MCU" :label-width="formLabelWidth">
          <el-input v-model="editRc.mcu" autocomplete="off"></el-input>
        </el-form-item>
      </el-form>
      <template #footer>
        <span class="dialog-footer">
          <el-button @click="closeEditModal">Cancel</el-button>
          <el-button type="primary" @click="updateRc">Update RC</el-button>
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

const rcs = ref([]);
const showAddModal = ref(false);
const showEditModal = ref(false);
const newRc = ref({ id: '', name: '', mcu: '' });
const editRc = ref({ id: '', name: '', mcu: '' });
const formLabelWidth = ref('120px');

// Fetch all RCs from the server
const fetchRcs = async () => {
  try {
    const response = await axiosService.request('/rc/listAll', {}, 'get');
    rcs.value = response.data;
  } catch (error) {
    console.error('Error fetching RCs:', error);
  }
};

// Add a new RC to the server
const addRc = async () => {
  try {
    const response = await axiosService.request('/rc/add', newRc.value, 'post');
    if (response.status === 200) {
      fetchRcs();
      closeAddModal();
      ElMessage.success('RC added successfully.');
    }
  } catch (error) {
    console.error('Error adding RC:', error);
    ElMessage.error('Failed to add RC.');
  }
};

// Update an existing RC on the server
const updateRc = async () => {
  try {
    const response = await axiosService.request('/rc/update', editRc.value, 'post');
    if (response.status === 200) {
      fetchRcs();
      closeEditModal();
      ElMessage.success('RC updated successfully.');
    }
  } catch (error) {
    console.error('Error updating RC:', error);
    ElMessage.error('Failed to update RC.');
  }
};

// Delete an RC from the server
const deleteRc = async (id) => {
  ElMessageBox.confirm('Are you sure you want to delete this RC?', 'Warning', {
    confirmButtonText: 'OK',
    cancelButtonText: 'Cancel',
    type: 'warning'
  }).then(async () => {
    try {
      const response = await axiosService.request(`/rc/delete?id=${id}`, {}, 'get');
      if (response.status === 200) {
        fetchRcs();
        ElMessage.success('RC deleted successfully.');
      }
    } catch (error) {
      console.error('Error deleting RC:', error);
      ElMessage.error('Failed to delete RC.');
    }
  }).catch(() => {
    ElMessage({
      type: 'info',
      message: 'Delete operation canceled',
    });
  });
};

// Open the modal for adding a new RC
const openAddModal = () => {
  showAddModal.value = true;
  newRc.value = { id: '', name: '', mcu: '' };
};

// Close the add RC modal
const closeAddModal = () => {
  showAddModal.value = false;
};

// Open the modal for editing an RC
const openEditModal = (rc) => {
  showEditModal.value = true;
  editRc.value = { ...rc };
};

// Close the edit RC modal
const closeEditModal = () => {
  showEditModal.value = false;
};

// Date format filter
const formatDate = (date) => {
  return moment.utc(date).format('YYYY-MM-DD HH:mm:ss');
};

onMounted(() => {
  fetchRcs();
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