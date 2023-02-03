var setting = {
  hdcurl: 'http://192.178.61.87:9091/emviewdoctor/hdc/SerachQuery/',
  ms_url: 'http://192.178.61.87:8002/emr/',
  ms_hdcurl: 'http://192.178.61.87:8002/emr/dc/',
  emr_url: 'http://192.178.61.153:9026/emr_switch/emrSwitch/HosDocumentRetrieve',
  emr_docurl: 'http://192.178.61.153:9026/emr_switch/emrSwitch/HosDocumentSearch',
  jcsturl: 'http://192.178.61.153/EMR/emrviewdoctor/html/index.html',
  layout: {
    span: 'medium',
    leftW: 5,
    rightW: 19,
    showDays: 7,
    leftBgColor: '#f9f9f9',
    moduleHeadFontSize: '16px',
    moduleHeadColor: '#000',
    // label: {
    //   labelClassPaddingTop: '1px',
    //   pStyle: {
    //     height: '22px',
    //     lineHeight: '22px'
    //   }
    // }
  },
  header: {
    hosInfo: {
      hosName: '华西第二医院生殖内分泌科专科视图',
      product: 'iMedical PatView',
      hosLogo: '@/assets/img/hosLogo.png'
    },
    toggleMenu: [
      {
        desc: '患者全息视图',
        href: 'http://192.178.61.153/EMR/emrviewdoctor/html/index.html'
      }
    ],
    toolbarMenu: []
  },
  needStep: false,
  lockTlVisit: false,
  allType: [
    { codes: ['O'], desc: '门诊', ori: 'O' },
    { codes: ['E'], desc: '急诊', ori: 'E' },
    { codes: ['I'], desc: '住院', ori: 'I' },
    { codes: ['H'], desc: '体检', ori: 'H' }
  ],
  encStatus: [
    { code: 'A', ori: 'A' },
    { code: 'C', ori: 'C' },
    { code: 'D', ori: 'D' }
  ],
  timeline: {
    topBgColor: '#f9f9f9',
    bottomBgColor: '#ffffff',
    fontSize: '12px'
  },
  displayModules: ['crucialIndicator', 'surgery', 'medicalOrder', 'lisnorm', 'pacs', 'lis', 'emr', 'consul'], // 总的模块选项
  displayModules_zkst: ['crucialIndicator', 'surgery', 'medicalOrder', 'lisnorm', 'pacs', 'lis', 'emr', 'consul'], // 显示的模块
  viewModeSetting: {
    normal: {
      meds: [],
      lis: []
    },
    su: {
      meds: [],
      lis: []
    },
    blood: {
      meds: [],
      lis: []
    }
  },
  modules: {
    crucialIndicator: {
      title: '重要指标',
      path: 'pages/crucialIndicator/index.vue',
      className: ['crucialIndicator'],
      name: 'crucialIndicator',
      maxSelectedNum: 10,
      // viewModes: [
      //   {
      //     name: '糖尿病',
      //     lisOptions: [],
      //     medOptions: []
      //   },
      //   {
      //     name: '血液',
      //     lisOptions: [],
      //     medOptions: []
      //   }
      // ]
    },
    medicalOrder: {
      title: '用药医嘱',
      path: 'pages/medicalOrder/medicalOrder.vue',
      className: ['medicalOrder'],
      name: 'medicalOrder',
      vagueItems: false, // 模糊item设置，模糊会覆盖包含模式
      includeMode_items: false, // items>code包含模式
      items: [
        {
          desc: '临时医嘱',
          code: ['NORM'],
          display: 'list'
        },
        {
          desc: '用药医嘱(即刻)',
          code: ['STAT'],
          display: 'list'
        },
        {
          desc: '取药医嘱',
          code: ['ONE'],
          display: 'list'
        },
        {
          desc: '长期医嘱',
          code: ['S'],
          isLong: true,
          display: 'list'
        },
        {
          desc: '用药医嘱(长期)',
          code: ['OMST'],
          isLong: true,
          display: 'list'
        }
      ],
      labelConfig: {
        title: 'orderName',
        name: 'orderName', // 必选，data中标签显示内容的key
        showDetail: true,
        config: {
          eleConfig: {
            isArrow: false,
            isIcon: false
          },
          pStyle: {
            textAlign: 'center'
          }
        }
      }
    },
    pacs: {
      title: '检查',
      name: 'pacs',
      path: 'pages/pacs/pacs.vue',
      className: ['pacs'],
      leftKey: 'examDeptName', // 左侧选框在data中的key
      rightKey: 'examItemName',
      // 配置用到的标签信息及样式
      labelConfig: {
        title: 'examItemName',
        name: 'examItemName', // 必选，data中标签显示内容的key
        showDetail: true,
        loopInfo: {
          ensLogId: 'ensLogId',
          ensSystemCode: 'RIS'
        },
        config: {
          eleConfig: {
            isArrow: false,
            isIcon: false
          },
          pStyle: {
            backgroundColor: '#7ab5d9',
            border: '1px solid #7ab5d9',
            textAlign: 'center'
          }
        },
        popUpWindow: {
          title: 'examItemName',
          subCol: 1,
          style: 1,
          subTitles: ['检查号|examId', '检查科室|examDeptName', '检查医生|examDocName', '检查日期|examDate', 'HIS医嘱号|ensLogId', '报告日期|examRptDate'],
          main: ['检查所见|examSymptom', '诊断建议|diagnoseComments'],
          // 二次弹窗，包含二次弹窗所需的全部信息，只在style=1下开放
          popTwo: {
            oriRpt: [
              {
                conditions: ['心电'],
                conditionKey: '{examDeptName}',
                iframeUrl: 'http://192.178.61.215/MedexECgwebsetup/buss/patientbyoneself.aspx?repno={hosOrdId}',
                src: '{examRptPath}'
              },
              {
                conditions: ['病理', '超声', '胃肠镜', '放射'],
                conditionKey: '{examDeptName}',
                iframeUrl: 'http://192.168.0.69:8090/cwp/ViewPatientInfoAction!viewPatient.xhtml?amp&his_uid={hosOrdId}',
                src: 'http://192.178.61.87:8002/emr/extra/examine?hosOrdId={hosOrdId}'
              }
            ],
            needPic: true,
            data: {
              examDeptName: '',
              hosOrdId: '',
              examRptPath: ''
            }
          }
        }
      }
    },
    lis: {
      title: '检验',
      name: 'lis',
      path: 'pages/lis/lis.vue',
      action: 'MES0046',
      className: ['lis'],
      leftKey: 'inspRptDeptName',
      rightKey: 'orderName',
      lisNormId: 'hdcInspRptId', // 请求数据用于传参的字段
      markAbno: true, // 是否标出异常
      // 用于检验表格字段显示
      lisNormGrid: {
        inspItemDesc: '项目名称',
        inspectionValue: '结果',
        inspResultUnitCode: '单位',
        inspResultRange: '参考范围',
        inspAbnoFlag: '异常标志'
      },
      // 表格中异常标志
      gridAbnormal: {
        key: 'inspAbnoFlag',
        rowBgColor: '#fff1f0',
        replaces: ['z|', 'h|↑', 'l|↓', 'ch|↑↑↑', 'cl|↓↓↓'],
        // replaces: ['N|', 'H|↑', 'L|↓', 'PH|↑↑↑', 'PL|↓↓↓'],
        flags: [
          {
            value: '↑',
            cellStyle: {
              color: '#e44b3b',
              fontSize: '18px',
              fontWeight: '900',
              textShadow: '1px 1px #aaa, -1px -1px #fff'
            }
          },
          {
            value: '↑↑↑',
            cellStyle: {
              color: '#e44b3b',
              fontSize: '18px',
              fontWeight: '900',
              textShadow: '1px 1px #aaa, -1px -1px #fff'
            }
          },
          {
            value: '↓',
            cellStyle: {
              color: '#3f51b5',
              fontSize: '18px',
              fontWeight: '900',
              textShadow: '1px 1px #aaa, -1px -1px #fff'
            }
          },
          {
            value: '↓↓↓',
            cellStyle: {
              color: '#3f51b5',
              fontSize: '18px',
              fontWeight: '900',
              textShadow: '1px 1px #aaa, -1px -1px #fff'
            }
          }
        ]
      },
      labelConfig: {
        title: 'orderName',
        name: 'orderName',
        contextmenu: showLisLoop,
        action: 'MES0047',
        handleLisN: handleLisN,
        ownAbnoItem: {
          key: 'ownAbnoItem',
          color: 'rgba(255, 60, 0, 0.8)'
        },
        popUpWindow: {
          title: 'orderName',
          subCol: 3,
          width: '80%',
          style: 2, // 为显示lis的字段
          maxSelectedNum: 10, // 最多选10条
          subTitles: [
            '报告号|hosInspRptId',
            '检验科室|inspRptDeptName',
            '检验医生|inspRptVerifyDocName',
            '检验样本|inspSpecmCode',
            '报告日期|inspRptVerifyDate',
            '报告时间|inspRptVerifyTime'
          ],
          main: [],
          popTwo: {
            lisData: {
              inspItemCode: '' // 检验里面需要带入的数据
            }
          }
        },
        config: {
          eleConfig: {
            isArrow: false,
            isIcon: false
          },
          pStyle: {
            backgroundColor: '#7ab5d9',
            border: '1px solid #7ab5d9',
            textAlign: 'center'
          }
        }
      }
    },
    lisnorm: {
      title: '检验指标',
      name: 'lisnorm',
      path: 'pages/lisnorm/lisnorm.vue',
      className: ['lisnorm'],
      labelConfig: {
        title: 'inspItemDesc',
        name: 'inspItemDesc',
        // popUpWindow: {
        //   title: 'examItemName',
        //   subCol: 2,
        //   subTitles: ['检查号|examId', '检查科室|examDeptName', '检查医生|examDocName', '检查日期|examDate', 'HIS医嘱号|ensLogId'],
        //   main: ['检查所见|examSymptom', '诊断建议|diagnoseComments']
        // },
        config: {
          eleConfig: {
            isArrow: false,
            isIcon: false
          },
          pStyle: {
            textAlign: 'center'
          }
        }
      }
    },
    surgery: {
      title: '手术信息',
      name: 'surgery',
      path: 'pages/surgery/surgery.vue',
      className: ['surgery'],
      labelConfig: {
        title: 'preOperDiagRemark',
        name: 'preOperDiagRemark',
        config: {
          eleConfig: {
            isArrow: false,
            isIcon: false
          },
          pStyle: {
            backgroundColor: '#7ab5d9',
            border: '1px solid #7ab5d9',
            textAlign: 'center',
            cursor: 'pointer'
          }
        }
      }
    },
    emr: {
      title: '电子病历',
      name: 'emr',
      path: 'pages/emr/emr.vue',
      className: ['emr'],
      labelConfig: {
        title: 'desc',
        name: 'desc',
        config: {
          eleConfig: {
            isArrow: false,
            isIcon: false
          },
          pStyle: {
            textAlign: 'center',
            cursor: 'pointer'
          }
        }
      }
    },
    consul: {
      title: '会诊',
      name: 'consul',
      path: 'pages/consul/consul.vue',
      className: ['consul'],
      leftKey: 'ecrLocDesc', // 左侧选框在data中的key
      rightKey: 'ensId',
      // 配置用到的标签信息及样式
      labelConfig: {
        title: 'consulDesc',
        name: 'consulDesc', // 必选，data中标签显示内容的key
        showDetail: true,
        config: {
          eleConfig: {
            isArrow: false,
            isIcon: false
          },
          pStyle: {
            backgroundColor: '#7ab5d9',
            border: '1px solid #7ab5d9',
            textAlign: 'center'
          }
        }
      }
    },
  }
};
