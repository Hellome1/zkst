<template>
  <div class="step">
    <hos-steps class="elStepContainer" :active="2" align-center>
      <hos-step class="elStep" title="生殖平台患者的初次标记（平台标记）" description="..."></hos-step>
      <hos-step class="elStep" title="门诊复查" description="..."></hos-step>
      <hos-step class="elStep" title="入院时间（开入院证）" description="..."></hos-step>
      <hos-step class="elStep" title="出院时间" description="..."></hos-step>
      <hos-step class="elStep" title="生殖医学科开建档申请单" description="..."></hos-step>
      <hos-step class="elStep" title="取卵时间（B超下采卵术）" description="..."></hos-step>
      <hos-step class="elStep" title="移植时间 （胚胎移植术）" description="..."></hos-step>
      <hos-step class="elStep" title="（新增一个怀孕标记）" description="..."></hos-step>
      <hos-step class="elStep" title="产科建档" description="..."></hos-step>
      <hos-step class="elStep" title="分娩" description="..."></hos-step>
    </hos-steps>
  </div>
</template>

<script>
export default {
  components: {},
  props: {},
  data() {
    return {};
  },
  watch: {},

  mounted() {},

  created() {},

  computed: {},

  methods: {}
};
</script>
<style lang="scss">
.elStepContainer {
  background-color: white;
  .elStep {
    .hos-step__head {
      .hos-step__icon {
        width: 20px;
        height: 20px;
        font-size: 12px;
      }
    }
    .hos-step__main {
      .hos-step__title {
        font-size: 12px;
      }
    }
  }
}
</style>
