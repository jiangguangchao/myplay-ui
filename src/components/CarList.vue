<template>  
  <div class="flex flex-wrap gap-4">  
    <el-card  
      v-for="car in cars"  
      :key="car.play_id"  
      :style="{ maxWidth: '300px', backgroundColor: getBackgroundColor(car.car_status) }" 
      class="box-shadow"  
    > 
    <template #header>
      <div class="card-header">
        <span style="font-size:26px;">{{car.car_name}}</span>
        &nbsp;&nbsp;&nbsp; <!-- 添加空格 --> 
        <span style="font-size:26px; color:coral">{{ car.remainTime }}</span>
        &nbsp;&nbsp;&nbsp; <!-- 添加空格 --> 
        <span style="font-size:26px; color:chartreuse;">{{ car.play_time }}分钟</span>
      </div>
    </template> 
      <div class="card-item">开始时间：{{ car.start_time }}</div>
      <div class="card-item">play_id：{{ car.play_id }}</div>  
      <div class="card-item">rc：{{ car.rc_name }}</div>
      <div class="card-item">状态：{{ getStatus(car.car_status) }}</div>
      <div class="card-item">energy：{{ car.energy }}</div>
      <div class="card-item">used_energy：{{ car.used_energy }}</div>
      <div class="card-item">total_energy：{{ car.total_energy }}</div>
      <div class="card-item">game：{{ car.game_name }}</div>
      <div class="card-item">MCU：{{ car.mcu }}</div>
      <!-- 控制按钮的显示  -->  
      <template v-if="['-1'].includes(car.car_status)">  
        <el-button @click="carPrepare(car)">准备</el-button>
      </template>  
      <template v-else-if="['0'].includes(car.car_status)">  
        <el-button @click="carStart(car)">开始</el-button>
      </template>
      <el-button @click="carEnergyList(car)">energy</el-button>
      <el-button @click="carGameList(car)">game</el-button>
      <el-button @click="timeLine(car)">时间线</el-button>
    </el-card>  
  </div>
  
  <el-dialog v-model="energyListVisible" title="Shipping address" width="800">
    <el-table :data="energyList">
      <el-table-column property="time" label="时间" >
        <template #default="scope">
          {{ getMMSSTime(scope.row.time) }}
        </template>
      </el-table-column>
      <el-table-column property="num" label="能量值"  />
      <el-table-column property="source" label="来源" />
    </el-table>
  </el-dialog>

  <el-dialog v-model="gameListVisible" title="Shipping address" width="800">
    <el-table :data="gameList">
      <el-table-column property="time" label="时间" >
        <template #default="scope">
          {{ getMMSSTime(scope.row.time) }}
        </template>
      </el-table-column>
      <el-table-column property="game_id" label="游戏"  />
      <el-table-column property="type" label="动作" />
    </el-table>
  </el-dialog>
  
    <el-dialog v-model="timeLineVisible">
		<GanttChart :timLineCarId="timLineCarId"/>
	</el-dialog>

  <GameTest :play_id="play_id" />
  
</template>  
  
  
<script setup>
/* eslint-disable */  
import { ref, onMounted,onUnmounted } from 'vue';  
import axiosService from '@/axiosService'; // 根据你的axiosService文件位置调整路径
import GameTest from '@/components/GameTest.vue';  
import GanttChart from '@/components/GanttChart.vue';  
  
// 定义一个响应式引用来存储车辆数据  
const cars = ref([]);
const remainTime = ref(100)
const play_id = ref()  
  
// 在组件挂载后调用API获取数据  
onMounted(async () => {  
  try {  
    const response = await axiosService.request('/carInfo/list', {}, 'get');  
    // 假设API直接返回了车辆数组，如果没有，你可能需要调整这里的处理逻辑  
    cars.value = response.data; // 将获取到的数据（可能是响应体中的data属性）赋值给cars
  } catch (error) {  
    console.error('Failed to fetch car info:', error);  
  }
  
     const timer = setInterval(() => {
		cars.value.forEach(e => {
		e.header_info = e.car_name;
		if (e.car_status === "1" || e.car_status === "2") {
			e.remainTime = getRemainTime(e.start_time, e.play_time)
		} else if   (e.car_status === "0") {
			e.remainTime = "-"
		} 
		
    })
	 }, 1000);  
});
   // 组件卸载时清除定时器  
   onUnmounted(() => {  
     clearInterval(timer);  
   });

