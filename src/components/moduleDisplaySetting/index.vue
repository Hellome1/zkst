<template>
  <div class="module_display_setting">
    <div class="setting_button" @click="dialogVisible = true">
      <i class="fa fa-gear"></i>
      <span class="setting_label">设置</span>
    </div>

    <div class="popArea">
      <hos-dialog :visible.sync="dialogVisible" width="50%" class="pop-dialog" :class="activeName ? 'full-size' : ''" :before-close="handleClose" append-to-body>
        <div slot="title" class="mds_title">
          <div class="mds_title_txt">显示模块设置</div>
          <div class="mds_title_tool">
            <a href="javascript: void(0);" :title="lockTlVisit ? '取消固定就诊轴' : '固定就诊轴'" @click="lockTlVisit = !lockTlVisit"
              ><i class="fa" :class="lockTlVisit ? 'fa-lock' : 'fa-unlock-alt'"></i
            ></a>
            <a href="javascript: void(0);" title="回到最初的美好" @click="handleReset" style="margin-left: 5px"><i class="fa fa-mail-reply"></i></a>
          </div>
        </div>

        <Crumbs @goBack="activeName = ''" />

        <template v-if="modes.length">
          <div class="modesCont">
            <h4 style="margin: 0">模式已选病人</h4>
            <div class="mode-item" v-for="(mode, mInd) in modes" :key="mode.name">
              <span>{{ mode.name }}:</span>
              <span>
                <span class="selectedPatient" v-for="(patient, ind) in mode.value" :key="patient.hdcId">
                  <span>{{ patient.patientInfo.name + patient.patientInfo.age }}</span>
                  <i class="fa fa-close" @click="delPatient(ind, mInd)"></i>
                </span>
              </span>
            </div>
          </div>
        </template>

        <hos-checkbox-group v-model="checkList">
          <!-- 通用设置 -->
          <hos-card class="box-card" v-show="!activeName || activeName === 'generalSet'">
            <div slot="header" class="mds_card_header mds_clickable" @click="activeName = 'generalSet'">
              <h3 style="font-size: 14px; margin: 5px 10px">通用设置</h3>
            </div>
            <div class="setting-card-body" :class="activeName ? 'scb-active' : ''">
              <general-set ref="generalSet" :showSlider="activeName === 'generalSet'" @setTask="setGlobalTask" />
            </div>
          </hos-card>
          <!-- 通用设置 -->

          <hos-card v-for="(op, i) in options" :key="op.value" class="box-card" v-show="!activeName || op.class">
            <div slot="header" class="mds_card_header mds_clickable" @click.self="activeName = op.ori.name">
              <hos-checkbox :label="op.value" class="cardHeaderCheckBox">{{ op.label }}</hos-checkbox>
              <div class="right-handle-sort" style="float: right; padding: 3px 0">
                <p class="handle-sort-button faHoverBig">
                  <i class="fa fa-caret-up" @click="sortUp(i)"></i>
                </p>
                <p class="handle-sort-button faHoverBig">
                  <i class="fa fa-caret-down" @click="sortDown(i)"></i>
                </p>
              </div>
            </div>
            <div v-if="op.value === 'crucialIndicator'" class="setting-card-body" :class="op.class">
              <card-body ref="cardBody" :root="op" @setTask="setGlobalTask" />
            </div>
            <div v-else class="setting-card-body" :class="op.class">
              <com-card-body ref="comCardBody" :root="op" @setTask="setGlobalTask" />
            </div>
          </hos-card>
        </hos-checkbox-group>

        <span slot="footer" class="dialog-footer">
          <hos-button @click="dialogVisible = false">取 消</hos-button>
          <hos-button type="primary" @click="handleConfirm">确 定</hos-button>
        </span>
      </hos-dialog>
    </div>
  </div>
</template>

