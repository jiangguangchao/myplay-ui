<template>  
  <el-container style="height: 100vh;">  
    <el-aside width="200px" style="background-color: rgb(238, 241, 246)">  
      <el-menu 
        :default-openeds="['1']"
        class="el-menu-vertical-demo"
        @open="handleOpen"
        @close="handleClose"
        background-color="#545c64"
        text-color="#bfcbd9"
        active-text-color="#409EFF"
      >
        
        <router-link to="/">
          <el-menu-item index="/">首页</el-menu-item>
        </router-link>
        <router-link to="/car">
          <el-menu-item index="/car">car</el-menu-item>
        </router-link>
        <router-link to="/rc">
          <el-menu-item index="/rc">rc</el-menu-item>
        </router-link>
        <router-link to="/movies">
          <el-menu-item index="/movies">movies</el-menu-item>
        </router-link>
        <router-link to="/MovieClips">
          <el-menu-item index="/MovieClips">MovieClips</el-menu-item>
        </router-link>
      </el-menu>
    </el-aside>
    <el-container>
      <el-header>Header</el-header>
      <el-main>
        <router-view></router-view>
      </el-main>
    </el-container>
  </el-container>
</template>


<script setup>

// eslint-disable-next-line
// import {
//   Document,
//   Menu as IconMenu,
//   Location,
//   Setting,
// } from '@element-plus/icons-vue'
const handleOpen = () => {
  console.log("handleOpen")
}
const handleClose = () => {
  console.log("abc");
}
</script>
