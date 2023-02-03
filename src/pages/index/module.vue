<script>
export default {
  render(h) {
    let { modules, layout } = setting;
    let listeners = this.$listeners;
    console.log(listeners);
    return h(
      'div',
      this.displayModules.map((m, i) => {
        let module = this.g_setting.modules[m];
        let comp = require('../../' + modules[m]['path']).default;
        return h(
          'hos-collapse-item',
          {
            props: { title: module.title, name: module.name, disabled: !!module.foldable },
            class: 'module-item ' + this.span + ' ' + module.className.join('')
          },
          [
            h(
              'template',
              {
                slot: 'title'
              },
              [h('h4', { class: 'module-title', style: { fontSize: layout.moduleHeadFontSize, color: layout.moduleHeadColor } }, module.title)]
            ),
            h(comp, {
              props: {
                setting: module
              },
              on: {
                listeners
              },
              class: 'zlowermask'
            })
          ]
        );
      })
    );
  },
  provide: {
    layout: setting.layout
  },
  props: {},
  data() {
    return {
      rest: [],
      dones: []
    };
  },
  watch: {},

  mounted() {},

  created() {},

  computed: {
    g_setting: function () {
      return this.$store.state.globalSetting.setting;
    },
    span: function () {
      return this.g_setting.layout && this.g_setting.layout.span;
    },
    displayModules: function () {
      return this.g_setting ? this.g_setting.displayModules_zkst : setting.displayModules;
    }
  },

  methods: {}
};
</script>
<style lang="css"></style>
