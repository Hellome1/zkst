<template>
  <div>
    <header>
      <slot name="title">
        <div class="insp-graph-title">
          <div class="insp-graph-main_title">{{ inspName }}</div>
        </div></slot
      >
      <slot name="toolbar" :option="option"> </slot>
      <slot name="subtitle" :option="option"></slot>
    </header>
    <main>
      <div id="insp-graph-container"></div>
    </main>
  </div>
</template>

<script>
import * as echarts from 'echarts';

let allTimeRange = [];
export default {
  props: {
    inspName: String,
    inspValue: Array,
    otherLineData: Array,
    otherTimeData: Array,
    height: Number
  },
  data() {
    return {
      inspGraph: null, // echarts实例
      // 基础的echarts option配置
      option: {
        legend: {
          show: true,
          type: 'scroll',
          width: '90%',
          data: ['']
        },

        tooltip: {
          trigger: 'axis',
          // alwaysShowContent: true,
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
                  '<span style="display:inline-block;margin-right:4px;width:10px;height:10px;background-color:rgba(0,0,0,0.5);"></span>' +
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
          // show: true,
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
            axisTick: {
              show: true,
              alignWithLabel: true
            },
            splitLine: {
              show: true
            }
          },
          {
            type: 'value',
            splitLine: {
              show: false
            }
          }
        ],
        dataZoom: [
          {
            type: 'slider',
            xAxisIndex: [0],
            filterMode: 'weakFilter',
            labelFormatter(val) {
              return new Date(val).toLocaleString();
            }
          },
          {
            type: 'slider',
            yAxisIndex: [1],
            filterMode: 'none'
          }
        ]
      },
      // slot中的其他属性设置
      garphOption: {
        range: [],
        showNum: true,
        showRange: true
      }
    };
  },
  watch: {
    otherLineData: {
      handler(val) {
        this.generateLineOption(val);
        this.inspGraph.setOption(this.option, true);
      }
    },
    otherTimeData: {
      handler(val) {
        this.generateTimeOptionTest(val);
        this.inspGraph.setOption(this.option, true);
      }
    },
    garphOption: {
      handler(val) {
        console.log(1);
      }
    }
  },
  methods: {
    // 生成折现的函数的配置
    generateLineOption(arr) {
      // 清除除了默认数据的外的折线series和 legend
      this.option.series = this.option.series.filter(obj => {
        if (obj.type === 'line' && obj.name !== this.inspName) {
          let index = this.option.legend.data.indexOf(obj.name);
          this.option.legend.data.splice(index, 1);
          return false;
        } else {
          return true;
        }
      });

      arr.forEach(obj => {
        this.option.legend.data.splice(1, 0, obj.name);
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
      console.log(arr);
      console.log(JSON.parse(JSON.stringify(this.option)));
    },

    // 这个方法使用 series: type: custom
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
      // this.option.legend.data.splice(i + 1);

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
                // console.log(api.value(i));
                // console.log(isNaN(api.value(i)));
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
                  // console.log('test', api.value(10));
                  // console.log('isNaN', api.value(i), isNaN(api.value(i)));
                }
                console.log(children);
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
      // if (legendSet.size > 4) {
      //   this.option.legend.type = 'scroll';
      // } else {
      //   this.option.legend.type = 'plain';
      // }
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

      console.log(JSON.parse(JSON.stringify(this.option)));
      this.option.yAxis[0].data.push(...legendSet);
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
      this.garphOption = Object.assign(this.garphOption, obj);
      // this.option.series.forEach((obj) => {
      // 	if (obj.type === 'line') {
      // 		obj.legend.show = this.inspGraph.showNum;
      // 	}
      // });
      if (this.garphOption.range) {
        this.option.xAxis.min = this.garphOption.range[0];
        this.option.xAxis.max = this.garphOption.range[1];
      } else {
        delete this.option.xAxis.min;
        delete this.option.xAxis.max;
      }
      this.inspGraph.setOption(this.option, true);
    }
  },
  mounted() {
    console.log('mounted-----', this.height);
    let container = document.getElementById('insp-graph-container');
    container.style.height = this.height + 'px';
    container.style.weight = container.clientWidth - 40 + 'px';
    container.style.padding = '20px';
    this.inspGraph = echarts.init(container);

    // 配置tooltip
    // this.inspGraph.on('showTip', (params) => {
    // 	console.log(params);
    // 	xAxisValue = params.dataByCoordSys[0].dataByAxis[0].value;
    // });

    if (this.inspValue) {
      if (this.inspName) {
        this.option.series = [
          {
            name: this.inspName,
            type: 'line',
            symbol: 'circle',
            smooth: true,
            hello: 1,
            yAxisIndex: 1,
            label: {
              show: true,
              position: 'top',
              fontWeight: 'bold'
            },
            data: this.inspValue
          }
        ];
      } else {
        this.option.series = [];
      }
    }

    this.generateLineOption(this.otherLineData);
    this.generateTimeOptionTest(this.otherTimeData);
    this.inspGraph.setOption(this.option);
  }
};
</script>

<style>
.insp-graph-title {
  padding-top: 10px;
}
.insp-graph-main_title {
  font-size: 1.5em;
  text-align: center;
  font-weight: bolder;
}
.insp-graph-sub_title {
  display: flex;
  height: 20px;
  line-height: 20px;
  justify-content: center;
}
</style>
