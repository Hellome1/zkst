<template>
  <div class="outerC">
    <Eltimeline>
      <template v-slot="slotProps">
        <h4 class="title">{{ slotProps.data.title }}</h4>
        <!-- <h4>{{ slotProps.data.desc }}</h4> -->
        <!-- <p>王小虎 提交于 2018/4/12 20:46</p> -->
        <div class="detailCon">
          <p>就诊类型：</p>
          <p>就诊状态：{{}}</p>
          <p>入院日期：{{}}</p>
          <p>出院日期：{{}}</p>
          <p>住院天数：{{}}</p>
          <p>科室： {{}}</p>
          <p>主要诊断：{{}}</p>
        </div>
      </template>
      <!-- <template v-slot:detail="slot">
        <div class="detailCon">
          <h4 class="title">{{ slot.data.title }}</h4>
          <p>就诊类型：</p>
          <p>就诊状态：{{}}</p>
          <p>入院日期：{{}}</p>
          <p>出院日期：{{}}</p>
          <p>住院天数：{{}}</p>
          <p>科室： {{}}</p>
          <p>主要诊断：{{}}</p>
        </div>
      </template> -->
    </Eltimeline>
  </div>
</template>

<script>
import Eltimeline from '@/components/elTimeline';
export default {
  components: {
    Eltimeline
  },
  data() {
    return {
      opt: {}
    };
  },
  beforeCreate() {},
  mounted() {}
};
</script>

<style lang="scss" scoped>
.outerC {
  overflow: hidden;
  .detailCon {
    // display: none;
    position: absolute;
    width: 200px;
    padding: 10px;
    background-color: RGB(242, 242, 242);
    border-radius: 3px;
    left: calc((100% - 220px - 40px) / 2 + 40px);
    top: 50px;
    z-index: 99;
    .visitType {
      font-weight: bold;
    }
  }
}
</style>
