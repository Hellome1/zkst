import { getConfig } from '@/server/api';
import store from '@/store';

var config = null;

export function setConfig() {
  return new Promise((resolve, reject) => {
    getConfig().then(res => {
      let trans = {
        name: 'menuName',
        code: 'menuComponent',
        order: 'menuOrder',
        value: 'menuVisible'
      }, valuetrans = {
        '0': true,
        '1': false
      }, { data = [] } = res, newdata = [];
      newdata = data.map(d => {
        let o = {};
        for (let k in trans) {
          o[k] = d[trans[k]];
          if (k === 'value') {
            o[k] = valuetrans[d[trans[k]]];
          }
        }
        return o;
      });
      console.log('newdata---', newdata);
      let displayModules, displayModules_zkst;
      displayModules = displayModules_zkst = newdata.map(nd => nd.code);
      console.log(displayModules, 'diapssls');
      config = {
        displayModules,
        // displayModules_zkst
      }
      resolve(config);
    }).catch(err => {
      reject();
      throw err;
    });
  })
}

export function getInitConfig() {
  return config;
}

function configCreator() {
  // 获取各项配置数据
  var data = allSetting;
  // 遍历各项配置数据通过适配器转换数据
  data = adapter(data);
  // 应用数据配置setting
  applyData(data);
}

function adapter(data) {
  return data;
}

function applyData(data) {
  let o = {
    displayModules: configData_toArray(data.showSetting),
    layout: configData_toObj(data.generalSetting).layout,
    hearder: configData_toObj(data.generalSetting).header,
    modules: {
      medicalOrder: configData_toObj(data.medicalOrder),
      pacs: configData_toObj(data.pacs),
      lis: configData_toObj(data.lis),
      lisnorm: configData_toObj(data.lisnorm),
      surgery: configData_toObj(data.surgery),
      emr: configData_toObj(data.emr),
      consul: configData_toObj(data.consul)
    }
  };
  deepExtend(setting, o);
  for (let k in o) {
    setting[k] = data[k];
  }
}

function deepExtend(tar, source) {
  /* 源里面的值深度覆盖目标对象的值 */
  for (let k in source) {
    let val = source[k], type = Object.prototype.toString.call(val);
    if(type === '[object Object]') {
      if (k in tar) deepExtend(tar[k], val);
    } else {
      if (k in tar) tar[k] = val;
    }
  }
}

function configData_toArray(source) {
  return source.filter(itm => itm.value).map(itm => itm.code);
}

function configData_toObj(source) {
  let obj = {};
  source.forEach(itm => {
    let isMedicalItems = itm.code === 'items' && itm.name === '医嘱项';
    if (!isMedicalItems) {
      if (itm['value'] === '' && 'children' in itm) itm['value'] = configData_toObj(itm['children']);
    } else {
      itm['value'] = itm.children.map(sub_itm => {
        let o = {
          desc: sub_itm.name,
          code: sub_itm.children.filter(tri_itm => tri_itm.code === 'code')[0].value,
          display: 'list'
        };
        let isLongArr = sub_itm.children.filter(tri_itm => tri_itm.code === 'isLong');
        if (isLongArr.length) o.isLong = isLongArr[0].value; 
        return o;
      });
    }
    set_multiObjSepeByUnderline_value(obj, itm['code'], itm['value']);
  });
  return obj;
}

function set_multiObjSepeByUnderline_value (o, code, value) {
  let isMultiObj = code.indexOf('_') > -1;
  if (isMultiObj) {
    let multiArr = code.split('_'), multiArrLen = multiArr.length;
    let lastMultiArr = multiArr[multiArrLen - 1];
    multiArr = multiArr.filter((itm, ind) => ind < multiArrLen - 1);
    let curO = o;
    multiArr.forEach(itm => {
      if (!curO[itm]) curO[itm] = {};
      curO = curO[itm];
    });
    curO[lastMultiArr[0]] = value;
  } else {
    o[code] = value;
  }
}