async function carPrepare(car) {
  if (car.car_status != '-1') {
    console.log("小车状态不是未开始，不能执行准备操作")
    return ;
  }
  const param = {
    "car_id":car.car_id,
    "rc_id": car.rc_id,
    "play_time": 10
  };
  const response = await axiosService.request('/car/prepare', param, 'post');
  const resData = response.data;
  cars.value.forEach(c => {
    if (c.car_id == car.car_id) {
      for (let key in resData) {
        if (resData.hasOwnProperty(key)) { // 确保属性是对象自身的
          c[key] = resData[key]
        }
      }
    }
  })
}

async function carStart(car) {
  if (car.car_status != '0') {
    console.log("小车状态不是“准备中”，不能执行“开始”操作")
    return ;
  }

  play_id.value = car.play_id;

  const param = {
    "car_id":car.car_id,
    "rc_id": car.rc_id,
    "play_time": 15,
    "play_id": car.play_id
  };
  const response = await axiosService.request('/car/start', param, 'post');
  const resData = response.data;
  cars.value.forEach(c => {
    if (c.car_id == car.car_id) {
      for (let key in resData) {
        if (resData.hasOwnProperty(key)) { // 确保属性是对象自身的
          c[key] = resData[key]
        }
      }
    }
  })
}

const energyList = ref([]);
const energyListVisible = ref(false);
async function carEnergyList(car) {
  const param = {
    "car_id":car.car_id,
  };
  const response = await axiosService.request('/carInfo/energyList', param, 'get');
  const resData = response.data;
  energyListVisible.value = true;
  energyList.value = resData;
}

const gameList = ref([]);
const gameListVisible = ref(false);
async function carGameList(car) {
  const param = {
    "car_id":car.car_id,
  };
  const response = await axiosService.request('/carInfo/gameList', param, 'get');
  const resData = response.data;
  gameListVisible.value = true;
  gameList.value = resData;

}

const timeLineVisible = ref(false);
const timLineCarId = ref();
function timeLine(car) {

	timLineCarId.value = car.car_id
  timeLineVisible.value = true;

}

function getStatus(status) {  
  switch (status) {  
    case '-1':  
      return '未开始';  
    case '0':  
      return '准备中';  
    case '1':  
      return '进行中';  
    case '2':  
      return '暂停';  
    default:  
      return '未知状态';  
  }  
}

function getBackgroundColor(status) {  
    switch (status) {  
      case '-1': // 未开始  
        return '#909399'; // 灰色  
      case '0': // 准备中  
        return '#fff0b3'; // 浅黄色  
      case '1': // 进行中  
        return '#95d475';  
      case '2': // 暂停  
        return '#ffe0b2'; // 浅橙色  
      default:  
        return '#ffffff'; // 白色  
    }  
  } 

  

const getRemainTime = function(start_time, play_time){
	// 将字符串转换为Date对象  
  const startTime = new Date(start_time);
  const now = new Date();
  const endTimeMill = startTime.getTime() + play_time * 1000 * 60;
  if (now.getTime() >= endTimeMill) {
	return "00:00"
  }
  const remainSecond = Math.floor((endTimeMill - now.getTime())/1000);
  return getMMSSTime(remainSecond);

}
function getMMSSTime(seconds) {
  const minute = Math.floor(seconds/60);
  const second = seconds%60;

  return `${String(minute).padStart(2, '0')}:${String(second).padStart(2, '0')}`;
}
</script>  
  
<style scoped>  
.card-item {  
  /* 你的样式 */  
  margin-bottom: 10px;  
}  
  
/* 如果需要，可以添加更多的样式来美化el-card和card-item */  
</style>