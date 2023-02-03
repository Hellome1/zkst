var constructure_illustrate = {
  name: '配置名称',
  code: '英文名',
  order: '顺序',
  value: '配置值',
  scope: '选择范围',
  children: '子配置项'
};

var settingList = [
  {
    name: '显示设置',
    code: 'showSetting'
  },
  {
    name: '总体设置',
    code: 'generalSetting'
  },
  // {
  //   name: '重要指标',
  //   code: 'crucialIndicator'
  // },
  {
    name: '用药医嘱',
    code: 'medicalOrder'
  },
  {
    name: '检查',
    code: 'pacs'
  },
  {
    name: '检验',
    code: 'lis'
  },
  {
    name: '检验指标',
    code: 'lisnorm'
  },
  {
    name: '手术信息',
    code: 'surgery'
  },
  {
    name: '电子病历',
    code: 'emr'
  },
  {
    name: '会诊',
    code: 'consul'
  }
];

/* 以下数据需要接口 */
var showSetting = [
  {
    name: '重要指标',
    code: 'crucialIndicator',
    order: 1,
    scope: [false, true],
    value: true
  },
  {
    name: '用药医嘱',
    code: 'medicalOrder',
    order: 2,
    scope: [false, true],
    value: true
  },
  {
    name: '检查',
    code: 'pacs',
    order: 3,
    scope: [false, true],
    value: true
  },
  {
    name: '检验',
    code: 'lis',
    order: 4,
    scope: [false, true],
    value: true
  },
  {
    name: '检验指标',
    code: 'lisnorm',
    order: 5,
    scope: [false, true],
    value: true
  },
  {
    name: '手术信息',
    code: 'surgery',
    order: 6,
    scope: [false, true],
    value: true
  },
  {
    name: '电子病历',
    code: 'emr',
    order: 7,
    scope: [false, true],
    value: true
  },
  {
    name: '会诊',
    code: 'consul',
    order: 8,
    scope: [false, true],
    value: true
  }
];

var generalSetting = [
  {
    name: '布局',
    code: 'layout',
    value: '',
    children: [
      {
        name: '布局紧凑程度',
        code: 'span',
        value: 'medium'
      },
      {
        name: '展示天数',
        code: 'showDays',
        value: 7
      },
      {
        name: '标签',
        code: 'label',
        value: '',
        children: [
          {
            name: '标签间隙',
            code: 'labelClassPaddingTop',
            value: '4px'
          },
          {
            name: '标签高度',
            code: 'pStyle_height',
            value: '24px'
          }
        ]
      }
    ]
  },
  {
    name: '头部栏',
    code: 'header',
    value: '',
    children: [
      {
        name: '医院信息',
        code: 'hosInfo',
        value: '',
        children: [
          {
            name: '医院',
            code: 'hospiName',
            value: '华西第二医院'
          },
          {
            name: '科室',
            code: 'deptName',
            value: '生殖内分泌科'
          },
          {
            name: '图标',
            code: 'hosLogo',
            value: '@/assets/img/hosLogo.png'
          }
        ]
      },
      {
        name: '切换菜单',
        code: 'toggleMenu',
        value: '',
        children: [
          {
            name: '患者全息视图',
            code: 'emrdoctorview',
            value: 'http://127.0.0.1/EMR/emrviewdoctor/html/index.html'
          }
        ]
      },
      // {
      //   name: '工具栏菜单',
      //   code: 'toolbarMenu',
      //   value: ''
      // }
    ]
  },
  {
    name: '查看权限',
    code: 'visitPerms',
    value: '',
    children: [
      {
        name: '就诊科室',
        code: 'dept',
        value: []
      },
      {
        name: '症状',
        code: 'symptom',
        value: []
      }
    ]
  },
  {
    name: '就诊过滤',
    code: 'visitFilter',
    value: '',
    children: [
      {
        name: '就诊科室',
        code: 'dept',
        value: []
      },
      {
        name: '症状',
        code: 'symptom',
        value: []
      }
    ]
  }
];

var medicalOrder = [
  {
    name: '医嘱项',
    code: 'items',
    value: '',
    children: [
      {
        name: '临时医嘱',
        code: 'desc',
        value: '',
        children: [
          {
            name: '是否为长期医嘱',
            code: 'isLong',
            scope: [false, true],
            value: false
          },
          {
            name: '医嘱类型代码',
            code: 'code',
            value: ['NORM']
          }
        ]
      },
      {
        name: '用药医嘱(即刻)',
        code: 'desc',
        value: '',
        children: [
          {
            name: '是否为长期医嘱',
            code: 'isLong',
            scope: [false, true],
            value: false
          },
          {
            name: '医嘱类型代码',
            code: 'code',
            value: ['STAT']
          }
        ]
      },
      {
        name: '取药医嘱',
        code: 'desc',
        value: '',
        children: [
          {
            name: '是否为长期医嘱',
            code: 'isLong',
            scope: [false, true],
            value: false
          },
          {
            name: '医嘱类型代码',
            code: 'code',
            value: ['ONE']
          }
        ]
      },
      {
        name: '长期医嘱',
        code: 'desc',
        value: '',
        children: [
          {
            name: '是否为长期医嘱',
            code: 'isLong',
            scope: [false, true],
            value: true
          },
          {
            name: '医嘱类型代码',
            code: 'code',
            value: ['S']
          }
        ]
      },
      {
        name: '用药医嘱(长期)',
        code: 'desc',
        value: '',
        children: [
          {
            name: '是否为长期医嘱',
            code: 'isLong',
            scope: [false, true],
            value: true
          },
          {
            name: '医嘱类型代码',
            code: 'code',
            value: ['OMST']
          }
        ]
      }
    ]
  },
  {
    name: '标签',
    code: 'labelConfig',
    value: '',
    children: [
      {
        name: '是否显示详情',
        code: 'showDetail',
        scope: [false, true],
        value: true
      },
      {
        name: '背景色',
        code: 'config_pStyle_backgroundColor',
        value: '#59b272'
      },
      {
        name: '文字对齐方式',
        code: 'config_pStyle_textAlign',
        scope: [
          {
            label: '左对齐',
            value: 'left'
          },
          {
            label: '居中',
            value: 'center'
          },
          {
            label: '右对齐',
            value: 'right'
          }
        ],
        value: 'center'
      }
    ]
  }
];

