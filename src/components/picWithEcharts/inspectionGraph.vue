<template>
  <div>
    <header>
      <slot name="toolbar" :option="option"> </slot>
      <div class="insp-graph-main_title">
        <slot name="title">
          {{ defaultName }}
        </slot>
      </div>
      <div class="insp-graph-sub_title">
        <slot name="subtitle"></slot>
      </div>
    </header>
    <main>
      <div id="insp-graph-container" ref="graph" v-if="!intable"></div>
      <el-table :data="processItem" border v-if="usedTableData.length > 0">
        <el-table-column :show-overflow-tooltip="true" width="200" header-align="left" align="center" :fixed="this.processTableData.length > 10">
          <template slot="header">
            <div class="ig-table_header">
              <div style="text-align: right">日期</div>
              <div>检验项</div>
            </div>
          </template>
          <template slot-scope="scope">
            {{ processItem[scope.$index] }}
          </template>
        </el-table-column>
        <el-table-column min-width="150" align="center" v-for="arr in processTableData" :key="arr[0]">
          <template slot="header">
            {{ arr[0].split(' ')[0] }}
            <br />
            {{ arr[0].split(' ')[1] }}
          </template>
          <template slot-scope="scope">
            {{ arr[1][scope.$index] === undefined ? '/' : arr[1][scope.$index] }}
          </template>
        </el-table-column>
      </el-table>
    </main>
  </div>
</template>

<script>
import * as echarts from 'echarts';
import dayjs from 'dayjs';

