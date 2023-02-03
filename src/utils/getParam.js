/*
 * @Description: 获取基本参数
 * @Autor: LSX
 * @Date: 2021-10-26 15:58
 * @LastEditTime: 2021-10-27 14:55
 */
import { regNoTohdcId } from '@/server/api';
import store from '@/store';
import { reqs } from './request';
function compliantSession() {
  var flagS;
  typeof Storage !== 'undefined' ? (flagS = sessionStorage) : typeof session !== 'undefined' ? (flagS = session) : (flagS = '');
  if (!flagS) alert('该浏览器不支持sessionStorage,请换高版本浏览器!!!');
  return flagS;
}
function urlParams(url) {
  if (!url) return {};
  let paramStr = url.substr(url.indexOf('?') + 1);
  let paramArr = paramStr.split('&');
  let params = {};
  for (let i = 0; i < paramArr.length; i++) {
    params[paramArr[i].split('=')[0]] = paramArr[i].split('=')[1];
  }
  return params;
}
// HosPatientID
// HosVisitNumber
// HospitalCode
// hdcPatientId
// User
// Dept
// Module
// Token
// MSRole
// Role
var dict = {
  hosCode: 'HospitalCode',
  hosRegNo: 'HosPatientID',
  hosEncId: 'HosVisitNumber',
  hdcId: 'hdcPatientId',
  User: 'User',
  Dept: 'Dept',
  Module: 'Module',
  Token: 'Token',
  MSRole: 'MSRole',
  Role: 'Role'
}
export default function () {
  let storage = compliantSession();
  let search = decodeURIComponent(window.location.search);
  let queryParam = urlParams(search);
  if (!storage) return;
  let hosCode = queryParam.hosCode || storage.getItem('HospitalCode') || '00001'; //业务域
  let hosRegNo = queryParam.hosRegNo || storage.getItem('HosPatientID') || ''; //his登记号
  let hosEncId = queryParam.hosEncId || storage.getItem('HosVisitNumber') || ''; //his就诊号
  let hdcId = queryParam.hdcId || storage.getItem('PATPatientID') || ''; //患者主索引
  let hdcEncId = queryParam.hdcEncId || ''; //平台就诊号
  let SYS = queryParam.SYS || ''; // 系统代码
  let uname = queryParam.uname || ''; // 用户名
  let role = queryParam.role || ''; // 角色
  let param = {
    hosCode,
    hosRegNo,
    hosEncId,
    hdcId,
    hdcEncId,
    SYS,
    uname,
    role
  };
  console.log('param:', param);

  if (!hdcId && hosRegNo) {
    regNoTohdcId({
      businessFieldCode: hosCode,
      hosPatRegNo: hosRegNo
    }).then(res => {
      hdcId = res.data[0].hdcPatientId;
      param.hdcId = hdcId;
      store.commit('set_common', param);
      console.log('state: ', store.state);
      reqs(hdcId);
    });
  }

  store.commit('set_common', param);
}
