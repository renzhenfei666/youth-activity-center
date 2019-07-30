/**axios封装
 * 请求拦截、相应拦截、错误统一处理
 */
import axios from 'axios';


let $axios = axios.create({
    responseType: "json",
    headers: {
        "Content-Type": "application/x-www-form-urlencoded;charset=UTF-8"
    },
});
// 请求超时时间
$axios.defaults.timeout = 50000;
// 请求拦截器
$axios.interceptors.request.use(
    config => {
        return config;
    },
    error => {
        return Promise.reject(error);
    })

// 响应拦截器
$axios.interceptors.response.use(
    response => {
        return Promise.resolve(response.data);
    },
    // 服务器状态码不是200的情况    
    error => {
        return Promise.reject(error);
    }
);

export default $axios;