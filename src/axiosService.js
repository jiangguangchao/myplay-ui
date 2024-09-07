import axios from 'axios';  
  
// 创建一个axios实例  
const http = axios.create({  
  baseURL: 'http://localhost:5000', // 你的API基础URL  
  timeout: 1000, // 请求超时时间  
  // 可以在这里添加其他全局配置  
});  
  
// 封装请求函数  
function request(url, params = {}, method = 'get', headers = {}) {  
  // 根据method决定使用get或post等方法，并处理params  
  let options = {  
    method,  
    url,  
    headers: { ...headers },  
  };  
  
  if (method === 'get') {  
    // 如果是get请求，将params附加到URL上  
    const queryString = new URLSearchParams(params).toString();  
    if (queryString) {  
      options.url += `?${queryString}`;  
    }  
  } else if (method === 'post' || method === 'put' || method === 'patch') {  
    // 如果是post/put/patch请求，将params作为请求体发送  
    options.data = params;  
  }  
  
  // 发送请求并返回Promise  
  return http(options)  
    .then(response => {  
      // 处理成功响应  
      return response;  
    })  
    .catch(error => {  
      // 处理错误  
      if (error.response) {  
        // 请求已发出，服务器响应了状态码，但状态码不在2xx的范围内  
        console.error('Error:', error.response.status, error.response.data);  
      } else if (error.request) {  
        // 请求已经发起，但没有收到响应  
        console.error('No response received');  
      } else {  
        // 在设置请求时触发了错误  
        console.error('Error', error.message);  
      }  
      // 你可以根据需要抛出错误或返回错误信息  
      throw error;  
    });  
}  
  
// 导出request函数  
export default {  
  request  
};