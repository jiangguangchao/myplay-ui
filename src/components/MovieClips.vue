<template>
  <el-container>
    <el-header>
      <h2>Movie Clips List</h2>
      <el-button @click="openAddModal">Add Movie Clip</el-button>
    </el-header>
    <el-main>
      <el-table :data="movieClips" style="width: 100%">
        <el-table-column prop="clip_id" label="Clip ID" width="180"></el-table-column>
        <el-table-column prop="movie_id" label="Movie ID" width="180">
          <template #default="{ row }">
            {{ row.movie_name }} ({{ row.movie_id }})
          </template>
        </el-table-column>
        <el-table-column prop="clip_name" label="Clip Name"></el-table-column>
        <el-table-column prop="create_time" label="Create Time" width="180">
          <template #default="{ row }">
            {{ formatDate(row.create_time)  }}
          </template>
        </el-table-column>
        <el-table-column label="Actions">
          <template #default="{ row }">
            <el-button size="small" @click="openEditModal(row)">Edit</el-button>
            <el-button size="small" type="danger" @click="deleteMovieClip(row.clip_id)">Delete</el-button>
          </template>
        </el-table-column>
      </el-table>
    </el-main>

    <!-- Add Movie Clip Modal -->
    <el-dialog v-model="showAddModal" title="Add Movie Clip">
      <el-form :model="newMovieClip">
        <el-form-item label="Clip ID" :label-width="formLabelWidth">
          <el-input v-model="newMovieClip.clip_id" autocomplete="off"></el-input>
        </el-form-item>
        <el-form-item label="Movie" :label-width="formLabelWidth">
          <el-select v-model="newMovieClip.movie_id" placeholder="Select a movie">
            <el-option
              v-for="movie in movies"
              :key="movie.movie_id"
              :label="movie.movie_name"
              :value="movie.movie_id"
            >
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="Clip Name" :label-width="formLabelWidth">
          <el-input v-model="newMovieClip.clip_name" autocomplete="off"></el-input>
        </el-form-item>
      </el-form>
      <template #footer>
        <span class="dialog-footer">
          <el-button @click="closeAddModal">Cancel</el-button>
          <el-button type="primary" @click="addMovieClip">Add Movie Clip</el-button>
        </span>
      </template>
    </el-dialog>

    <!-- Edit Movie Clip Modal -->
    <el-dialog v-model="showEditModal" title="Edit Movie Clip">
      <el-form :model="editMovieClip">
        <el-form-item label="Clip ID" :label-width="formLabelWidth">
          <el-input v-model="editMovieClip.clip_id" disabled></el-input>
        </el-form-item>
        <el-form-item label="Movie" :label-width="formLabelWidth">
          <el-select v-model="editMovieClip.movie_id" placeholder="Select a movie">
            <el-option
              v-for="movie in movies"
              :key="movie.movie_id"
              :label="movie.movie_name"
              :value="movie.movie_id"
            >
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="Clip Name" :label-width="formLabelWidth">
          <el-input v-model="editMovieClip.clip_name" autocomplete="off"></el-input>
        </el-form-item>
      </el-form>
      <template #footer>
        <span class="dialog-footer">
          <el-button @click="closeEditModal">Cancel</el-button>
          <el-button type="primary" @click="updateMovieClip">Update Movie Clip</el-button>
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

const movieClips = ref([]);
const movies = ref([]);
const showAddModal = ref(false);
const showEditModal = ref(false);
const newMovieClip = ref({ clip_id: '', movie_id: '', clip_name: '' });
const editMovieClip = ref({ clip_id: '', movie_id: '', clip_name: '' });
const formLabelWidth = ref('120px');

// Fetch all movie clips from the server
const fetchMovieClips = async () => {
  try {
    const response = await axiosService.request('/movieClips/listAll', {}, 'get');
    movieClips.value = response.data;
  } catch (error) {
    console.error('Error fetching movie clips:', error);
  }
};

// Fetch all movies from the server
const fetchMovies = async () => {
  try {
	console.log("获取所有movices")
    const response = await axiosService.request('/movies/listAll', {}, 'get');
    movies.value = response.data;
  } catch (error) {
    console.error('Error fetching movies:', error);
  }
};

// Add a new movie clip to the server
const addMovieClip = async () => {
  try {
    const response = await axiosService.request('/movieClips/add', newMovieClip.value, 'post');
    if (response.status === 200) {
      fetchMovieClips();
      closeAddModal();
      ElMessage.success('Movie clip added successfully.');
    }
  } catch (error) {
    console.error('Error adding movie clip:', error);
    ElMessage.error('Failed to add movie clip.');
  }
};

// Update an existing movie clip on the server
const updateMovieClip = async () => {
  try {
    const response = await axiosService.request('/movieClips/update', editMovieClip.value, 'post');
    if (response.status === 200) {
      fetchMovieClips();
      closeEditModal();
      ElMessage.success('Movie clip updated successfully.');
    }
  } catch (error) {
    console.error('Error updating movie clip:', error);
    ElMessage.error('Failed to update movie clip.');
  }
};

// Delete a movie clip from the server
const deleteMovieClip = async (clip_id) => {
  ElMessageBox.confirm('Are you sure you want to delete this movie clip?', 'Warning', {
    confirmButtonText: 'OK',
    cancelButtonText: 'Cancel',
    type: 'warning'
  }).then(async () => {
    try {
      const response = await axiosService.request(`/movieClips/delete?clip_id=${clip_id}`, {}, 'get');
      if (response.status === 200) {
        fetchMovieClips();
        ElMessage.success('Movie clip deleted successfully.');
      }
    } catch (error) {
      console.error('Error deleting movie clip:', error);
      ElMessage.error('Failed to delete movie clip.');
    }
  }).catch(() => {
    ElMessage({
      type: 'info',
      message: 'Delete operation canceled',
    });
  });
};

// Open the modal for adding a new movie clip
const openAddModal = () => {
  showAddModal.value = true;
  newMovieClip.value = { clip_id: '', movie_id: '', clip_name: '' };
};

// Close the add movie clip modal
const closeAddModal = () => {
  showAddModal.value = false;
};

// Open the modal for editing a movie clip
const openEditModal = (movieClip) => {
  showEditModal.value = true;
  editMovieClip.value = { ...movieClip };
};

// Close the edit movie clip modal
const closeEditModal = () => {
  showEditModal.value = false;
};

const formatDate = (date) => {
  return moment.utc(date).format('YYYY-MM-DD HH:mm:ss');
};

onMounted(() => {
  fetchMovieClips();
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