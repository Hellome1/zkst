/*
 * @Description: 后台接口
 * @Autor: LSX
 * @Date: 2021-10-25 16:52
 * @LastEditTime: 2021-11-18 09:46
 */
import qs from 'qs';
import request from '@/utils/request';
import store from '@/store';
function jsonProp(obj) {
  if (!obj || typeof obj !== 'object') {
    return obj;
  }
  Object.keys(obj).forEach(key => {
    if (typeof obj[key] === 'object') {
      obj[key] = JSON.stringify(obj[key]);
    }
  });
  return obj;
}
function setBasicParams(other, rows = 100, page = 1) {
  let hosCode = store.state.hosCode;
  let hdcId = store.state.hdcId;
  let hdcEncId = store.state.hdcEncId;
  delete other.rows;
  delete other.page;
  let basic = { businessFieldCode: hosCode, hdcPatientId: hdcId, ...other };
  return qs.stringify(jsonProp({ params: { data: basic }, rows, page }));
}
//登记号转患者主索引
export function regNoTohdcId(query) {
  return request({
    url: 'MES0038',
    method: 'post',
    data: setBasicParams(query)
  });
}
//患者基本信息
export function getPatInfo(query = {}) {
  return request({
    url: 'MES0001',
    method: 'post',
    data: setBasicParams(query, query.rows, query.page)
  });
}
//患者过敏信息
export function getAllergy(query = {}) {
  return request({
    url: 'MES0011',
    method: 'post',
    data: setBasicParams(query, query.rows, query.page)
  })
}
// 获取就诊信息
export function getVisit(query = {}) {
  return request({
    url: 'MES0002',
    method: 'post',
    data: setBasicParams(query, query.rows, query.page)
  });
}
export function getDept(query = {}) {
  return request({
    url: 'MES0032',
    method: 'post',
    data: setBasicParams(query, query.rows, query.page)
  });
}
// 获取检查信息
export function getPacs(query = {}) {
  return request({
    url: 'MES0012',
    method: 'post',
    data: setBasicParams(query, query.rows, query.page)
  });
}
// 检查闭环信息
export function getPacsLoop(query = {}) {
  return request({
    url: 'MES0018',
    method: 'post',
    data: setBasicParams(query, query.rows, query.page)
  });
}
// 获取检验信息
export function getLis(query = {}) {
  let action = query.action || 'MES0024';
  return request({
    url: action,
    method: 'post',
    data: setBasicParams(query, query.rows, query.page)
  });
}
// 检验指标
export function getLisNorm(query = {}) {
  return request({
    url: query.action || 'MES0023',
    method: 'post',
    data: setBasicParams(query, query.rows, query.page)
  });
}
// 用药
export function getMedical(query = {}) {
  return request({
    url: 'MES0005',
    method: 'post',
    data: setBasicParams(query, query.rows, query.page)
  });
}
// 电子病历
export function getEmr(url, query = {}) {
  return request({
    url: url,
    method: 'post',
    data: qs.stringify(jsonProp(query))
  });
}
// 手术申请信息
export function getSurgery(query = {}) {
  return request({
    url: 'MES0020',
    method: 'post',
    data: setBasicParams(query, query.rows, query.page)
  });
}
// 手术详细信息
export function getSurgeryDetails(query = {}) {
  return request({
    url: 'MES0021',
    method: 'post',
    data: setBasicParams(query, query.rows, query.page)
  });
}
// 会诊记录
export function getConsul(query = {}) {
  return request({
    url: 'MES0017',
    method: 'post',
    data: setBasicParams(query, query.rows, query.page)
  });
}
// charts
export function getInsItemDesc(query = {}) {
  return request({
    url: 'MES0048',
    method: 'post',
    data: setBasicParams(query, query.rows, query.page)
  });
}
// 检验历史结果
export function getLisResult(query = {}) {
  return request({
    url: 'MES0049',
    method: 'post',
    data: setBasicParams(query, query.rows, query.page)
  });
}
// 获取配置
export function getConfig() {
  return request({
    // baseURL: setting.ms_url,
    baseURL: process.env.NODE_ENV === 'production' ? setting.ms_url : 'http://49.7.91.24:8002/prod-api/',
    url: '/menu/list/role?pageNumber=1&pageSize=100&belongSystemCode=EMRZKST&role=1',
    method: 'get'
  })
}

/* 处方 */
// 获取处方列表
export function getPrescriptionInfo(query = {}) {
  const specialBaseURL = process.env.NODE_ENV === 'production' ? setting.ms_hdcurl : 'http://192.178.61.87:9083/emviewdoctor/hdc/SerachQuery/';
  return request({
    baseURL: specialBaseURL,
    url: 'MES0005D',
    method: 'post',
    data: setBasicParams(query, query.rows, query.page)
  });
}
/* end处方end */