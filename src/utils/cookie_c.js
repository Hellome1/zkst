export default function (cookieName, value, expires) {
  // cookieName类型判断
  if (!('string' === typeof cookieName)) {
    console.error('Expected type of cookieName is string, but ' + Object.prototype.toString.call(cookieName) + ' was offered!');
    return false;
  }
  if (value == undefined) {
    // 获取cookie
    let cookie = document.cookie,
      sp = cookie.indexOf(cookieName),
      ep = cookie.indexOf(';', sp),
      target;
    if (sp === -1) return false;
    ep = ep > -1 ? ep : cookie.length;
    target = cookie.substring(sp + cookieName.length + 1, ep);
    return JSON.parse(target);
  } else {
    // 过期时间
    let expiresString = '';
    if (expires instanceof Date) expiresString = JSON.stringify(expires);
    else if ('string' === typeof expires) expiresString = expires;
    else if ('number' === typeof expires) {
      let d = new Date(),
        m = d.getTime(),
        nm = m + expires * 24 * 60 * 60 * 1000;
      d.setTime(nm);
      expiresString = d.toString();
    } else
      console.warn(
        'Setting of cookie expires failed, expected type of expires is string, number or Date, but ' + Object.prototype.toString.call(expires) + ' was offered!'
      );
    value = JSON.stringify(value);
    // cookie设置
    document.cookie = cookieName + '=' + value + ';expires=' + expiresString;
  }
  return true;
}

export function checkDisplayModules() {
  let storageSetting = localStorage.getItem('setting_zkst');
  if (!storageSetting) return;
  let displayModules_zkst = getFromLocalSetting('displayModules_zkst');
  let displayModules = getFromLocalSetting('displayModules');
  let newdisp = displayModules_zkst.filter(d => displayModules.includes(d));
  setLocalSetting('displayModules_zkst', newdisp);
}

export function getFromLocalSetting(key) {
  let storageSetting = localStorage.getItem('setting_zkst');
  let value = storageSetting ? JSON.parse(storageSetting)[key] : undefined;
  return value;
}

export function setLocalSetting(key, value) {
  let storageSetting = localStorage.getItem('setting_zkst');
  storageSetting = storageSetting ? JSON.parse(storageSetting) : null;
  if (storageSetting) {
    storageSetting[key] = value;
    localStorage.setItem('setting_zkst', JSON.stringify(storageSetting));
  }
  return storageSetting;
}

export function checkWhenViewMode(settingName) {
  let docSelectEncs = getCustomSelected.bind(this)(),
    hdcId = this.$store.state.hdcId,
    patientInfo = this.$store.state.patientInfo;
  if (docSelectEncs.length > 30) {
    Message({ message: '最多选择30条自定义参考就诊！请重新选择', type: 'error' });
    return;
  }
  let setting = this.getFromLocalSetting(settingName);
  let classic = {
    hdcId,
    docSelectEncs,
    patientInfo
  };
  if (setting && setting.selectedClassic) {
    if (setting.selectedClassic.length > 30) {
      Message({ message: '已超过30个病人，请先清除一些病人！', type: 'error' });
      return;
    }
    setClassic.bind(this)(setting, classic, settingName);
  } else {
    setting = { selectedClassic: [classic] };
    this.setLocalSetting(settingName, setting);
  }

  function getCustomSelected() {
    return this.selectedEnc.filter(s => !this.viewModeEncs.includes(s));
  }
  function setClassic(o, c, key) {
    let id = c.hdcId,
      existArr = o.selectedClassic.filter(it => it.hdcId === id);
    if (existArr.length) {
      let tar = existArr[0];
      tar.docSelectEncs = c.docSelectEncs;
    } else {
      o.selectedClassic.push(c);
    }
    this.setLocalSetting(key, o);
  }
}

export function handleLisN(data) {
  let lis = {
    tableData: [],
    row: this.setting.lisNormGrid
  };
  let gridAbnormal = this.setting.gridAbnormal;
  let extraLisData = (this.setting.labelConfig.popUpWindow.popTwo && this.setting.labelConfig.popUpWindow.popTwo.lisData) || {};
  data.forEach(item => {
    let tbi = {};
    for (let key in lis.row) {
      let val = item[key];
      if (key == gridAbnormal.key) {
        for (let i = 0; i < gridAbnormal.replaces.length; i++) {
          if (val == gridAbnormal.replaces[i].split('|')[0]) {
            val = gridAbnormal.replaces[i].split('|')[1];
            break;
          }
        }
      }
      tbi[key] = val;

      tbi.inspItemCode = item.inspItemCode; // 用于二次弹窗
    }
    // 携带检验弹窗数据
    for (let key in extraLisData) {
      tbi[key] = item[key];
    }
    lis.tableData.push(tbi);
  });

  // 携带异常位置
  let index = -1;
  for (let key in lis.row) {
    index++;
    if (key == gridAbnormal.key) break;
  }
  lis.abnIndex = index;

  return lis;
}
