/*
 * @Description:
 * @Autor: LSX
 * @Date: 2021-10-26 09:48
 * @LastEditTime: 2021-11-08 17:36
 */
import axios from 'axios';
import { Notification, MessageBox, Message } from 'element-ui';
import statusCode from '@/utils/statusCode';
import getToken from './getToken';
import qs from 'qs';

axios.defaults.headers['Content-Type'] = 'application/x-www-form-urlencoded';
let token = sessionStorage.getItem('Token');
const isProduction = process.env.NODE_ENV === 'development' ? true : true;
const baseURL = isProduction ? setting.ms_hdcurl : setting.hdcurl;
const service = axios.create({
  baseURL,
  headers: {
    Authorization: isProduction && token ? 'Bearer ' + token : ''
  },
  timeout: 10000
});

let isRefreshToken = false;
let requests = [];
export function reqs(id) {
  requests.forEach(cb => cb(id));
  requests = [];
}
let beforeGetTokenRequests = [];
//请求拦截
service.interceptors.request.use(
  config => {
    if (!isRefreshToken && !token) {
      isRefreshToken = true;
      getToken().then(res => {
        sessionStorage.setItem('Token', res.access_token);
        token = res.access_token;
        beforeGetTokenRequests.forEach(cb => cb(token));
        beforeGetTokenRequests = [];
      });
      const retryOriginalRequest = new Promise(resolve => {
        beforeGetTokenRequests.push(token => {
          config.headers.Authorization = isProduction ? 'Bearer ' + token : '';
          resolve(config);
        });
      });
      return retryOriginalRequest;
    } else if (token) {
      config.headers.Authorization = isProduction ? 'Bearer ' + token : '';
    } else if (config.url.indexOf('token') === -1 && config.url != 'MES0001' && config.url != 'MES0002') {
      const retryOriginalRequest = new Promise(resolve => {
        beforeGetTokenRequests.push(token => {
          config.headers.Authorization = isProduction ? 'Bearer ' + token : '';
          resolve(config);
        });
      });
      return retryOriginalRequest;
    }
    if (config.url === 'MES0001' || config.url === 'MES0002') {
      // 0001和0002接口单独拦截
      let dataStr = config.data ? decodeURIComponent(config.data) : '';
      let start = dataStr.indexOf('params=') + 7,
        end = dataStr.indexOf('&'),
        after = dataStr.substring(end),
        ObjStr = dataStr.substring(start, end),
        Obj = JSON.parse(ObjStr),
        hdcId = Obj.data ? Obj.data.hdcPatientId : '';
      if (!hdcId) {
        const retryOriginalRequestFor = new Promise(resolve => {
          requests.push(hdcId => {
            config.headers.Authorization = isProduction ? 'Bearer ' + token : '';
            Obj.data.hdcPatientId = hdcId;
            let rawStr = 'params=' + JSON.stringify(Obj) + after;
            config.data = qs.stringify(qs.parse(rawStr));
            resolve(config);
          });
        });
        return retryOriginalRequestFor;
      }
      if (isProduction && !token) {
        const retryOriginalRequest = new Promise(resolve => {
          beforeGetTokenRequests.push(token => {
            config.headers.Authorization = isProduction ? 'Bearer ' + token : '';
            resolve(config);
          });
        });
        return retryOriginalRequest;
      }
    }
    return config;
  },
  error => {
    console.log(error);
    return Promise.reject(error);
  }
);

//响应拦截
service.interceptors.response.use(
  response => {
    const code = response.data.code || 200;
    const msg = statusCode[code];
    if (code === 500) {
      Message({
        message: msg,
        type: 'error'
      });
      return Promise.reject(new Error(msg));
    } else if (code === 402 && response.data.msg === 'Token无效,请重新登录,获取正确的Token') {
      /* ？？？？开发用方便方法，上线删除？？？？ */
      Message({
        msg: 'Token无效,请重新登录,获取正确的Token',
        type: 'error'
      });
      sessionStorage.removeItem('Token');
      location.reload();
      /* ？？？⬆️开发用方便方法，上线删除⬆️？？？ */
    } else if (code !== 200 && code !== 400) {
      Message({
        message: msg,
        type: 'error'
      });
      /*    Notification.error({
        title: msg
      }); */
      return Promise.reject('error');
    } else {
      return response.data;
    }
  },
  error => {
    console.log('err' + error);
    let { message } = error;
    if (message == 'Network Error') {
      message = '后端接口连接异常';
    } else if (message.includes('timeout')) {
      message = '系统接口请求超时';
    } else if (message.includes('Request failed with status code')) {
      message = '系统接口' + message.substr(message.length - 3) + '异常';
    }
    Message({
      message: message,
      type: 'error',
      duration: 5 * 1000
    });
    return Promise.reject(error);
  }
);

export default service;
