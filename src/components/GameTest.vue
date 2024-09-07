<template>  
  <div>  
      
    <button @click="sendMqttMessage('nfc')">game in</button>
    <button @click="sendMqttMessage('add_energy')">add_energy</button>  
    <button @click="sendMqttMessage('game_end')">game out</button>  
    <button @click="sendMqttMessage('end')">end</button>  
    <button @click="autoTest">auto test</button>  
  </div>  
</template>  
  
<script setup>
/* eslint-disable */  
// import { defineProps } from 'vue';  
import mqtt from 'mqtt';

const props = defineProps({  
  play_id: String,
});

if (props.play_id) {
  console.log('play_id', props.play_id)
} else {
  console.log('play_id is null')
}
  
// MQTT客户端配置，根据你的MQTT服务器调整  
const client = mqtt.connect('ws://localhost:8083/mqtt', {  
  clientId: 'vue-app',  
  clean: true,  
  connectTimeout: 4000,  
  keepalive: 60,  
  reconnectPeriod: 1000,  
});  
  
// 发送MQTT消息的函数  
function sendMqttMessage(action) {  
  let message = {};  
  switch (action) {  
    case 'add_energy':  
      message = {  
        action: 'add_energy',  
        value: {  
          play_id: '',  
          car_id: '1',  
          rc_id: '1',  
          num: 3,  
          source: '1',  
        },  
      };  
      break;  
    case 'nfc':  
      message = {  
        action: 'nfc',  
        value: {  
          play_id: '',  
          car_id: '1',  
          rc_id: '1',  
          nfc_id: 'abc',  
        },  
      };  
      break;  
    case 'game_end':  
      message = {  
        action: 'game_end',  
        value: {  
          play_id: '',  
          car_id: '1',  
          rc_id: '1',  
          game_id: '1',  
        },  
      };  
      break;  
    case 'end':  
      message = {  
        action: 'end',  
        value: {  
          play_id: '',  
          car_id: '1',  
        },  
      };  
      break;  
  }
  console.log('sendMqttMessage', message)  
  
  client.publish('myplay/1/car/1', JSON.stringify(message));  
}  

// 自动测试函数（示例）  
function autoTest() {  
  // 这里可以添加一些逻辑来模拟点击或者发送多个消息  
  if (props.play_id) {
    console.log('play_id', props.play_id)
  } else {
    console.log('play_id is null')
  }
  console.log('执行自动测试...');  
  ['add_energy', 'nfc', 'game_end', 'end'].forEach(action => {  
    //sendMqttMessage(action);
    setTimeout(sendMqttMessage(action), 3000);  
  });  
}  
  
// 确保MQTT客户端连接状态  
client.on('connect', () => {  
  console.log('MQTT Connected!');  
});  
  
client.on('error', (err) => {  
  console.error('MQTT Connection Error:', err);  
});  
  
</script>  
  
<style scoped>  
button {  
  margin: 5px;  
  padding: 10px 20px;  
  font-size: 16px;  
}  
</style>