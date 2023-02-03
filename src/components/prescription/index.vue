<template>
  <div class="prescription_container" id="prescription_container" :class="nocanvas ? '' : 'canvas'">
    <div v-if="nocanvas" class="main">
      <ul>
        <li v-for="(data, i) in datas" :key="i">
          {{ data.orderName }} {{ data.medicineDosage }} {{ data.medDosUnitDesc }} {{ data.ordCatDesc
          }}<span v-if="!unified"> {{ data.medDurDesc }} {{ data.medFreqDesc }}</span>
        </li>
      </ul>
      <div class="desc" v-if="unified">{{ datas[0].medDurDesc }} {{ datas[0].medFreqDesc }}</div>
    </div>
    <div class="prescCanvasContainer" ref="cont"></div>
    <!-- <canvas v-else id="prescriptionMedicine" width="400" height="660"></canvas> -->
  </div>
</template>

<script>
import { drawLittleGrid, setData, resetArr } from './index';
// import bus from '@/utils/bus';
import Prescription from './indexConstruction';
import { getArr } from './getArr';
export default {
  name: 'Prescription',
  props: {
    presData: {
      type: Array,
      default: function () {
        return [];
      }
    },
    presQuerys: {
      type: Array,
      default: function () {
        return [];
      }
    },
    presMaxNum: {
      type: Number,
      default: 50
    },
    medPrescNo: {
      type: String,
      default: '0'
    }
  },
  data() {
    return {
      datas: [],
      nocanvas: false,
      prescInfos: {}
    };
  },
  computed: {
    medicine: function () {
      if (this.datas.length === 0) return null;
      let datas = this.datas,
        targetArr = [];
      datas.forEach(data => {
        let target = '';
        target += data.orderName + ' ' + '<m>' + data.orderQuantity + ' ' + data.ordCatDesc + ' ' + data.medicineDosage + ' ' + data.medDosUnitDesc + ' ';
        target += this.unified ? '</m>' : data.medDurDesc + ' ' + data.medFreqDesc + '</m>';
        targetArr.push(target);
      });
      return targetArr;
    },
    frequency: function () {
      if (this.datas.length === 0) return null;
      let datas = this.datas,
        data = datas[0],
        target = data.medDurDesc + ' ' + data.medFreqDesc;
      target = this.unified ? target : '';
      return target;
    },
    unified: function () {
      let datas = this.datas;
      if (datas.length > 0) {
        let last = datas[0];
        for (let i = 1; i < datas.length; i++) {
          let d = datas[i];
          if (d.medDurDesc != last.medDurDesc || d.medFreqDesc != last.medFreqDesc) {
            return false;
          }
          last = d;
        }
      }
      return true;
    },
    patient: function() {
      return this.$store && this.$store.state.patientInfo;
    },
    visitsInfo: function() {
      return this.$store && this.$store.state.visitsInfo;
    }
  },
  beforeDestroy() {
    resetArr();
  },
  created() {
    if (this.presData.length > 0) {
      this.datas = this.presData;
    }
    if (this.nocanvas) {
      this.$emit('setH', 0);
    } else {
      this.$emit('setH', 160);
    }
  },
  mounted() {
    // bus.$emit('setEncInfo', this.datas[0].hdcEncId);
    // let prescInfos = {
    //   medicine: this.medicine,
    //   frequency: this.frequency,
    //   medPrescNo: this.medPrescNo,
    //   ordDocName: this.datas[0].ordDocName
    // };
    // setData(prescInfos);
    // bus.setInfosForPrescription(prescInfos);
    let visitArr = this.visitsInfo.filter(v => v.hdcEncId === this.datas[0].hdcEncId);
    let visit = visitArr.length ? visitArr[0] : {};
    let prescInfos = {
      medicine: this.medicine,
      frequency: this.frequency,
      medPrescNo: this.medPrescNo,
      ordDocName: this.datas[0].ordDocName,
      age: this.patient.age,
      name: this.patient.name,
      gender: this.patient.gender,
      encStartDate: visit.encStartDate,
      encDeptName: visit.encDeptName,
      diagnoseName: visit.diagnoseName,
      hdcEncId: visit.hdcEncId
    };
    if (!this.nocanvas) this.draw1(prescInfos);
  },
  methods: {
    // fetchData() {
    //   let qs = this.presQuerys,
    //     maxNum = this.presMaxNum;
    //   let param = {
    //     ordPrescList: qs,
    //     ordPrescNum: maxNum
    //   };
    //   getPrescriptionInfo(param).then(res => {
    //     if (res.data[0] && res.data[0].medPrescList) {
    //       this.datas = res.data;
    //     }
    //   });
    // },
    // draw() {
    //   let canv = document.getElementById('prescriptionMedicine');
    //   canv.dynamic = false;
    //   drawLittleGrid(canv, false);
    // },
    draw1(infos) {
      let cont = this.$refs.cont;
      // let infos = this.prescInfos;
      let arr = getArr(infos);
      let canvs = Prescription(arr);
      cont.innerHTML = '';
      cont.appendChild(canvs);
    }
  }
};
</script>

<style lang="scss" scoped>
@import './index.scss';
</style>
