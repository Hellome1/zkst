<template>
  <div class="emr-header">
    <div class="emr-header-content clear">
      <div class="hospital">
        <div class="hos-logo" ref="hosLogo">
          <img :src="logoSrc" alt="" />
        </div>
        <div class="hos-right">
          <div class="product">{{ setting.hosInfo.product }}</div>
          <div class="hos-name">{{ setting.hosInfo.hosName }}</div>
        </div>
      </div>
      <div class="patient-info">
        <i v-if="allergyDatas.length" class="fa fa-street-view" style="color: #ff5d5d; cursor: pointer" @click="dialogVisible = true"></i>
        <span>{{ patInfo.name }}</span>
        <span>{{ patInfo.gender }}</span>
        <span>{{ patInfo.birth }}</span>
        <span>{{ age(patInfo.birth) }}</span>
        <span>{{ patInfo.hosReg }}</span>
      </div>
      <div class="view-mode">
        <hos-button size="small" :class="viewMode === 'su' ? 'mode-selected' : ''" @click="handlesu">糖尿病</hos-button>
        <hos-button size="small" :class="viewMode === 'blood' ? 'mode-selected' : ''" @click="handleblood">血液</hos-button>
      </div>
      <div class="tools">
        <div class="tool-content">
          <div v-for="(tool, i) in setting.toolbarMenu" :key="i" class="tool">
            <a v-if="tool.href" :href="tool.href">
              <i :id="tool.id" :class="tool.icon" :title="tool.desc"></i>
            </a>
            <i v-else :id="tool.id" :class="tool.icon" :title="tool.desc"></i>
          </div>
        </div>
        <div v-if="setting.toggleMenu.length > 0" class="toggle-view">
          <i class="fa fa-th-large btn" title="切换视图" @click="showToggle = !showToggle"></i>
        </div>
      </div>
      <div class="user-info">
        <i class="fa fa-user-o"></i>
        <!-- <span class="uname">{{ $store.state.uname || $store.state.SYS }}</span>
        <span class="role">{{ $store.state.role || $store.state.SYS }}</span> -->
        <span class="role">{{ role }}</span>
      </div>
    </div>

    <div class="toggle-content" v-show="showToggle">
      <a v-for="(menu, i) in setting.toggleMenu" :key="i" class="toggle-menu" :href="menu.href">
        <i class="down-icon fa"></i>
        <span class="down-font">{{ menu.desc }}</span>
      </a>
    </div>
    <!-- 用来撑父级形状 -->
    <div class="null"></div>
    <!-- ----------- -->

    <hos-dialog :visible.sync="dialogVisible" title="病人过敏信息" width="80%" append-to-body>
      <hos-table :data="allergyDatas" style="width: 100%">
        <hos-table-column prop="allerSourceDesc" label="过敏源描述" width="300"> </hos-table-column>
        <hos-table-column prop="allergyDate" label="发病日期" width="120"> </hos-table-column>
        <hos-table-column prop="allerTypeDesc" label="过敏类别" width="100"> </hos-table-column>
        <hos-table-column prop="allerReacDesc" label="过敏反应" show-overflow-tooltip> </hos-table-column>
        <hos-table-column prop="allergySeverityDesc" label="严重级别" width="100"> </hos-table-column>
        <hos-table-column prop="allerUpdateUserName" label="更新人" width="120"> </hos-table-column>
        <hos-table-column prop="allergyId" label="过敏记录ID" width="120"> </hos-table-column>
      </hos-table>
    </hos-dialog>
  </div>
</template>

