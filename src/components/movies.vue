<template>
  <el-container>
    <el-header>
      <h2>Movies List</h2>
      <el-button @click="openAddModal">Add Movie</el-button>
    </el-header>
    <el-main>
      <el-table :data="movies" style="width: 100%">
        <el-table-column prop="movie_id" label="Movie ID" width="180"></el-table-column>
        <el-table-column prop="movie_name" label="Movie Name"></el-table-column>
        <el-table-column prop="create_time" label="Create Time" width="180">
          <template #default="{ row }">
            {{ formatDate(row.create_time)  }}
          </template>
        </el-table-column>
        <el-table-column label="Actions">
          <template #default="{ row }">
            <el-button size="small" @click="openEditModal(row)">Edit</el-button>
            <el-button size="small" type="danger" @click="deleteMovie(row.movie_id)">Delete</el-button>
          </template>
        </el-table-column>
      </el-table>
    </el-main>

    <!-- Add Movie Modal -->
    <el-dialog v-model="showAddModal" title="Add Movie">
      <el-form :model="newMovie">
        <el-form-item label="Movie ID" :label-width="formLabelWidth">
          <el-input v-model="newMovie.movie_id" autocomplete="off"></el-input>
        </el-form-item>
        <el-form-item label="Movie Name" :label-width="formLabelWidth">
          <el-input v-model="newMovie.movie_name" autocomplete="off"></el-input>
        </el-form-item>
      </el-form>
      <template #footer>
        <span class="dialog-footer">
          <el-button @click="closeAddModal">Cancel</el-button>
          <el-button type="primary" @click="addMovie">Add Movie</el-button>
        </span>
      </template>
    </el-dialog>

    <!-- Edit Movie Modal -->
    <el-dialog v-model="showEditModal" title="Edit Movie">
      <el-form :model="editMovie">
        <el-form-item label="Movie ID" :label-width="formLabelWidth">
          <el-input v-model="editMovie.movie_id" disabled></el-input>
        </el-form-item>
        <el-form-item label="Movie Name" :label-width="formLabelWidth">
          <el-input v-model="editMovie.movie_name" autocomplete="off"></el-input>
        </el-form-item>
      </el-form>
      <template #footer>
        <span class="dialog-footer">
          <el-button @click="closeEditModal">Cancel</el-button>
          <el-button type="primary" @click="updateMovie">Update Movie</el-button>
        </span>
      </template>
    </el-dialog>
  </el-container>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import { ElMessage, ElMessageBox } from 'element-plus';
import axiosService from '@/axiosService';
import moment from 'moment'; // 导入 moment.js 用于日期格式化

const movies = ref([]);
const showAddModal = ref(false);
const showEditModal = ref(false);
const newMovie = ref({ movie_id: '', movie_name: '' });
const editMovie = ref({ movie_id: '', movie_name: '' });
const formLabelWidth = ref('120px');

// Add a new movie to the server
const addMovie = async () => {
  try {
    const response = await axiosService.request('/movies/add', newMovie.value, 'post');
    if (response.status === 200) {
      fetchMovies();
      closeAddModal();
      ElMessage.success('Movie added successfully.');
    }
  } catch (error) {
    console.error('Error adding movie:', error);
    ElMessage.error('Failed to add movie.');
  }
};

// Update an existing movie on the server
const updateMovie = async () => {
  try {
    const response = await axiosService.request('/movies/update', editMovie.value, 'post');
    if (response.status === 200) {
      fetchMovies();
      closeEditModal();
      ElMessage.success('Movie updated successfully.');
    }
  } catch (error) {
    console.error('Error updating movie:', error);
    ElMessage.error('Failed to update movie.');
  }
};

// Fetch all movies from the server
const fetchMovies = async () => {
  try {
    const response = await axiosService.request('/movies/listAll', {}, 'get');
    movies.value = response.data;
  } catch (error) {
    console.error('Error fetching movies:', error);
  }
};

// Delete a movie from the server
const deleteMovie = async (movie_id) => {
  ElMessageBox.confirm('Are you sure you want to delete this movie?', 'Warning', {
    confirmButtonText: 'OK',
    cancelButtonText: 'Cancel',
    type: 'warning'
  }).then(async () => {
    try {
      const response = await axiosService.request(`/movies/delete?movie_id=${movie_id}`, {}, 'get');
      if (response.status === 200) {
        fetchMovies();
        ElMessage.success('Movie deleted successfully.');
      }
    } catch (error) {
      console.error('Error deleting movie:', error);
      ElMessage.error('Failed to delete movie.');
    }
  }).catch(() => {
    ElMessage({
      type: 'info',
      message: 'Delete operation canceled',
    });
  });
};

// Open the modal for adding a new movie
const openAddModal = () => {
  showAddModal.value = true;
  newMovie.value = { movie_id: '', movie_name: '' };
};

// Close the add movie modal
const closeAddModal = () => {
  showAddModal.value = false;
};

// Open the modal for editing a movie
const openEditModal = (movie) => {
  showEditModal.value = true;
  editMovie.value = { ...movie };
};

// Close the edit movie modal
const closeEditModal = () => {
  showEditModal.value = false;
};

const formatDate = (date) => {
  return moment.utc(date).format('YYYY-MM-DD HH:mm:ss');
};

onMounted(() => {
  fetchMovies();
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