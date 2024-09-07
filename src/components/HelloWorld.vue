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
        <!-- <el-sub-menu index="1">  
          <template #title>首页</template>  
          <el-menu-item-group>  
            <el-menu-item index="1-1">选项1</el-menu-item>  
            <el-menu-item index="1-2">选项2</el-menu-item>  
          </el-menu-item-group>  
        </el-sub-menu>   -->
        <el-menu-item index="1">首页</el-menu-item>  
        <el-sub-menu index="2">  
          <template #title>统计</template>  
          <el-menu-item-group>  
            <el-menu-item index="2-1">选项1</el-menu-item>  
            <el-menu-item index="2-2">选项2</el-menu-item>  
          </el-menu-item-group>  
        </el-sub-menu>  
        <el-menu-item index="3">选项3</el-menu-item>  
        <el-menu-item index="4">选项4</el-menu-item>  
      </el-menu>  
    </el-aside>  
  
    <el-container>  
      <el-header>Header</el-header>  
      <el-main>  
        <CarList></CarList>  
      </el-main>  
    </el-container>  
  </el-container>  
</template>


<script setup>
import CarList from './CarList.vue'
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