<script>
import { getPatInfo, getAllergy } from '@/server/api.js';
import { mapState } from 'vuex';
export default {
  inject: ['layout'],
  components: {},
  props: {
    setting: {
      type: Object,
      required: true
    }
  },
  data() {
    return {
      showToggle: false,
      patInfo: {},
      suclass: '',
      bloodclass: '',
      allergyDatas: [],
      dialogVisible: false,
      logoSrc: require('@/' + this.setting.hosInfo.hosLogo.replace('@/', ''))
    };
  },
  watch: {
    patInfo: function (v) {
      let { name, birth, gender } = v;
      this.$store.commit('SET_PATIENTINFO', { name, age: this.age(birth), gender });
    }
  },

  mounted() {},

  created() {
    this.fetchData();
  },

  computed: {
    ...mapState(['viewMode']),
    role() {
      return (sessionStorage && sessionStorage.getItem('Role') && sessionStorage.getItem('MSRole')) || '';
    }
  },

  methods: {
    fetchData() {
      getPatInfo().then(res => {
        // console.log(res);
        let { data = [] } = res;
        let { patientName, patBirthDate, patGenderDesc, hosPatRegNo } = data[0];
        this.patInfo = {
          name: patientName,
          gender: patGenderDesc,
          birth: patBirthDate,
          hosReg: hosPatRegNo
        };
        // this.$store.commit('SET_HOSREGNO', hosPatRegNo);
      });
      getAllergy().then(res => {
        this.allergyDatas = res.data;
        if (this.allergyDatas.length) this.dialogVisible = true;
      });
    },
    age(birthday) {
      let d = dayjs(birthday),
        now = dayjs(),
        y = now.diff(d, 'year'),
        m = now.diff(d, 'month') - 12 * y,
        ageHasMonth = '( ' + y + '岁' + m + '月' + ' )',
        justAge = '( ' + y + '岁' + ' )';
      return y > 9 ? justAge : ageHasMonth;
    },
    handlesu() {
      let mode = this.viewMode === 'su' ? 'normal' : 'su';
      this.$store.commit('SET_VIEWMODE', mode);
    },
    handleblood() {
      let mode = this.viewMode === 'blood' ? 'normal' : 'blood';
      this.$store.commit('SET_VIEWMODE', mode);
    }
  }
};
</script>

<style lang="scss" scoped>
$header-bg-color: #3483df;
.emr-header {
  .emr-header-content {
    background-color: $header-bg-color;
    color: #fff;
    width: calc(100vw - 5px);
    margin: -5px 0 0 -20px;
    padding: 3px 0;
    height: 50px;
    position: fixed;
    z-index: 99;
    .hospital {
      float: left;
      position: relative;
      padding-left: 48px;
      height: 100%;
      margin-left: 30px;
      .hos-logo {
        position: absolute;
        left: 0;
        width: 48px;
        height: 48px;
        img {
          width: 100%;
          height: 100%;
        }
      }
      .hos-right {
        font-size: 14px;
        font-weight: 600;
        margin: 9px 0 0 3px;
        line-height: 1;
      }
      .hos-name {
        margin-top: 5px;
      }
    }
    .patient-info {
      float: left;
      height: 100%;
      margin-left: 50px;
      font-weight: 700;
      margin-top: 15px;
      span {
        margin-right: 10px;
      }
    }
    .view-mode {
      float: left;
      margin: 10px 0 0 20px;
      .mode-selected {
        color: white;
        background-color: #409eff;
      }
    }
    .user-info {
      float: right;
      color: white;
      line-height: 50px;

      i {
        margin-right: 10px;
      }
      span {
        margin-left: 5px;
      }
    }
    .tools {
      float: right;
      height: 100%;
      color: white;
      margin-right: 20px;
      line-height: 50px;
      margin-left: 20px;
      i {
        cursor: pointer;
        font-size: 20px;
        &:hover {
          color: rgba(35, 82, 124, 0.3);
        }
      }
      .tool-content {
        display: inline-block;
        border-right: 1px solid #fff;
        .tool {
          display: inline-block;
          margin: 0 15px;
          a {
            color: white;
          }
        }
      }
      .toggle-view {
        display: inline-block;
        position: relative;
        margin: 0 0 0 15px;
      }
    }

    @media screen and (max-width: 1080px) {
      .hospital {
        margin-left: 20px;
      }
      .patient-info {
        margin-left: 20px;
      }
    }

    @media screen and (max-width: 1020px) {
      .hospital {
        margin-left: 10px;
      }
      .patient-info {
        margin-left: 10px;
      }
      .view-mode {
        margin-left: 10px;
      }
    }

    @media screen and (max-width: 970px) {
      .user-info {
        span {
          display: none;
        }
      }
    }
    @media screen and (max-width: 920px) {
      .tools {
        display: none;
      }
    }
  }

  .toggle-content {
    position: absolute;
    top: 53px;
    right: 0;
    padding: 8px 0;
    background-color: $header-bg-color;
    z-index: 99;
    border: 0.5px solid #fff;
    line-height: 1;
    .toggle-menu {
      padding: 0 14px;
      color: white;
      text-decoration: none;
      white-space: nowrap;
      font-size: 14px;
    }
  }
  .null {
    height: 60px;
  }
}
.btn {
  cursor: pointer;
}
</style>