<script>
import { mapState } from 'vuex';
import cardBody from './cardBody/cardBody.vue';
import comCardBody from './comCardBody/comCardBody.vue';
import Crumbs from './crumbs/index.vue';
import generalSet from './generalSet/index.vue';
import { checkDisplayModules } from '@/utils/cookie_c';
export default {
  components: { cardBody, comCardBody, Crumbs, generalSet },
  name: 'moduleDisplaySetting',
  data() {
    return {
      dialogVisible: false,
      options: [],
      checkList: [],
      activeName: '',
      globalChangeTask: {},
      lockTlVisit: false,
      modes: []
    };
  },
  created() {
    this.updateLocal();
    this.setGlobalSetting();
    this.setOptions();
  },
  mounted() {},
  watch: {
    dialogVisible: function (newDia) {
      if (newDia) {
        this.init();
      }
    },
    activeName: function (n) {
      this.options.forEach(opt => {
        if (opt.ori.name === n) opt.class = 'scb-active';
        else opt.class = '';
      });
    },
    lockTlVisit: function (n) {
      this.setGlobalTask('lockTlVisit', n);
    }
  },
  computed: {
    ...mapState(['globalSetting']),
    setting: function () {
      return this.globalSetting.setting;
    }
  },
  methods: {
    // 初始化
    init() {
      // 获取显示模块
      let displayModules = this.getFromLocalSetting('displayModules_zkst') || setting.displayModules;
      // 调整显示模块位置 - 与整体显示位置有关
      this.checkList = this.adjustArrPosition(displayModules);
      // 改变本地与store全局设置的桥梁
      this.globalChangeTask = {};
      // 是否锁定就诊
      this.lockTlVisit = this.getFromLocalSetting('lockTlVisit') || setting.lockTlVisit;

      this.checkModes();
      this.cardBodyInit();
    },
    /* 确定按钮 */
    handleConfirm() {
      let ndis = this.adjustArrPosition(this.checkList);
      let globalSetting = null;
      if (!localStorage.getItem('setting_zkst')) {
        // globalSetting = setting;
        // globalSetting.displayModules_zkst = ndis;
        localStorage.setItem('setting_zkst', JSON.stringify(setting));
        this.setLocalSetting('displayModules_zkst', ndis);
        this.globalStorageChange();
        globalSetting = JSON.parse(localStorage.getItem('setting_zkst'));
      } else {
        this.globalStorageChange();
        globalSetting = this.setLocalSetting('displayModules_zkst', ndis);
      }
      this.restoreFunctions(globalSetting, setting);
      this.$store.commit('SET_SETTING', globalSetting);
      this.dialogVisible = false;
    },
    globalStorageChange() {
      let task = this.globalChangeTask;
      for (let k in task) {
        this.setLocalSetting(k, task[k]);
      }

      let modes = this.modes;
      if (modes.length) {
        modes.forEach(mode => {
          let k = mode.name === '糖尿病' ? 'su_setting' : 'blood_setting';
          let v = {
            selectedClassic: mode.value
          };
          this.setLocalSetting(k, v);
        });
      }
    },
    setGlobalTask(k, v) {
      this.globalChangeTask[k] = v;
      console.log(this.globalChangeTask);
    },
    /* 关闭弹窗 */
    handleClose() {
      this.dialogVisible = false;
    },

    setGlobalSetting() {
      // 设置全局设置,在此之后全局设置应该从store中取出
      checkDisplayModules();
      let globalSetting = JSON.parse(localStorage.getItem('setting_zkst')) || setting;
      this.restoreFunctions(globalSetting, setting);
      console.log('globalsetting---------;', globalSetting);
      this.$store.commit('SET_SETTING', globalSetting);
      this.getLocalCheck();
      console.log(JSON.parse(JSON.stringify(this.$store.state.globalSetting)));
    },
    /* 显示顺序检查 */
    getLocalCheck() {
      let displayModules = this.setting.displayModules_zkst;
      let newDis = this.adjustArrPosition(displayModules);
      this.checkList = newDis;
    },
    setOptions() {
      let codes = this.setting.displayModules,
        details = setting.modules,
        options = [];
      codes.forEach(code => {
        let option = {};
        option.value = code;
        for (let k in details) {
          if (code === details[k].name) {
            option.label = details[k].title;
            option.ori = details[k]; // 设置里的信息存入ori
          }
        }
        option.class = option.ori.name === this.activeName ? 'scb-active' : '';
        options.push(option);
      });
      // options[0].class = 'scb-active'; // 初始选中第一个
      this.options = options;
    },

    /* 上调模块 */
    sortUp(i) {
      if (i === 0) return;
      let opti = JSON.parse(JSON.stringify(this.options));
      let res = opti.splice(i, 1)[0];
      opti.splice(i - 1, 0, res);
      this.options = opti;
      let displayModules = opti.map(op => op.value);
      this.setLocalSetting('displayModules', displayModules);
    },
    /* 下调模块 */
    sortDown(i) {
      let opti = JSON.parse(JSON.stringify(this.options));
      if (i === opti.length - 1) return;
      let res = opti.splice(i, 1)[0];
      opti.splice(i + 1, 0, res);
      this.options = opti;
      let displayModules = opti.map(op => op.value);
      this.setLocalSetting('displayModules', displayModules);
    },
    // 查找不同模式下的被选择的病人
    checkModes() {
      let modes = ['su', 'blood']
        .map(name => {
          let value = this.getFromLocalSetting(name + '_setting');
          value = value ? value.selectedClassic : null;
          return {
            name: name === 'su' ? '糖尿病' : '血液',
            value
          };
        })
        .filter(v => v.value && v.value.length);
      console.log('modes:', modes);
      this.modes = modes;
    },
    /* 删除医生自选病人 */
    delPatient(ind, mInd) {
      this.modes[mInd].value.splice(ind, 1);
      console.log('modes:', this.modes);
    },
    /* 切换活跃的设置项 */
    switchActive(ind) {
      this.options.forEach((op, i) => {
        op.class = i === ind ? 'scb-active' : '';
      });
    },
    /* 重置   设置还原 */
    handleReset() {
      this.$confirm('还原设置后将不可恢复，确认要还原吗？')
        .then(_ => {
          localStorage.setItem('setting_zkst', JSON.stringify(setting));

          this.setGlobalSetting();
          this.setOptions();
          this.init();
          this.modes = [];
        })
        .catch(_ => {});
    },
    /* 
      每次确定前调整模块顺序
      模块顺序和显示模块选项根据localstorage>setting_zkst>displaymodules决定
    */
    adjustArrPosition(ds) {
      let displayModules = this.getFromLocalSetting('displayModules');
      if (!displayModules) return ds;
      return displayModules.map(dis => ds.filter(d => d === dis)[0]).filter(dis => dis);
    },

    // 恢复存到localStorage中被删除的值为方法的部分, 数组不遍历
    restoreFunctions(a, b) {
      for (let k in b) {
        if (Object.prototype.toString.call(b[k]) === '[object Object]' && Object.prototype.hasOwnProperty.call(a, k)) {
          this.restoreFunctions(a[k], b[k]);
        } else {
          if (b[k] instanceof Function) a[k] = b[k];
        }
      }
    },
    // 初始化cardBody数据
    cardBodyInit() {
      if (!this.$refs.cardBody) return;
      this.$refs.generalSet.getSetting();
      this.$refs.cardBody.forEach(c => {
        c.getSetting();
      });
      this.$refs.comCardBody.forEach(c => {
        c.setParam();
      });
    },
    /* ----- ?给自己的更新本地设置的方法 ----- */
    updateLocal() {
      if (process.env.NODE_ENV === 'production') return; // 生产环境此方法失效
      let keys = [
        /* 'lockTlVisit',  */
        'modules'
        // 'layout'
      ];
      keys.forEach(key => {
        this.setLocalSetting(key, setting[key]);
      });
    }
  }
};
</script>

