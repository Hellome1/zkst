<template>
  <div class="crumbs_c">
    <div class="back" @click="goBack"><i class="fa fa-long-arrow-left"></i><span>返回</span></div>
    <!-- <p class="crumb" v-for="l in list" :key="l.value">{{ l.label }}</p> -->
  </div>
</template>

<script>
export default {
  name: 'Crumbs_c',
  props: {},
  data() {
    return {
      list: [
        { label: 'one', value: '1' },
        { label: 'two', value: '2' }
      ]
    };
  },
  created() {},
  methods: {
    goBack() {
      this.$emit('goBack');
    }
  }
};
</script>

<style lang="scss" scoped>
.crumbs_c {
  .back {
    font-size: 14px;
    display: inline-block;
    cursor: pointer;
    &:hover {
      color: #409eff;
    }
    span {
      font-size: 12px;
    }
  }
}
</style>