let allTimeRange = [];
export default {
  props: {
    defaultName: String,
    defaultValue: Array,
    lineData: {
      type: Array,
      default: function () {
        return [];
      }
    },
    tableData: {
      type: Array,
      default: function () {
        return [];
      }
    },
    intable: false,
    timeData: {
      type: Array,
      default: function () {
        return [];
      }
    },
    height: {
      type: Number,
      default: 600
    }
  },
  data() {
    return {
      inspGraph: null, // echarts实例
      // 基础的echarts option配置
      option: {
        legend: {
          show: true,
          width: '90%',
          type: 'plain',
          data: []
        },

        tooltip: {
          trigger: 'axis',
          axisPointer: {
            type: 'line',
            axis: 'x',
            snap: true,
            label: {
              show: false
            }
          },
          formatter: function (params) {
            let res = new Date(params[0].axisValue).toLocaleString() + '<br/>';
            for (let i = 0, l = params.length; i < l; i++) {
              if (params[i].seriesType === 'line') {
                res += params[i].marker + ' ' + params[i].seriesName + ' ' + params[i].value[1] + '<br/>';
              } else if (params[i].seriesType === 'scatter' && params[i].seriesName !== 'placeholder') {
                res += params[i].marker + ' ' + params[i].seriesName + '<br/>';
              }
            }

            allTimeRange.forEach(obj => {
              if (params[0].axisValue >= new Date(obj.data[0]).getTime() && params[0].axisValue <= new Date(obj.data[1]).getTime()) {
                res +=
                  '<span style="display:inline-block;margin-right:4px;width:10px;height:10px;background-color:#c9e3fabd;"></span>' +
                  ' ' +
                  obj.name +
                  (params[0].axisValue === new Date(obj.data[0]).getTime() ? ' 开始' : params[0].axisValue === new Date(obj.data[1]).getTime() ? ' 结束' : '') +
                  '<br/>';
              }
            });
            return res;
          }
        },

        toolbox: {
          feature: {
            saveAsImage: {
              iconStyle: {
                borderColor: 'rgba(255, 123, 0, 1)',
                borderWidth: 1.5
              },
              emphasis: {
                iconStyle: {
                  // textPosition: 'left',
                  textAlign: 'right'
                }
              }
            }
          }
        },

        xAxis: {
          type: 'time',
          axisLabel: {
            show: true
          },
          minInterval: 1000,
          scale: true,

          splitLine: {
            show: false
          }
        },

        yAxis: [
          {
            type: 'category',
            data: [],
            axisLabel: {
              width: 100,
              align: 'right',
              overflow: 'break'
            },
            axisLine: {
              show: false
            },
            axisTick: {
              show: false
            },
            splitLine: {
              show: true
            }
          },
          {
            type: 'value',
            axisLine: {
              show: true
            },
            splitLine: {
              show: false
            }
          }
        ],

        dataZoom: [
          {
            type: 'slider',
            xAxisIndex: [0],
            filterMode: 'weakFilter'
          },
          {
            type: 'slider',
            yAxisIndex: [1],
            filterMode: 'none'
          }
        ],

        series: []
      },
      // 处理后的talbeData
      processTableData: [],
      processItem: [],

      // slot中的其他属性设置
      graphOption: {
        range: [],
        showNum: true,
        showRange: true
      },
      // 坐标起始值和结束值
      startValue: 0,
      endValue: 0,
      // 使用的tableData
      usedTableData: [],
      // 表格日期范围
      tableDateRange: null
    };
  },

  computed: {
    graphHeight() {
      let height = this.height;
      let length = this.option.series.filter(obj => {
        return obj.type !== 'line';
      }).length;

      return height > length * 100 ? height : length * 75;
    }
  },
  watch: {
    lineData: {
      handler(val) {
        this.generateLineOption(val);

        this.inspGraph.setOption(this.option, true);
        let startValue = this.inspGraph.getModel().option.dataZoom[0].startValue;
        this.endValue = this.inspGraph.getModel().option.dataZoom[0].endValue;
      }
    },
    timeData: {
      handler(val) {
        this.generateTimeOptionTest(val);
        console.log('执行变化函数');
        this.inspGraph.setOption(this.option, true);
        this.startValue = this.inspGraph.getModel().option.dataZoom[0].startValue;
        this.endValue = this.inspGraph.getModel().option.dataZoom[0].endValue;
      }
    },

    tableData: {
      handler(val) {
        // console.log(val);
        this.changeTableFilter();
        this.generateTableData(this.usedTableData);
      }
    },

    graphHeight: {
      handler(val) {
        let container = this.$refs.graph;
        container.style.height = val + 'px';

        this.inspGraph.resize({
          height: val
        });
        this.inspGraph.setOption(this.option, true);
      }
    },

    intable: function (n) {
      if (!n) {
        this.$nextTick(() => {
          this.initcanvas();
        });
      }
    },

    tableDateRange: function () {
      this.changeTableFilter();
      this.generateTableData(this.usedTableData);
    }
    // graphOption: {
    // 	handler(val) {
    // 		console.log(1);
    // 	},
    // },
  },
  methods: {
    // 生成折线的配置
    generateLineOption(arr) {
      // 清除除了默认数据(如果存在默认数据)外的折线series和 legend
      this.option.series = this.option.series.filter(obj => {
        if (obj.type === 'line' && obj.name !== this.defaultName) {
          let index = this.option.legend.data.indexOf(obj.name);
          this.option.legend.data.splice(index, 1);
          return false;
        } else {
          return true;
        }
      });

      arr.forEach(obj => {
        if (this.defaultName) {
          this.option.legend.data.splice(1, 0, obj.name);
        } else {
          this.option.legend.data.unshift(obj.name);
        }

        this.option.series.push({
          name: obj.name,
          type: 'line',
          symbol: 'circle',
          smooth: true,
          yAxisIndex: 1,
          label: {
            show: true,
            position: 'top',
            fontWeight: 'bold'
          },
          data: obj.data
        });
      });
    },

    // 生成时间点和时间段的配置
    // 这个方法使用 series: type: custom
    /**
     * 传入数据格式
     * [
     * 	{
     * 		type: 'scatter' | 'bar',
     * 		name: String,
     * 		data: [],
     * 	}
     * ]
     */
    generateTimeOptionTest(arr) {
      allTimeRange.length = 0;

      this.option.yAxis[0].data = [];
      let i = 0;
      this.option.series = this.option.series.filter(obj => {
        if (obj.type === 'line') {
          i++;
          return true;
        } else {
          return false;
        }
      });
      this.option.legend.data.splice(i + 1);

      const legendSet = new Set(); // 防止legend重复
      const scatterMap = new Map();
      const customMap = new Map();

      // 存储不可见点的位置
      let index = 0;
      for (let i = 0; i < arr.length; i++) {
        let obj = arr[i];
        legendSet.add(obj.name);
        if (obj.type === 'scatter') {
          if (scatterMap.has(obj.name)) {
            this.option.series[scatterMap.get(obj.name)].data.push([obj.data, obj.name]);
          } else {
            scatterMap.set(obj.name, this.option.series.length);
            this.option.series.push({
              type: 'scatter',
              name: obj.name,
              symbol: 'circle',
              yAxisIndex: 0,
              symbolSize: 15,
              itemStyle: {
                color: 'rgba(0,0,0,0.5)'
              },
              data: [[obj.data, obj.name]]
            });
          }
        } else {
          if (allTimeRange.length) {
            this.option.series[index].data.push([obj.data[1], obj.name]);
          } else {
            index = this.option.series.length;
            // 为了交互, 添加一组不可见的点:
            this.option.series.push({
              type: 'scatter',
              name: 'placeholder',
              symbolSize: 0,
              emphasis: {
                disabled: true
              },
              data: [[obj.data[1], obj.name]]
            });
          }
          allTimeRange.push(obj);
          if (customMap.has(obj.name)) {
            this.option.series[customMap.get(obj.name).seriesIndex].data[0].push(...obj.data);
            let x = this.option.series[customMap.get(obj.name).seriesIndex].encode.x;
            x.push(x.length + 1, x.length + 2);
            this.option.series[index].data.push([obj.data[0], obj.name], [obj.data[1], obj.name]);
          } else {
            customMap.set(obj.name, {
              seriesIndex: this.option.series.length,
              legendIndex: legendSet.size - 1
            });
            this.option.series.push({
              name: obj.name,
              type: 'custom',
              clip: true,
              renderItem: function (params, api) {
                let yAxisIndex = api.value(0);
                let height = api.size([0, 0])[1] * 0.3;
                let children = [];
                let i = 1;
                while (!isNaN(api.value(i))) {
                  let start = api.coord([api.value(i), yAxisIndex]);

                  let width = api.size([api.value(i + 1) - api.value(i), yAxisIndex])[0];
                  children.push({
                    type: 'rect',
                    shape: {
                      x: start[0],
                      y: start[1] - height / 2,
                      height: height,
                      width: width
                    },
                    style: {
                      fill: '#c9e3fabd'
                    }
                  });
                  i += 2;
                }
                return {
                  type: 'group',
                  children: children
                };
              },
              encode: {
                x: [1, 2],
                y: [0]
              },
              yAxisIndex: 0,
              data: [[legendSet.size - 1, ...obj.data]]
            });
          }
        }
      }
      if (legendSet.size > 4) {
        this.option.legend.type = 'scroll';
      } else {
        this.option.legend.type = 'plain';
      }
      this.option.legend.data.push(
        ...[...legendSet].map(val => {
          return {
            name: val,
            icon: 'rect',
            itemStyle: {
              color: '#c9e3fabd'
            }
          };
        })
      );

      this.option.yAxis[0].data.push(...legendSet);
    },

    /**
     * 传入的数据为
     * [
     * 	name: string,
     *  data: [
     * 		{
     * 			date: String,
     * 			value: String,
     * 		},
     * 	 ]
     * ]
     */
    generateTableData(arr) {
      // 先记录相同时间下的数值
      let timeMap = new Map();

      this.processItem = [];
      arr.forEach((obj, index) => {
        this.processItem.push(obj.name);
        obj.data?.forEach(arr => {
          if (!timeMap.has(arr[0])) {
            timeMap.set(arr[0], []);
          }
          timeMap.get(arr[0])[index] = arr[1];
        });
      });

      this.processTableData = Array.from(timeMap).sort((a, b) => {
        return Date.parse(a[0]) - Date.parse(b[0]);
      });
    },

    // 时间段参数生成, 此时传入的应该是已经处理好的数组,
    // 每个元素为以下格式的对象
    /**
     * {
     *  name: 该时间段的用药名称,
     *  data: [[startTime, endTime]], 将同种用药转为已经转化为毫秒数的时间段的起始和结束时间的二维数组,
     * }
     * */
    // generateTimeOption(arr) {
    // 	// 删除之前所有的时间点和时间段配置以及legend和yAxis
    // 	this.option.yAxis[0].data = [];
    // 	let i = 0;
    // 	this.option.series = this.option.series.filter((obj) => {
    // 		if (obj.type === 'line') {
    // 			i++;
    // 			return true;
    // 		} else {
    // 			return false;
    // 		}
    // 	});
    // 	this.option.legend.data.splice(i + 1);

    // 	const legendSet = new Set(); // 防止legend重复
    // 	const scatterMap = new Map();
    // 	const barMap = new Map(); // 记录每个bar在当前层级的位置
    // 	let layer = [];
    // 	for (let i = 0; i < arr.length; i++) {
    // 		let obj = arr[i];
    // 		legendSet.add(obj.name);
    // 		if (obj.type === 'scatter') {
    // 			if (scatterMap.has(obj.name)) {
    // 				this.option.series[scatterMap.get(obj.name)].data.push([
    // 					obj.data,
    // 					obj.name,
    // 				]);
    // 			} else {
    // 				scatterMap.set(obj.name, this.option.series.length);
    // 				this.option.series.push({
    // 					type: 'scatter',
    // 					name: obj.name,
    // 					symbol: 'rect',
    // 					yAxisIndex: 0,
    // 					symbolSize: 30,
    // 					data: [[obj.data, obj.name]],
    // 				});
    // 			}
    // 		} else {
    // 			// 如果是已有的数据
    // 			if (barMap.has(obj.name)) {
    // 				let lastLayer = barMap.get(obj.name).layer;
    // 				let lastVal = new Date(barMap.get(obj.name).lastVal).getTime();
    // 				if (lastVal > new Date(obj.data[0]).getTime()) {
    // 					console.log('超过');
    // 					break;
    // 				}
    // 				console.log('lastVal: ', lastVal);
    // 				// 判断层级, 如果该层级不存在
    // 				if (!layer[barMap.get(obj.name).layer + 1]) {
    // 					this.option.series.push(
    // 						{
    // 							type: 'bar',
    // 							stack: 'all',
    // 							colorBy: 'data',
    // 							yAxisIndex: 0,
    // 							itemStyle: {
    // 								borderColor: 'transparent',
    // 								color: 'transparent',
    // 							},
    // 							emphasis: {
    // 								itemStyle: {
    // 									borderColor: 'transparent',
    // 									color: 'transparent',
    // 								},
    // 							},
    // 							// 此时数据为当前结束值减去之前的endDate
    // 							data: [[obj.data[0] - lastVal, obj.name]],
    // 							barWidth: 40,
    // 						},
    // 						{
    // 							type: 'bar',
    // 							colorBy: 'data',
    // 							stack: 'all',
    // 							yAxisIndex: 0,

    // 							data: [[obj.data[1] - obj.data[0], obj.name]],
    // 						}
    // 					);
    // 					layer[lastLayer + 1] = this.option.series.length - 2;
    // 				} else {
    // 					// 如果存在该层级
    // 					this.option.series[layer[lastLayer + 1]].data.push([
    // 						obj.data[0] - lastVal,
    // 					]);
    // 					this.option.series[layer[lastLayer + 1] + 1].data.push([
    // 						obj.data[1] - obj.data[0] + lastVal,
    // 						obj.name,
    // 					]);
    // 				}
    // 				barMap.set(obj.name, {
    // 					layer: lastLayer + 1,
    // 					lastVal: obj.data[1],
    // 				});
    // 			} else {
    // 				// 如果是新数据
    // 				// 判断是否已经存在该层
    // 				if (!layer[0]) {
    // 					this.option.series.push(
    // 						{
    // 							type: 'bar',
    // 							stack: 'all',
    // 							colorBy: 'data',
    // 							yAxisIndex: 0,
    // 							itemStyle: {
    // 								borderColor: 'transparent',
    // 								color: 'transparent',
    // 							},
    // 							emphasis: {
    // 								itemStyle: {
    // 									borderColor: 'transparent',
    // 									color: 'transparent',
    // 								},
    // 							},
    // 							data: [[obj.data[0], obj.name]],
    // 							barWidth: 40,
    // 						},
    // 						{
    // 							type: 'bar',
    // 							colorBy: 'data',
    // 							stack: 'all',
    // 							yAxisIndex: 0,
    // 							data: [[obj.data[1] - obj.data[0], obj.name]],
    // 						}
    // 					);
    // 					barMap.set(obj.name, {
    // 						layer: 0,
    // 						index: 0,
    // 						lastVal: obj.data[1],
    // 					});
    // 					// 记录当前层级在series中的位置
    // 					layer[0] = this.option.series.length - 2;
    // 				} else {
    // 					this.option.series[layer[0]].data.push([obj.data[0], obj.name]);
    // 					this.option.series[layer[0] + 1].data.push([
    // 						obj.data[1] - obj.data[0],
    // 						obj.name,
    // 					]);
    // 					// 记录该项用药在当前的层级中的位置
    // 					barMap.set(obj.name, {
    // 						layer: 0,
    // 						lastVal: obj.data[1],
    // 					});
    // 				}
    // 			}
    // 		}
    // 	}
    // 	this.option.legend.data.push(...legendSet);
    // 	this.option.yAxis[0].data.push(...legendSet);
    // },

    // 改变option的方法, 用于修改max-min, showNum(显示数值), showRange(显示范围)
    changeOption(obj) {
      this.graphOption = Object.assign(this.graphOption, obj);
      // this.option.series.forEach((obj) => {
      // 	if (obj.type === 'line') {
      // 		obj.legend.show = this.inspGraph.showNum;
      // 	}
      // });
      if (this.graphOption.range) {
        this.option.xAxis.min = this.graphOption.range[0];
        this.option.xAxis.max = this.graphOption.range[1];
      } else {
        delete this.option.xAxis.min;
        delete this.option.xAxis.max;
      }
      this.inspGraph.setOption(this.option, true);
    },
    setTableDateRange(dateRange) {
      this.tableDateRange = dateRange;
    },
    changeTableFilter() {
      let dateRange = this.tableDateRange,
        tableData = JSON.parse(JSON.stringify(this.tableData));
      if (!dateRange) {
        this.usedTableData = tableData;
        return;
      }
      this.usedTableData = tableData.map(t => {
        t.data = t.data.filter(d => dayjs(d[0]).diff(dateRange[0], 'day') >= 0 && dayjs(d[0]).diff(dateRange[1], 'day') <= 0);
        return t;
      });
      console.log(this.usedTableData);
    },

    initcanvas() {
      let container = this.$refs.graph;
      container.style.height = this.height + 'px';
      container.style.weight = container.clientWidth - 40 + 'px';
      container.style.padding = '20px';
      this.inspGraph = echarts.init(container);

      if (this.defaultName) {
        this.option.series.push({
          name: this.defaultName,
          type: 'line',
          symbol: 'circle',
          smooth: true,
          yAxisIndex: 1,
          label: {
            show: true,
            position: 'top',
            fontWeight: 'bold'
          },
          data: this.defaultValue
        });
        this.option.legend.data.push(this.defaultName, '');
      }

      if (this.lineData.length > 0) {
        this.generateLineOption(this.lineData);
      }

      if (this.timeData.length > 0) {
        this.generateTimeOptionTest(this.timeData);
      }

      if (this.usedTableData.length > 0) {
        this.generateTableData(this.usedTableData);
      }

      this.inspGraph.setOption(this.option);
    }
  },
  mounted() {
    console.log(this.tableData);
    if (this.intable) return;
    this.initcanvas();
  }
};
</script>

<style>
.insp-graph-main_title {
  padding-top: 10px;
  font-size: 1.5em;
  text-align: center;
  font-weight: bolder;
}
.insp-graph-sub_title {
  padding-top: 5px;
  display: flex;
  justify-content: center;
}
.ig-table_header {
  background: linear-gradient(14deg, transparent, transparent 49%, grey 50%, transparent 51%, transparent 100%);
}
</style>