<style lang="scss" scoped>
.setting_button {
  cursor: pointer;
  &:hover {
    color: #409eff;
  }
  .fa {
    text-shadow: 1px 1px 1px rgba(0, 0, 0, 0.3);
  }
  .setting_label {
    font-size: 14px;
  }
}
.mds_clickable {
  cursor: pointer;
}
.pop-dialog {
  .mds_title {
    display: flex;
    justify-content: space-between;
    padding-right: 50px;
    .mds_title_txt {
    }
    .mds_title_tool {
      font-size: 12px;
      position: relative;
      a {
        color: #666;
        .fa {
          margin-right: 4px;
        }

        &:hover {
          color: #409eff;
        }
      }
    }
  }

  .modesCont {
    .mode-item {
      margin-bottom: 5px;
      .selectedPatient {
        background-color: #eee;
        padding: 2px;
        border-radius: 1px;
        .fa {
          cursor: pointer;
          background-color: #aaa;
          display: inline-block;
          width: 16px;
          height: 16px;
          text-align: center;
          color: white;
          margin-left: 2px;
          border-radius: 50%;
          &:hover {
            background-color: #888;
          }
        }
      }
    }
  }

  .box-card {
    font-size: 14px;
    .mds_card_header {
      padding: 10px;
      &:hover {
        background-color: rgba(56, 209, 255, 0.2);
      }
      .cardHeaderCheckBox {
        padding: 5px 10px;
        &:hover {
          background-color: rgba(0, 130, 222, 0.3);
        }
      }
      .right-handle-sort {
        .handle-sort-button {
          padding: 0;
          height: 12px;
          line-height: 12px;
          font-size: 16px;

          &:hover {
            color: #409eff;
          }

          .fa {
            cursor: pointer;
            height: 6px;
            line-height: 6px;
          }
        }
        .faHoverBig {
          &:hover {
            transform: scale(1.3);
          }
        }
      }
    }

    .setting-card-body {
      height: 0px;
      display: none;
      overflow: hidden;
    }
    .setting-card-body.scb-active {
      height: auto;
      display: block;
      padding: 20px;
    }
  }
}
</style>
