<template>
  <div ref="prescG" class="prescGroup">
    <template v-if="house">
      <ul v-if="medicine.length > 0">
        <li class="medicine" v-for="(m, i) in medicine" :key="i">
          <!-- 筛选药品状态 -->
          <Label :param="m" :setting="setting" />
        </li>
      </ul>
    </template>
    <template v-else>
      <ul class="medicines" :style="{height: medicinesHeight}" v-if="medicine.length > 0" @mouseenter="handleMouseenter" @mouseleave="handleMouseleave" @mousemove="handleMousemove">
        <li class="medicine" ref="li_medicine_in_medicines" v-for="(m, i) in medicine" :key="i">
          <!-- 筛选药品状态 -->
          <Label :param="m" :noTitle="true" :noMargin="true" :setting="setting" />
        </li>
      </ul>
    </template>
  </div>
</template>

<script>
import Label from '@/components/Label/labelData.vue';
import Prescription from '@/components/prescription/index.vue';
import Vue from 'vue';
import store from '@/store';
export default {
  name: 'PrescGroup',
  components: {
    Label
  },
  props: {
    groupData: {
      type: Object,
      required: true
    },
    setting: {
      type: Object,
      required: true
    },
    house: {
      type: Boolean,
      default: false
    }
  },
  data() {
    return {
      medicine: [],
      pres: null,
      lastWidth: 0,
      heightWhenMove: 0,
      medicinesHeight: ''
    };
  },
  created() {
    let meds = this.groupData.medPrescList || [];
    this.medicine = meds;
  },
  mounted() {
    // if (!this.house && this.adjustStyle) this.showPrescrptionForDevelopment();
    this.getMedicinesHeight();
  },
  methods: {
    showPrescrptionForDevelopment() {
      let id = 'prescription_container';
      let outer = document.getElementById(id);
      if (outer) {
      } else {
        outer = document.createElement('div');
        let inner = document.createElement('div');
        outer.id = id;
        outer.style.position = 'absolute';
        // console.log(e);
        outer.style.left = 50 + 10 + 'px';
        outer.style.top = 50 + 'px';
        outer.style.zIndex = 99;
        outer.appendChild(inner);
        document.body.appendChild(outer);
        this.pres && this.pres.destroy && this.pres.destroy();
        this.pres = new Vue({
          render: h => h(Prescription, { props: { presData: this.medicine } })
        }).$mount(inner);
      }
    },
    handleMouseenter(e) {
      let id = 'prescription_container';
      let outer = document.createElement('div'),
        inner = document.createElement('div');
      outer.id = id;
      outer.style.position = 'absolute';
      // console.log(e);
      outer.style.left = e.pageX + 10 + 'px';
      outer.style.top = e.pageY + 'px';
      outer.style.zIndex = 2023;
      outer.appendChild(inner);
      document.body.appendChild(outer);
      this.pres && this.pres.destroy && this.pres.destroy();
      this.pres = new Vue({
        store,
        render: h => h(Prescription, { props: { presData: this.medicine, medPrescNo: this.groupData.medPrescNo }, on: { setH: this.setHeightWM } })
      }).$mount(inner);
      // console.log(this.pres);
    },
    handleMousemove(e) {
      let dom = document.getElementById('prescription_container');
      // console.log(dom);

      if (!dom) return;
      let width = dom.offsetWidth;
      // console.log(width);

      if (width + e.pageX > document.documentElement.clientWidth) {
        dom.inEdge = true;
      } else {
        dom.inEdge = false;
      }
      if (dom.inEdge) {
        dom.style.left = e.pageX - width - 10 + 'px';
      } else {
        dom.style.left = e.pageX + 10 + 'px';
      }
      dom.style.top = e.pageY + 10 - this.heightWhenMove + 'px';
      this.lastWidth = width;
    },
    handleMouseleave() {
      if (false) return;
      // 移除处方便笺
      let dom = document.getElementById('prescription_container');
      this.pres.$destroy();
      document.body.removeChild(dom);
    },
    setHeightWM(height) {
      this.heightWhenMove = height;
    },
    getMedicinesHeight() {
      let m = this.$refs.li_medicine_in_medicines;
      this.$nextTick(() => {
        if (!m) return;
        let h = m[0].offsetHeight;
        this.medicinesHeight = (h * 3) + 'px';
      })
    }
  }
};
</script>

<style lang="scss" scoped>
.prescGroup {
  .medicines {
    height: 75px;
    margin-bottom: 5px;
    background-color: rgba(0, 162, 255, 0.411);
    box-shadow: 1px 1px 1px rgba(0, 0, 0, 0.3);
    overflow: hidden;
  }
  .medicine {
    display: block;
  }
}
</style>
