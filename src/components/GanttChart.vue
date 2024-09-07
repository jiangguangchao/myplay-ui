<template>  
  <div class="gantt-chart">  
    <svg width="600" :height="height">  
      <!-- 垂直时间轴背景 -->  
      <line x1="250" y1="0" x2="250" y2="100%" stroke="black" stroke-width="2" />  
      <text x="225" y="12" text-anchor="middle">00:00</text>  
      <text x="225" :y="height" text-anchor="middle">11:00</text>  
  
      <!-- 第一个游戏块 -->  


      <template v-for="(game, index) in gameList" :key="index">
        <rect x="251" :y="game.startTimeY" width="100" :height="game.gameHeight" fill="url(#game1Gradient)" />  
        <text x="301" :y="game.gameNameY" text-anchor="middle" dy=".35em">{{ game.gameName }}</text>
        <text x="371" :y="game.startTimeY" text-anchor="middle" dy=".35em">{{ game.startTime }}</text>
        <text x="371" :y="game.endTimeY" text-anchor="middle" dy=".35em">{{ game.endTime }}</text>  
      </template>

      <line x1="250" y1="10" x2="180" y2="10" stroke="black" stroke-width="2"></line>

  
      <!-- 渐变定义 -->  
      <defs>  
        <linearGradient id="game1Gradient" x1="0%" y1="0%" x2="0%" y2="100%">  
          <stop offset="0%" style="stop-color:rgb(255,99,132);stop-opacity:1" />  
          <stop offset="100%" style="stop-color:rgb(255,159,64);stop-opacity:1" />  
        </linearGradient>  
        <linearGradient id="game2Gradient" x1="0%" y1="0%" x2="0%" y2="100%">  
          <stop offset="0%" style="stop-color:rgb(75,192,192);stop-opacity:1" />  
          <stop offset="100%" style="stop-color:rgb(54,162,235);stop-opacity:1" />  
        </linearGradient>  
      </defs>  
    </svg>  
  </div>  
</template>  
  
<script setup>  
import {ref, onMounted} from 'vue';
const props = defineProps({  
  timLineCarId: String,
});

const height = ref(800)
const playTime = ref(600)//游戏时间10分钟

const gameTimeList = [
  {
    "time":15,
    "game_id":"1",
    "type":"1"
  },
  {
    "time":25,
    "game_id":"1",
    "type":"0"
  },
]

onMounted(() => {  
  showGameList()
});

const gameList = ref([])

function showGameList(){
  const entireGameList = [];
  //将gameList每2个元素当做要给一个游戏块放入数组entireGameList中
  for(let i = 0; i < gameTimeList.length; i += 2){  
    entireGameList.push(gameTimeList.slice(i, i + 2));  
  }

  for(let i = 0; i < entireGameList.length; i++){
    const entireGame = entireGameList[i];
    if (entireGame.length < 2) {
      return;
    }
    if (entireGame[0].game_id != entireGame[1].game_id) {
      console.log("第" + (i + 1) + "个游戏块的game_id不一致:" + entireGame);
      continue;
    }
    if (entireGame[0].type != 1 || entireGame[1].type != 0) {
      console.log("第" + (i + 1) + "个游戏块的type不是先进后出:" + entireGame);
      continue;
    }
    
    const gameStartTime = entireGameList[i][0].time; 
    const gameEndTime = entireGameList[i][1].time;

    const startY = getIndexInY(gameStartTime);
    const endY = getIndexInY(gameEndTime);

    const gameGradient = {
      "startTime": getMMSSTime(gameStartTime), 
      "startTimeY": startY,
      "endTime": getMMSSTime(gameEndTime), 
      "endTimeY": endY,
      "gameName": "游戏" + entireGameList[i][0].game_id,
      "gameNameY": startY + (endY - startY)/2,
      "gameHeight": endY - startY,
    }
    gameList.value.push(gameGradient)

  }

  
}

function getMMSSTime(seconds) {
  const minute = Math.floor(seconds/60);
  const second = seconds%60;

  return `${String(minute).padStart(2, '0')}:${String(second).padStart(2, '0')}`;
}

function getIndexInY(time){
  return (time/playTime.value)*height.value
}
  
</script>  
  
<style scoped>  
.gantt-chart svg {  
  display: block; /* 使SVG占据整个容器宽度（但高度由内部元素决定） */  
}  
</style>