var pacs = [
  {
    name: '标签',
    code: 'labelConfig',
    value: '',
    children: [
      {
        name: '是否显示详情',
        code: 'showDetail',
        scope: [false, true],
        value: true
      },
      {
        name: '背景色',
        code: 'config_pStyle_backgroundColor',
        value: '#7ab5d9'
      },
      {
        name: '文字对齐方式',
        code: 'config_pStyle_textAlign',
        scope: [
          {
            label: '左对齐',
            value: 'left'
          },
          {
            label: '居中',
            value: 'center'
          },
          {
            label: '右对齐',
            value: 'right'
          }
        ],
        value: 'center'
      }
    ]
  }
];

var lis = [
  {
    name: '标签',
    code: 'labelConfig',
    value: '',
    children: [
      {
        name: '是否显示详情',
        code: 'showDetail',
        scope: [false, true],
        value: false
      },
      {
        name: '背景色',
        code: 'config_pStyle_backgroundColor',
        value: '#7ab5d9'
      },
      {
        name: '文字对齐方式',
        code: 'config_pStyle_textAlign',
        scope: [
          {
            label: '左对齐',
            value: 'left'
          },
          {
            label: '居中',
            value: 'center'
          },
          {
            label: '右对齐',
            value: 'right'
          }
        ],
        value: 'center'
      },
      {
        name: '异常显示颜色',
        code: 'ownAbnoItem_color',
        value: 'rgba(255, 60, 0, 0.8)'
      }
    ]
  }
];

var lisnorm = [
  {
    name: '标签',
    code: 'labelConfig',
    value: '',
    children: [
      {
        name: '是否显示详情',
        code: 'showDetail',
        scope: [false, true],
        value: false
      },
      {
        name: '背景色',
        code: 'config_pStyle_backgroundColor',
        value: '#59b272'
      },
      {
        name: '文字对齐方式',
        code: 'config_pStyle_textAlign',
        scope: [
          {
            label: '左对齐',
            value: 'left'
          },
          {
            label: '居中',
            value: 'center'
          },
          {
            label: '右对齐',
            value: 'right'
          }
        ],
        value: 'center'
      }
    ]
  }
];

var surgery = [
  {
    name: '标签',
    code: 'labelConfig',
    value: '',
    children: [
      {
        name: '是否显示详情',
        code: 'showDetail',
        scope: [false, true],
        value: false
      },
      {
        name: '背景色',
        code: 'config_pStyle_backgroundColor',
        value: '#7ab5d9'
      },
      {
        name: '文字对齐方式',
        code: 'config_pStyle_textAlign',
        scope: [
          {
            label: '左对齐',
            value: 'left'
          },
          {
            label: '居中',
            value: 'center'
          },
          {
            label: '右对齐',
            value: 'right'
          }
        ],
        value: 'center'
      }
    ]
  }
];

var emr = [
  {
    name: '标签',
    code: 'labelConfig',
    value: '',
    children: [
      {
        name: '是否显示详情',
        code: 'showDetail',
        scope: [false, true],
        value: false
      },
      {
        name: '背景色',
        code: 'config_pStyle_backgroundColor',
        value: '#59b272'
      },
      {
        name: '文字对齐方式',
        code: 'config_pStyle_textAlign',
        scope: [
          {
            label: '左对齐',
            value: 'left'
          },
          {
            label: '居中',
            value: 'center'
          },
          {
            label: '右对齐',
            value: 'right'
          }
        ],
        value: 'center'
      }
    ]
  }
];

var consul = [
  {
    name: '标签',
    code: 'labelConfig',
    value: '',
    children: [
      {
        name: '是否显示详情',
        code: 'showDetail',
        scope: [false, true],
        value: false
      },
      {
        name: '背景色',
        code: 'config_pStyle_backgroundColor',
        value: '#7ab5d9'
      },
      {
        name: '文字对齐方式',
        code: 'config_pStyle_textAlign',
        scope: [
          {
            label: '左对齐',
            value: 'left'
          },
          {
            label: '居中',
            value: 'center'
          },
          {
            label: '右对齐',
            value: 'right'
          }
        ],
        value: 'center'
      }
    ]
  }
];
/* 以上数据需要接口 */

var allSetting = {
  settingList,
  showSetting,
  generalSetting,
  medicalOrder,
  pacs,
  lis,
  lisnorm,
  surgery,
  emr,
  consul
}