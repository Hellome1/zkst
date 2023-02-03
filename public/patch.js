function showLisLoop(allINeed) {
  // console.log(allINeed);

  var lisCon = $('#loop_pop_mask');
  if (!lisCon.length) {
    var popwin = $('<div id="loop_pop_mask"></div>')
      .css({
        position: 'fixed',
        left: 0,
        top: 0,
        right: 0,
        bottom: 0,
        zIndex: 998,
        backgroundColor: 'rgba(0, 0, 0, 0.3)',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        zIndex: 2008
      })
      .on('click', function (e) {
        if (e.target.id === 'loop_pop_mask') $(e.target).css({ display: 'none' });
      });
    var popbody = $('<div id="popbody" style="background-color: white; width: 1000px; padding: 10px; border-radius: 5px;"></div>').append(
      '<div id="cusLoop_c" style="max-height: 800px;"></div>'
    );
    var closeBtn = $('<i class="fa fa-close"></i>')
      .css({ cursor: 'pointer' })
      .on('click', function () {
        popwin.css({
          display: 'none'
        });
      });
    var closeTitle = $('<div class="zkst_loop_title"><h3 style="margin: 0;">检验闭环展示</h3></div>')
      .css({
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        padding: '5px 15px'
      })
      .append(closeBtn);
    popbody.prepend(closeTitle);
    popwin.append(popbody);
    $(document.body).append(popwin);
  } else {
    lisCon.css({ display: 'flex' });
  }

  var dict = [
    {
      step: 1,
      eventCode: 'AP',
      eventName: '申请',
      masterflag: '',
      masterKeyword: '',
      branch: [],
      public: true
    },
    {
      step: 2,
      eventCode: 'LISPAY',
      eventName: '门诊缴费',
      masterflag: '',
      masterKeyword: '',
      branch: [],
      public: true
    },
    {
      step: 3,
      eventCode: 'PRINT',
      eventName: '打印条码',
      masterflag: 'true',
      masterKeyword: 'bloodbagCode',
      branch: [],
      public: true
    },
    {
      step: 4,
      eventCode: 'COLLECT',
      eventName: '标本采集',
      masterKeyword: '',
      masterflag: '',
      branch: []
    },
    {
      step: 5,
      eventCode: 'RECEIVE',
      eventName: '接收标本',
      masterKeyword: '',
      masterflag: '',
      branch: []
    },
    {
      step: 6,
      eventCode: 'RPA',
      eventName: '报告审核',
      masterflag: true,
      masterKeyword: 'esOrdItemId',
      branch: []
      // public: true
    },
    {
      step: 7,
      eventCode: 'RPT',
      eventName: '报告打印',
      masterflag: true,
      masterKeyword: 'esOrdItemId',
      branch: []
      // public: true
    }
  ];
  var dict_live = [
    {
      step: 1,
      eventCode: 'AP',
      eventName: '申请',
      masterflag: '',
      masterKeyword: '',
      branch: [],
      public: true
    },
    {
      step: 2,
      eventCode: 'PRINT',
      eventName: '打印条码',
      masterflag: 'true',
      masterKeyword: 'bloodbagCode',
      branch: [],
      public: true
    },
    {
      step: 3,
      eventCode: 'COLLECT',
      eventName: '标本采集',
      masterKeyword: '',
      masterflag: '',
      branch: []
    },
    {
      step: 4,
      eventCode: 'LISPACK',
      eventName: '标本打包',
      masterKeyword: '',
      masterflag: '',
      branch: []
    },
    {
      step: 5,
      eventCode: 'LISSENDOUT',
      eventName: '标本转运',
      masterKeyword: '',
      masterflag: '',
      branch: []
    },
    {
      step: 6,
      eventCode: 'LISSENDIN',
      eventName: '标本送达',
      masterKeyword: '',
      masterflag: '',
      branch: []
    },
    {
      step: 7,
      eventCode: 'RECEIVE',
      eventName: '接收标本',
      masterKeyword: '',
      masterflag: '',
      branch: []
    },
    {
      step: 8,
      eventCode: 'LISENTRY',
      eventName: '标本录入',
      masterKeyword: '',
      masterflag: '',
      branch: []
    },
    {
      step: 9,
      eventCode: 'RPA',
      eventName: '报告审核',
      masterflag: true,
      masterKeyword: 'esOrdItemId',
      branch: []
      // public: true
    },
    {
      step: 10,
      eventCode: 'RPT',
      eventName: '报告打印',
      masterflag: true,
      masterKeyword: 'esOrdItemId',
      branch: []
      // public: true
    }
  ];
  var cvDict = [
    {
      step: 1,
      eventCode: 'cv_start',
      eventName: '危机值',
      masterKeyword: '',
      masterflag: '',
      branch: []
    },
    {
      step: 2,
      eventCode: 'CVPUB',
      eventName: '危急值发布',
      masterKeyword: '',
      masterflag: '',
      branch: []
    },
    {
      step: 3,
      eventCode: 'CVRECEIVE',
      eventName: '危急值接收',
      masterKeyword: '',
      masterflag: '',
      branch: []
    },
    {
      step: 4,
      eventCode: 'CVHANDLE',
      eventName: '危急值处理',
      masterKeyword: '',
      masterflag: '',
      branch: []
    }
  ];

  if (allINeed.postData.encTypeCode === 'E') allINeed.postData.encTypeCode = 'O';
  new CusLoop({
    action: 'MES0051',
    // params: [row.ensLogId, 'LIS', _this.inspectionId],
    index: 1,
    containerSelector: '#cusLoop_c',
    dict: allINeed.postData.encTypeCode === 'O' ? dict : dict_live,
    cvDict: cvDict,
    type: allINeed.postData.encTypeCode,
    baseURL: 'http://192.178.61.87:8002/emr/dc/MES0051',
    request: allINeed.request,
    postData: allINeed.postData
  });
}

showLisLoop.fetchData = {
  ensLogId: '{ensLogId}',
  ensSystemCode: 'LIS',
  hdcInspRptId: '{hdcInspRptId}',
  encTypeCode: '{encTypeCode}'
};

/**
 * @description jQuery创建闭环
 * @lastModification 2021-12-24
 * @createdBy czy
 * @param {object} param 
 * @param {[]} param.params 
 * @param {number} param.index
 * @param {string} param.containerSelector
 * @param {?boolean} param.showData
 * @param {?object} param.dict
 * @returns 
 * 
 * @example new CusLoop({
              params: [row.ensLogId, 'CONSULT'],
              index: index,
              containerSelector: '.cusLoop_c' + index
            });
 */
function CusLoop(param) {
  // 如果没有用new则报错
  if (!(this instanceof CusLoop)) {
    console.error('Please retry with "new" keyWord!');
    return;
  }
  // 传入参数不是对象则报错
  if (!(param instanceof Object)) {
    console.error('Please pass an object as param!');
    return;
  }
  // 如果没有传入param.containerSelector则报错
  if (!param.containerSelector) {
    console.error('Please pass a containerSelector!');
    return;
  }
  // 如果有传入字典则设置字典
  if (param.dict) {
    this.dictionary = this.copy(param.dict);
  }
  // 如果传入危机值字典则设置危机值字典
  if (param.cvDict) {
    this.cvDict = param.cvDict;
  }
  // 如果params[2]存在则危机值为true
  // if (param.params[2]) this.isCv = true;
  this.isCv = false;
  // 如果有传入类型则设置
  if (param.type) {
    this.type = param.type;
  }
  if (param.baseURL) {
    this.baseURL = param.baseURL;
  }
  this.request = param.request;
  this.postData = {};
  for (var k in param.postData) {
    if (!(k === 'encTypeCode')) this.postData[k] = param.postData[k];
  }
  this.param = param;
  this.containerSelector = param.containerSelector;
  this.el = this.init(param);
}

CusLoop.prototype = {
  constructor: CusLoop,
  baseColor: 'rgba(67, 207, 124, 1)', // 背景线和步骤的基本颜色
  lineWidth: '6px', // 线宽度
  // 获取的字典中需要用到的字段
  dictField: {
    eventCode: 'closedCycleCode',
    eventName: 'closedCycleName',
    keyword: 'masterKeyword'
  },
  /*  -------------业务字典--------------- */
  dictionary: [],
  /*  -------------业务字典End--------------- */
  /*  转换字段 */
  trans: {
    step: 'esStatusDesc',
    desc: 'esOperatorName',
    date: 'esOperateDate',
    time: 'esOperateTime'
  },
  dictStepKey: 'eventCode', // 字典步骤标识符
  dictStepNameKey: 'eventName', // 字典步骤名称
  stepVerifiedKey: 'esStatusCode', // 标识数据为字典哪一步的数据的key
  classifyCodeKey: 'esExamId', // 将数据分条用到的数据中的key
  // 获取数据
  getData: function (obj, callback) {
    var param = obj.params;
    var data = obj.data;
    if (param == 'mock') return 'mock_data'; // 使用模拟数据 mock_data
    if (data) return callback.bind(this, data)();
    var postParams = {
      data: {
        ensStatusLogInfo: this.postData
      }
    };
    return this.request({
      baseURL: this.baseURL,
      method: 'post',
      data: queryStringify({
        action: obj.action,
        page: 1,
        rows: 1000,
        params: JSON.stringify(postParams)
      })
    });

    function queryStringify(d) {
      var query = '';
      for (var k in d) {
        query += '&' + k + '=' + d[k];
      }
      return query.substring(1);
    }
  },
  // 获取字典
  getDict: function (typeCode, callback) {
    return this.request({
      baseURL: 'http://118.122.119.130:48001/emr/' + 'closed/cycle',
      method: 'get',
      param: {
        closedCycleTypeCode: typeCode,
        listFlag: true
      }
    });
  },
  // 设置字典
  setDict: function (dictData) {
    console.log(this.type);
    var field = this.dictField;
    var type = this.type;
    var targetDict = dictData.map(function (item) {
      var needInfo = {};
      for (var k in field) {
        needInfo[k] = item[field[k]];
      }
      return needInfo;
    });
    if (type) {
      var branchStartIndex = type === 'I' ? 2 : 3;
      targetDict = targetDict.filter(function (item) {
        return item.keyword === type;
      });
      targetDict = targetDict.map(function (item, index) {
        index <= branchStartIndex - 1 && (item.public = true);
        return item;
      });
    }

    console.log(targetDict);
    this.dictionary = targetDict;
  },
  // 深拷贝
  copy: function (o) {
    var obj = null;
    if (o instanceof Array) {
      obj = [];
      for (var i = 0; i < o.length; i++) {
        var m = this.copy(o[i]);
        obj.push(m);
      }
    } else if (o instanceof Object && !('function' == typeof o)) {
      obj = {};
      for (var k in o) {
        obj[k] = this.copy(o[k]);
      }
    } else {
      obj = o;
    }
    return obj;
  },
  // 数据危机值处理逻辑
  cvLogic: function (num, data) {
    var _this = this;
    // 增加字典
    var cvd = this.copy(this.cvDict[0]);
    var dict = this.dictionary;
    dict.splice(num, 0, cvd);
    // 数据符合危机值字典增加examId
    data.forEach(function (item) {
      var isC = false;
      for (var i = 0; i < _this.cvDict.length; i++) {
        if (_this.cvDict[i][_this.dictStepKey] === item[_this.stepVerifiedKey]) isC = true;
      }
      if (isC) {
        var eId = null;
        for (var i = 0; i < data.length; i++) {
          if (data[i][_this.stepVerifiedKey] === dict[num + 1][_this.dictStepKey]) {
            if (data[i].oldEsExamId === item.esOrdItemId) {
              eId = data[i][_this.classifyCodeKey];
              break;
            } else if (data[i][_this.classifyCodeKey] === item.esOrdItemId) {
              eId = data[i][_this.classifyCodeKey];
              break;
            }
          }
        }
        item[_this.classifyCodeKey] = eId || '';
        // 查找有无同类危机值字段没有则构造
        var nullcV = true;
        var cvD0 = _this.cvDict[0];
        var ds = cvD0[_this.dictStepKey];
        var conObj = {};
        for (var i = 0; i < data.length; i++) {
          if (data[i][_this.stepVerifiedKey] === ds && data[i][_this.classifyCodeKey] === eId) {
            nullcV = false;
            conObj = data[i];
          }
        }
        if (nullcV) {
          conObj[_this.trans.step] = cvD0[_this.dictStepNameKey];
          conObj[_this.trans.desc] = '';
          conObj[_this.classifyCodeKey] = eId;
          conObj[_this.stepVerifiedKey] = ds;
          conObj.isCv = true;
          conObj.cvs = [];
          data.splice(data.length, 0, conObj);
        }
        var transcv = {};
        for (var key in _this.trans) {
          transcv[key] = item[_this.trans[key]];
        }
        transcv.esStatusCode = item.esStatusCode;
        conObj.cvs.push(transcv);
      }
    });
    var sort = ['CVPUB', 'CVRECEIVE', 'CVHANDLE'];
    data.forEach(function (item) {
      if (item.cvs) {
        var cvs = item.cvs;
        for (var i = 0; i < sort.length; i++) {
          var tar = sort[i];
          for (var j = 0; j < cvs.length; j++) {
            if (cvs[j].esStatusCode.indexOf(tar) > -1) {
              var temp = cvs[i];
              cvs[i] = cvs[j];
              cvs[j] = temp;
            }
          }
        }
      }
    });
  },
  reverseLogicSort: function (data) {
    var cck = this.classifyCodeKey;
    // examId排序，把最小的放在最上面。
    var firstIndex = null;
    var minIndex = null;
    var minN = null;
    for (var i = 0; i < data.length; i++) {
      var dtcc = data[i][cck];
      if (dtcc) {
        var enumb = parseInt(dtcc.split('_')[1]);
        if (firstIndex === null) firstIndex = i;
        if (minN === null) minN = enumb;
        if (enumb < minN) {
          minN = enumb;
          minIndex = i;
        }
      }
    }
    if (firstIndex && minIndex && firstIndex != minIndex) {
      // console.log(firstIndex, minIndex);
      var tempCache = data[firstIndex];
      data[firstIndex] = data[minIndex];
      data[minIndex] = tempCache;
    }
  },
  reverseLogicDebris_A: function (data) {
    var svk = this.stepVerifiedKey;
    var cck = this.classifyCodeKey;
    var situation = null;
    var _this = this;
    var dict = this.dictionary;

    this.reverseLogicSort(data);
    // 字典第一个字段对应多个数据，且该数据分类字段为''
    var dictZeroStep = dict[0][this.dictStepKey];
    var newClassifyCodes = [];
    var correspondingNumArr = [];
    var newcck = 'esOrdItemId';
    var classifyNCcount = 0;
    var reportIds = [];
    var midCounts = [];
    var rangeMin = this.type === 'O' ? 3 : 2;
    var rangeMax = this.type === 'O' ? 4 : 7;
    data.forEach(function (item) {
      if (item[svk] === dictZeroStep && item[cck] === '') {
        // 手动区分 -----------⬇
        item[cck] = 'givenBy201_' + classifyNCcount;
        newClassifyCodes.push(item[newcck]);
        correspondingNumArr.push(classifyNCcount);
        classifyNCcount++;
      }
      if (item.esRelReportId) {
        var rid = item.esRelReportId;
        var pushRid = true;
        for (var i = 0; i < reportIds.length; i++) {
          if (reportIds[i] === rid) {
            pushRid = false;
            break;
          }
        }
        if (pushRid) reportIds.push(rid);
      }
      for (var i = rangeMin; i <= rangeMax; i++) {
        if (item[svk] === dict[i][_this.dictStepKey]) {
          var pushMid = true;
          for (var j = 0; j < midCounts.length; j++) {
            if (midCounts[j] === item[cck]) pushMid = false;
          }
          if (pushMid) midCounts.push(item[cck]);
        }
      }
    });
    var repCount = reportIds.length;
    var midCount = midCounts.length;
    var brFlag = false;
    if (midCount <= 1 && repCount > 1) brFlag = true;
    if (classifyNCcount > 1) {
      this.reverseLogicDebris_B(data, newClassifyCodes, newcck, brFlag);
    } else if (brFlag) {
      this.reverseLogicDebris_B(data, newClassifyCodes, newcck, brFlag);
    }
  },
  reverseLogicDebris_B: function (data, newClassifyCodes, newcck, branchRep) {
    var dict = this.dictionary;
    var cck = this.classifyCodeKey;
    var svk = this.stepVerifiedKey;
    var _this = this;
    if (this.type === 'O') {
      if (branchRep) {
        // 分支
        data.forEach(function (item) {
          switch (item[svk]) {
            case dict[1][_this.dictStepKey]:
            case dict[2][_this.dictStepKey]:
              var ar = newClassifyCodes,
                len = ar.length;
              for (var i = 0; i < len; i++) {
                if (item[newcck] === ar[i]) {
                  // 配合添加手动区分 -----------⬆
                  item.oldEsExamId = item[cck]; // 保存老的examId
                  item[cck] = 'givenBy201_' + i;
                }
              }
              break;
            case dict[5][_this.dictStepKey]:
            case dict[6][_this.dictStepKey]:
              var ar = newClassifyCodes,
                len = ar.length;
              for (var i = 0; i < len; i++) {
                item[cck] = item.esRelReportId;
              }
              break;
            default:
              break;
          }
        });
      } else {
        data.forEach(function (item) {
          switch (item[svk]) {
            case dict[1][_this.dictStepKey]:
            case dict[2][_this.dictStepKey]:
            case dict[5][_this.dictStepKey]:
            case dict[6][_this.dictStepKey]:
              var ar = newClassifyCodes,
                len = ar.length;
              for (var i = 0; i < len; i++) {
                if (item[newcck] === ar[i]) {
                  // 配合添加手动区分 -----------⬆
                  item.oldEsExamId = item[cck]; // 保存老的examId
                  item[cck] = 'givenBy201_' + i;
                }
              }
              break;
            default:
              break;
          }
        });
      }
      // 改变字典public属性
      var beforeNum = 3,
        afterNum = 4;
      for (var i = 0; i < dict.length; i++) {
        if (i < beforeNum || i > afterNum) {
          dict[i].public = false;
        } else {
          dict[i].public = true;
        }
      }
    } else if (this.type === 'I' || this.type === 'E') {
      if (branchRep) {
        data.forEach(function (item) {
          switch (item[svk]) {
            case dict[1][_this.dictStepKey]:
              var ar = newClassifyCodes,
                len = ar.length;
              for (var i = 0; i < len; i++) {
                if (item[newcck] === ar[i]) {
                  // 配合添加手动区分 -----------⬆
                  item.oldEsExamId = item[cck]; // 保存老的examId
                  item[cck] = 'givenBy201_' + i;
                }
              }
              break;
            case dict[8][_this.dictStepKey]:
            case dict[9][_this.dictStepKey]:
              var ar = newClassifyCodes,
                len = ar.length;
              for (var i = 0; i < len; i++) {
                item[cck] = item.esRelReportId;
              }
              break;
            default:
              break;
          }
        });
      } else {
        data.forEach(function (item) {
          switch (item[svk]) {
            case dict[1][_this.dictStepKey]:
            case dict[8][_this.dictStepKey]:
            case dict[9][_this.dictStepKey]:
              var ar = newClassifyCodes,
                len = ar.length;
              for (var i = 0; i < len; i++) {
                if (item[newcck] === ar[i]) {
                  // 配合添加手动区分 -----------⬆
                  item.oldEsExamId = item[cck]; // 保存老的examId
                  item[cck] = 'givenBy201_' + i;
                }
              }
              break;
            default:
              break;
          }
        });
      }
      var beforeNum = 2,
        afterNum = 7;
      for (var i = 0; i < dict.length; i++) {
        if (i < beforeNum || i > afterNum) {
          dict[i].public = false;
        } else {
          dict[i].public = true;
        }
      }
    }
  },
  // 判断是否需要改字典
  reverseDict: function (data) {
    var svk = this.stepVerifiedKey;
    var cck = this.classifyCodeKey;
    var situation = null;
    var _this = this;
    var dict = this.dictionary;
    if (this.type === 'O') {
      this.reverseLogicSort(data);
      this.reverseLogicDebris_A(data);
      // 如果危机值为true增加危机逻辑
      if (this.isCv) this.cvLogic(5, data);
    } else if (this.type === 'I' || this.type === 'E') {
      this.reverseLogicSort(data);
      this.reverseLogicDebris_A(data);
      // 如果危机值为true增加危机逻辑
      if (this.isCv) this.cvLogic(8, data);
    }
  },
  // 处理数据
  handleData: function (dataRaw) {
    var data = []; // 拷贝原数据，不改变原数据
    dataRaw.forEach(function (item) {
      var dataObj = {};
      for (var key in item) {
        dataObj[key] = item[key];
      }
      data.push(dataObj);
    });
    this.reverseDict(data);
    // console.log(data);
    var handledData = {}; // 被处理好的数据
    var type = this.type;

    var _this = this; // 记录this
    var dict = this.dictionary; // 获取字典
    var cancel = false; // 假定没有取消

    var publicCodes = []; // 记录center公共点判断步骤的key
    var publicIndexs = []; // 记录publicCodes中的key在dict中的位置
    var lastPub = []; // 记录last公共点判断步骤的key
    var lastPubIndexs = []; // 记录lastPub中的key在dict中的位置

    /*  循环dict，找到公共点步骤标识和记录该步骤在dict中的位置 */
    for (var i = 0; i < dict.length; i++) {
      if (!publicIndexs.length && dict[i].public) {
        publicCodes.push(dict[i][this.dictStepKey]);
        publicIndexs.push(i);
      } else if (publicIndexs.length && dict[i].public) {
        var lastIndex = publicIndexs[publicIndexs.length - 1];
        if (i == lastIndex + 1) {
          publicCodes.push(dict[i][this.dictStepKey]);
          publicIndexs.push(i);
        } else {
          lastPub.push(dict[i][this.dictStepKey]);
          lastPubIndexs.push(i);
        }
      }
    }

    /* 构造handleData.center，循环publicCodes和数据，找到数据中与publicCodes对应的数据 */
    var center = [];
    for (var i = 0; i < publicCodes.length; i++) {
      var center_item = {};
      var done = false; // 用来快速跳出forEach，并且只关注第一个符合条件的数据
      data.forEach(function (item) {
        // 未完成且数据中用来分步的值等于公共点步骤标识，则找到
        if (!done && item[_this.stepVerifiedKey] == publicCodes[i]) {
          // 遍历用于字段转换的对象，原key作为key，数据中的值作为value
          for (var key in _this.trans) {
            center_item[key] = item[_this.trans[key]];
          }
          // 使用字典中的名称作为公共点步骤名
          center_item.step = dict[publicIndexs[i]][_this.dictStepNameKey];
          center.push(center_item);
          done = true;
          // center中的某项数据对应的dict中的cancel为真，则取消
          if (dict[publicIndexs[i]].cancel) cancel = true;
        }
      });
      // 如果数据中没有dict中的center公共点，则构造
      if (!done && (i == 0 || type === 'O' || type === 'I' || type === 'E')) {
        var nullObj = {
          step: dict[publicIndexs[i]][this.dictStepNameKey],
          desc: type ? 'none' : ''
        };
        // 有数据才push，防止只有构造的数据显示
        if (data.length) center.push(nullObj);
      }
    }

    /*  如果取消，则不显示后面的数据，其余数据构造为空 */
    if (cancel) {
      handledData.center = center;
      handledData.d = {
        before: [],
        after: []
      };
      handledData.last = [];
      this.startPublic = publicIndexs[0] + 1;

      return handledData;
    }

    /* 构造handledData.last，循环lastPub找到对应的数据，同center */
    var last = [];
    for (var i = 0; i < lastPub.length; i++) {
      var last_item = {};
      var done = false; // 用来快速跳出forEach
      data.forEach(function (item) {
        if (!done && item[_this.stepVerifiedKey] == lastPub[i]) {
          for (var key in _this.trans) {
            last_item[key] = item[_this.trans[key]];
          }
          last_item.step = dict[lastPubIndexs[i]][_this.dictStepNameKey];
          last.push(last_item);
          done = true;
        }
      });
      /* 数据中last不存在，构造last */
      if (!done) {
        var nullObj = {
          step: dict[lastPubIndexs[i]][this.dictStepNameKey],
          desc: 'none'
        };
        if (data.length) last.push(nullObj);
      }
    }

    /* 遍历dict，找出dict中的标识符 */
    var dictKeyObj = {};
    for (var i = 0; i < dict.length; i++) {
      var k = dict[i][this.dictStepKey];
      dictKeyObj[k] = true;
    }

    /* 构造handledData.d --------start */
    var datas = {};
    datas.before = [];
    datas.after = [];
    var startPub = publicIndexs[0];
    this.startPublic = publicIndexs[0] + 1; // 记录公共点开始的位置

    /* **存放已经经过指定字段分类的且过滤掉dict中没有的字段之后的数据** */
    var dataArr = [];
    /* **--------存放--------end** */

    // 数据中首条用来判断分类的字段为第一条数据的该字段
    // data[0][this.classifyCodeKey] = data[1][this.classifyCodeKey];

    /* 便历数据和dataArr，如果dataArr中没有数据对应的分类标识，则push新的类，如果有则在原分类数据上push */
    data.forEach(function (item, index) {
      var pushFlag = true;
      for (var i = 0; i < dataArr.length; i++) {
        // 分条
        if (dataArr[i][0][_this.classifyCodeKey] == item[_this.classifyCodeKey]) {
          pushFlag = false;
          // 过滤字典里没有的字段
          if (dictKeyObj[item[_this.stepVerifiedKey]]) {
            // console.log(item);
            dataArr[i].push(item);
          }
        }
      }
      if (pushFlag) {
        // 过滤字典里没有的字段
        if (dictKeyObj[item[_this.stepVerifiedKey]]) {
          dataArr.push([item]);
        }
      }
    });

    /*  如果数据只有一条，默认before没有，after为数据除开公共点后的依次展示 */
    if (dataArr.length == 1 && this.type != 'O' && this.type != 'I') {
      var oneArr = dataArr[0];
      var datas_item_after = [];
      for (var i = this.startPublic; i < oneArr.length; i++) {
        if (oneArr[this.stepVerifiedKey] == dict[0][this.dictStepKey]) i = 1;
        var obj = {};
        for (var key in this.trans) {
          obj[key] = oneArr[i][this.trans[key]];
        }
        datas_item_after.push(obj);
      }

      handledData.d = { before: [], after: [datas_item_after] };
      handledData.center = center;
      handledData.last = last;
      return handledData;
    }

    // console.log(this.copy(dataArr));

    /*
                  按照字典字段排序
                    遍历分好类且经过过滤的dataArr和dict，如果某条分类没有对应dict字段，则构造
                */
    var cancelIndex = Array(dataArr.length); // 记录每条分类中cancel的位置
    for (var i = 0; i < dataArr.length; i++) {
      for (var j = 0; j < dict.length; j++) {
        var val = dict[j][this.dictStepKey];
        var has = false; // 记录数据中是否有dict对应步
        for (var k = 0; k < dataArr[i].length; k++) {
          // 符合条件则交换
          if (dataArr[i][k][this.stepVerifiedKey] == val) {
            if (dict[j].cancel && !cancelIndex[i] && j != 1) {
              // 记录cancel位置，且只记录第一次在分支上出现cancel的位置
              dataArr[i][k].showCancel = true;
              cancelIndex[i] = j;
            }
            // console.log(dataArr[i][j], dataArr[i][k], i, j);
            var temp = dataArr[i][j];
            dataArr[i][j] = dataArr[i][k];
            dataArr[i][k] = temp;
            has = true;
          }
        }
        // 没有则构造字段
        if (!has) {
          // console.log(dict[j]);
          var nullObj = {
            esStatusDesc: dict[j].eventName,
            esOperatorName: 'none'
          };
          nullObj[this.stepVerifiedKey] = dict[j][this.dictStepKey];
          dataArr[i].splice(j, 0, nullObj);
        }
      }
    }
    // console.log(dataArr, 'dataArr');

    // 不显示cancel之后的步骤
    for (var i = 0; i < dataArr.length; i++) {
      var count = 10; // 防止while写错死循环
      // dataArr[i]应该到cancelIndex[i]结束，多余则删除
      while (cancelIndex[i] && count > 0 && dataArr[i].length > cancelIndex[i] + 1) {
        dataArr[i].splice(cancelIndex[i] + 1, 1); // dataArr[i].length会减小
        count--;
      }
    }

    /* 最后在处理好的数据dataArr中循环，构造datas.before和datas.after */
    for (var i = 0; i < dataArr.length; i++) {
      var datas_item_before = []; // datas.before中的项
      var datas_item_after = []; // datas.after中的项
      // 根据dict循环判断是否在数据是before中的还是after中的
      for (var j = 0; j < dict.length; j++) {
        // 给before和after增加数据
        if (!dict[j].public && j < startPub) {
          var obj = {};
          for (var key in this.trans) {
            obj[key] = dataArr[i][j][this.trans[key]];
          }
          obj.step = dict[j][this.dictStepNameKey];
          datas_item_before.push(obj);
        } else if (!dict[j].public && j > startPub) {
          // 数据存在才执行
          if (dataArr[i][j]) {
            var push = true;
            if (dict[j].cancel && !dataArr[i][j].showCancel) push = false;
            var obj = {};
            for (var key in this.trans) {
              obj[key] = dataArr[i][j][this.trans[key]];
            }
            obj.step = dict[j][this.dictStepNameKey];
            if (dataArr[i][j].isCv) {
              obj.isCv = true;
              obj.cvs = dataArr[i][j].cvs;
            }
            if (push) datas_item_after.push(obj);
          }
        }
      }

      // before某一项为空则清空
      var beforeIndex = datas_item_before.length - 1;
      var beforeNull = true;
      while (beforeIndex >= 0) {
        if (datas_item_before[beforeIndex].desc != 'none') beforeNull = false;
        beforeIndex--;
      }
      if (!beforeNull) {
        datas.before.push(datas_item_before);
      }

      // after某一项为空职则清空
      var afterIndex = datas_item_after.length - 1;
      var afterNull = true;
      while (afterIndex >= 0) {
        if (datas_item_after[afterIndex].desc != 'none') afterNull = false;
        afterIndex--;
      }
      if (!afterNull || ((type === 'O' || type === 'I') && dataArr.length === 1)) {
        datas.after.push(datas_item_after);
      }

      // datas.before.push(datas_item_before);
    }

    /* 构造handledData.d -----------结束 */

    // console.log(datas);

    handledData.center = center;
    handledData.d = datas;
    handledData.last = last;

    return handledData;
  },
  // 按照数据顺序显示
  showData: function (dataRaw) {
    var data = []; // 拷贝原数据，不改变原数据
    dataRaw.forEach(function (item) {
      var dataObj = {};
      for (var key in item) {
        dataObj[key] = item[key];
      }
      data.push(dataObj);
    });
    // 数据去重
    for (var i = 0; i < data.length; i++) {
      for (var j = i + 1; j < data.length; j++) {
        if (data[i][this.stepVerifiedKey] == data[j][this.stepVerifiedKey] && data[i][this.classifyCodeKey] == data[j][this.classifyCodeKey]) {
          if (data[i][this.trans.date] + data[i][this.trans.time] == data[j][this.trans.date] + data[j][this.trans.time]) {
            data.splice(j, 1);
            j--;
          }
        }
      }
    }

    var handledData = {}; // 被处理好的数据

    var _this = this; // 记录this
    var dict = this.dictionary; // 获取字典

    var publicCodes = []; // 记录center公共点判断步骤的key
    var publicIndexs = []; // 记录publicCodes中的key在dict中的位置
    var lastPub = []; // 记录last公共点判断步骤的key
    var lastPubIndexs = []; // 记录lastPub中的key在dict中的位置

    /*  循环dict，找到公共点步骤标识和记录该步骤在dict中的位置 */
    for (var i = 0; i < dict.length; i++) {
      if (!publicIndexs.length && dict[i].public) {
        publicCodes.push(dict[i][this.dictStepKey]);
        publicIndexs.push(i);
      } else if (publicIndexs.length && dict[i].public) {
        var lastIndex = publicIndexs[publicIndexs.length - 1];
        if (i == lastIndex + 1) {
          publicCodes.push(dict[i][this.dictStepKey]);
          publicIndexs.push(i);
        } else {
          lastPub.push(dict[i][this.dictStepKey]);
          lastPubIndexs.push(i);
        }
      }
    }

    /* 构造handleData.center，循环publicCodes和数据，找到数据中与publicCodes对应的数据 */
    var center = [];
    for (var i = 0; i < publicCodes.length; i++) {
      var center_item = {};
      var done = false; // 用来快速跳出forEach，并且只关注第一个符合条件的数据
      data.forEach(function (item) {
        // 未完成且数据中用来分步的值等于公共点步骤标识，则找到
        if (!done && item[_this.stepVerifiedKey] == publicCodes[i]) {
          // 遍历用于字段转换的对象，原key作为key，数据中的值作为value
          for (var key in _this.trans) {
            var valInD = item[_this.trans[key]];
            valInD = typeof valInD == 'string' ? valInD.replace(/-/g, '/') : valInD;
            center_item[key] = valInD;
          }
          // 使用字典中的名称作为公共点步骤名
          center_item.step = dict[publicIndexs[i]][_this.dictStepNameKey];
          center.push(center_item);
          done = true;
          // center中的某项数据对应的dict中的cancel为真，则取消
          if (dict[publicIndexs[i]].cancel) cancel = true;
        }
      });
      // 如果数据中没有dict中的center公共点，则构造
      if (!done && i == 0) {
        var nullObj = {
          step: dict[publicIndexs[i]][this.dictStepNameKey],
          desc: 'none'
        };
        // 有数据才push，防止只有构造的数据显示
        if (data.length) center.push(nullObj);
      }
    }

    /*  如果取消，则不显示后面的数据，其余数据构造为空 */
    /* if (cancel) {
                  handledData.center = center;
                  handledData.d = {
                    before: [],
                    after: []
                  };
                  handledData.last = [];
                  this.startPublic = publicIndexs[0] + 1;
            
                  return handledData;
                } */

    /* 构造handledData.last，循环lastPub找到对应的数据，同center */
    var last = [];
    for (var i = 0; i < lastPub.length; i++) {
      var last_item = {};
      var done = false; // 用来快速跳出forEach
      data.forEach(function (item) {
        if (!done && item[_this.stepVerifiedKey] == lastPub[i]) {
          for (var key in _this.trans) {
            var valInD = item[_this.trans[key]];
            valInD = typeof valInD == 'string' ? valInD.replace(/-/g, '/') : valInD;
            last_item[key] = valInD;
          }
          last_item.step = dict[lastPubIndexs[i]][_this.dictStepNameKey];
          last.push(last_item);
          done = true;
        }
      });
      /* 数据中last不存在，构造last */
      // if (!done) {
      //   var nullObj = {
      //     step: dict[lastPubIndexs[i]][this.dictStepNameKey],
      //     desc: 'none'
      //   };
      //   if(data.length) last.push(nullObj);
      // }
    }

    /* 遍历dict，找出dict中的标识符 */
    var dictKeyObj = {};
    for (var i = 0; i < dict.length; i++) {
      var k = dict[i][this.dictStepKey];
      dictKeyObj[k] = true;
    }

    /* 构造handledData.d --------start */
    var datas = {};
    datas.before = [];
    datas.after = [];
    var startPub = publicIndexs[0];
    this.startPublic = publicIndexs[0] + 1; // 记录公共点开始的位置

    /* **存放已经经过指定字段分类的且过滤掉dict中没有的字段之后的数据** */
    var dataArr = [];
    /* **--------存放--------end** */

    // 寻找数据中没有分类字段的数据用第一条有分类字段的数据作为该字段
    var classifyVal = '';
    var nullClassifyVals = []; // 用于记录分类字段为空的数据的位置
    for (var i = 0; i < data.length; i++) {
      if (!classifyVal && data[i][this.classifyCodeKey]) {
        classifyVal = data[i][this.classifyCodeKey];
      } else if (!data[i][this.classifyCodeKey]) {
        nullClassifyVals.push(i);
      }
    }
    if (classifyVal && nullClassifyVals.length > 0) {
      for (var i = 0; i < nullClassifyVals.length; i++) {
        data[nullClassifyVals[i]][this.classifyCodeKey] = classifyVal;
      }
    }

    /* 便历数据和dataArr，如果dataArr中没有数据对应的分类标识，则push新的类，如果有则在原分类数据上push */
    data.forEach(function (item, index) {
      var pushFlag = true;
      for (var i = 0; i < dataArr.length; i++) {
        // 分条
        if (dataArr[i][0][_this.classifyCodeKey] == item[_this.classifyCodeKey]) {
          pushFlag = false;
          // 过滤字典里没有的字段
          if (dictKeyObj[item[_this.stepVerifiedKey]]) {
            // console.log(item);
            dataArr[i].push(item);
          }
        }
      }
      if (pushFlag) {
        // 过滤字典里没有的字段
        if (dictKeyObj[item[_this.stepVerifiedKey]]) {
          dataArr.push([item]);
        }
      }
    });

    /*  默认before没有，after为数据除开公共点后的依次展示 */

    // 没有则构造字段
    for (var i = 0; i < dataArr.length; i++) {
      for (var j = 0; j < dict.length; j++) {
        var val = dict[j][this.dictStepKey];
        var has = false; // 记录数据中是否有dict对应步
        for (var k = 0; k < dataArr[i].length; k++) {
          if (dataArr[i][k][this.stepVerifiedKey] == val) {
            if (dict[j].cancel) {
              // 数据存在则记录
              dataArr[i][k].showCancel = true;
            }
            has = true;
          }
        }
        // 没有则构造字段
        if (!has) {
          // console.log(dict[j]);
          var nullObj = {
            esStatusDesc: dict[j].eventName,
            esOperatorName: 'none'
          };
          nullObj[this.stepVerifiedKey] = dict[j][this.dictStepKey];
          dataArr[i].splice(j, 0, nullObj);
        }
      }
    }

    // console.log(dataArr);

    for (var i = 0; i < dataArr.length; i++) {
      var datas_item_before = [];
      var datas_item_after = []; // datas.after中的项
      for (var j = this.startPublic; j < dataArr[i].length; j++) {
        var push = true;
        if (invisible(dataArr[i][j])) push = false;
        var obj = {};
        for (var key in this.trans) {
          var valInD = dataArr[i][j][this.trans[key]];
          valInD = typeof valInD == 'string' ? valInD.replace(/-/g, '/') : valInD;
          obj[key] = valInD;
        }
        if (push) datas_item_after.push(obj);
      }

      // after某一项为空职则清空，如果只有一条数据则不清
      var afterIndex = datas_item_after.length - 1;
      var afterNull = true;
      while (afterIndex >= 0) {
        if (datas_item_after[afterIndex].desc != 'none' || dataArr.length == 1) afterNull = false;
        afterIndex--;
      }
      if (!afterNull) {
        datas.after.push(datas_item_after);
      }

      datas.before.push(datas_item_before);
    }

    function invisible(dt) {
      var invisible = false;
      var isCancel = false;
      for (var i = 0; i < dict.length; i++) {
        if (dict[i][_this.dictStepKey] == dt[_this.stepVerifiedKey]) {
          if (dict[i].public) {
            // console.log(1);
            return false;
          }
          if (dict[i].cancel) isCancel = true;
        }
      }
      invisible = isCancel && !dt.showCancel ? true : false;
      return invisible;
    }

    handledData.center = center;
    handledData.d = datas;
    handledData.last = last;

    return handledData;
  },
  // 渲染
  render: function (data, index) {
    var count = this.startPublic || 4,
      center = data.center,
      last = data.last,
      start = this.startPublic || 4;
    var beforeArr = data.d.before,
      afterArr = data.d.after;

    var name = index ? ' cusLoop_con_c' + (index - 1) : '';

    var loopContainer = $('<div class="loopContainer' + name + '"></div>').css({
      position: 'relative',
      zIndex: 99
    });
    var loopLeftArea = $('<div class="loopLeftArea cusLoopArea"></div>').css({
      float: 'left'
    });
    var loopCenterArea = $('<div class="loopCenterArea cusLoopArea"></div>').css({
      // fontSize: '0',
      float: 'left'
    });
    var loopRightArea = $('<div class="loopRightArea cusLoopArea"></div>').css({
      alignSelf: 'center',
      overflow: 'visible',
      float: 'left'
    });
    var loopLastArea = $('<div class="loopLastArea cusLoopArea"></div>').css({
      alignSelf: 'center',
      // fontSize: '0',
      float: 'left'
    });

    // before
    var beforeNull = true;
    for (var i = 0; i < beforeArr.length; i++) {
      var rowLeftLine =
        i == beforeArr.length - 1
          ? $('<div class="rowLeftLine"></div>').css({
            position: 'absolute',
            width: this.lineWidth,
            height: this.lineWidth,
            top: 9 + (9 - parseInt(this.lineWidth)) / 2 + 'px',
            right: '-' + this.lineWidth,
            borderBottomRightRadius: this.lineWidth,
            backgroundColor: this.baseColor
          })
          : $('<div class="rowLeftLine"></div>').css({
            position: 'absolute',
            width: this.lineWidth,
            height: '100%',
            top: 9 + (9 - parseInt(this.lineWidth)) / 2 + 'px',
            right: '-' + this.lineWidth,
            backgroundColor: this.baseColor
          });
      if (i == 0)
        rowLeftLine.css({
          borderTopRightRadius: this.lineWidth
        });
      if (beforeArr.length == 1) rowLeftLine = '';
      var rowLeft = $('<div class="rowLeft_in_loop"></div>')
        .css({
          position: 'relative'
        })
        .html(rowLeftLine);
      var before = beforeArr[i];

      for (var j = 0; j < before.length; j++) {
        beforeNull = false;
        var step = this.createStep(before[j], start - (before.length - j));
        // 增加过渡canvas
        if (before[j].desc === 'none') {
          if (before[j - 1] && before[j - 1].desc !== 'none') {
            $(this.createCanvas(16, parseInt(this.lineWidth), 'l'))
              .appendTo(step)
              .css({
                left: '-' + this.lineWidth
              });
          }
          if (before[j + 1] && before[j + 1].desc !== 'none') {
            $(this.createCanvas(16, parseInt(this.lineWidth), 'r'))
              .appendTo(step)
              .css({
                right: '-' + this.lineWidth
              });
          }
          if (j == before.length - 1) {
            if (i == 0) {
              $(this.createCanvas(16, parseInt(this.lineWidth), 'r.et'))
                .appendTo(step)
                .css({
                  right: '-' + this.lineWidth
                });
            } else if (i == beforeArr.length - 1) {
              $(this.createCanvas(16, parseInt(this.lineWidth), 'r.eb'))
                .appendTo(step)
                .css({
                  right: '-' + this.lineWidth
                });
            }
          }
        }
        if (j == 0)
          step.find('.stepLine').css({
            right: '0',
            width: '50%',
            left: 'auto'
          });
        rowLeft.append(step);
      }

      loopLeftArea.append(rowLeft);
    }

    if (beforeNull) loopLeftArea.html('');

    // center
    for (var i = 0; i < center.length; i++) {
      var step = this.createStep(center[i], count);
      if (i == 0) {
        step.css({
          paddingLeft: '23px'
        });
        if (beforeNull)
          step.find('.stepLine').css({
            right: '0',
            width: '50%',
            left: 'auto'
          });
      }
      if (i == center.length - 1) {
        step.css({
          paddingRight: '23px'
        });
        if (!afterArr.length)
          step.find('.stepLine').css({
            width: '50%'
          });
      }
      loopCenterArea.append(step);
      count++;
    }

    // lastjudge
    var lastNull = last.length ? false : true;

    // after
    var afterSteps = [];
    for (var i = 0; i < afterArr.length; i++) {
      var rowRightLine =
        i == afterArr.length - 1
          ? $('<div class="rowRightLine"></div>').css({
            position: 'absolute',
            width: this.lineWidth,
            height: this.lineWidth,
            top: 9 + (9 - parseInt(this.lineWidth)) / 2 + 'px',
            left: '-' + this.lineWidth,
            borderBottomLeftRadius: this.lineWidth,
            backgroundColor: this.baseColor
          })
          : $('<div class="rowRightLine"></div>').css({
            position: 'absolute',
            width: this.lineWidth,
            height: '100%',
            top: 9 + (9 - parseInt(this.lineWidth)) / 2 + 'px',
            left: '-' + this.lineWidth,
            backgroundColor: this.baseColor
          });
      if (i == 0) {
        rowRightLine.css({
          borderTopLeftRadius: this.lineWidth
        });
      }
      if (afterArr.length == 1) rowRightLine = '';
      var rowRight = $('<div class="rowRight_in_loop"></div>')
        .css({
          position: 'relative',
          overflow: 'visible'
        })
        .append(rowRightLine);
      if (!lastNull && afterArr.length > 1) {
        var rowRightLineEnd =
          i == afterArr.length - 1
            ? $('<div class="rowRightLine"></div>').css({
              position: 'absolute',
              width: this.lineWidth,
              height: this.lineWidth,
              top: 9 + (9 - parseInt(this.lineWidth)) / 2 + 'px',
              right: '-' + this.lineWidth,
              borderBottomRightRadius: this.lineWidth,
              backgroundColor: this.baseColor
            })
            : $('<div class="rowRightLine"></div>').css({
              position: 'absolute',
              width: this.lineWidth,
              height: '100%',
              top: 9 + (9 - parseInt(this.lineWidth)) / 2 + 'px',
              right: '-' + this.lineWidth,
              backgroundColor: this.baseColor
            });
        if (i == 0) {
          rowRightLineEnd.css({
            borderTopRightRadius: this.lineWidth
          });
        }
        rowRight.append(rowRightLineEnd);
      }
      var after = afterArr[i];

      for (var j = 0; j < after.length; j++) {
        var step = this.createStep(after[j], count + j);
        // 增加过渡canvas
        if (after[j].desc == 'none' && j == 0 && afterArr.length == 1 && center[center.length - 1].desc != 'none') {
          $(this.createCanvas(16, parseInt(this.lineWidth), 'l'))
            .appendTo(step)
            .css({
              left: '-' + this.lineWidth
            });
        }
        if (after[j].desc === 'none') {
          if (after[j - 1] && after[j - 1].desc !== 'none') {
            $(this.createCanvas(16, parseInt(this.lineWidth), 'l'))
              .appendTo(step)
              .css({
                left: '-' + this.lineWidth
              });
          }
          if (after[j + 1] && after[j + 1].desc !== 'none') {
            $(this.createCanvas(16, parseInt(this.lineWidth), 'r'))
              .appendTo(step)
              .css({
                right: '-' + this.lineWidth
              });
          }
          if (!lastNull && j == 0 && afterArr.length != 1) {
            if (i == 0) {
              $(this.createCanvas(16, parseInt(this.lineWidth), 'l.st'))
                .appendTo(step)
                .css({
                  left: '-' + this.lineWidth
                });
            } else if (i == afterArr.length - 1) {
              $(this.createCanvas(16, parseInt(this.lineWidth), 'l.sb'))
                .appendTo(step)
                .css({
                  left: '-' + this.lineWidth
                });
            }
          }
          if (!lastNull && j == after.length - 1 && afterArr.length > 1) {
            if (i == 0) {
              $(this.createCanvas(16, parseInt(this.lineWidth), 'r.et'))
                .appendTo(step)
                .css({
                  right: '-' + this.lineWidth
                });
            } else if (i == afterArr.length - 1) {
              $(this.createCanvas(16, parseInt(this.lineWidth), 'r.eb'))
                .appendTo(step)
                .css({
                  right: '-' + this.lineWidth
                });
            }
          }
        }
        if (j == after.length - 1 && lastNull)
          step.find('.stepLine').css({
            width: '50%'
          });
        afterSteps.push(step);
        rowRight.append(step);
      }

      loopRightArea.append(rowRight);
    }

    count += afterArr[0] ? afterArr[0].length : 0;
    // last
    for (var i = 0; i < last.length; i++) {
      var step = this.createStep(last[i], count).css({
        width: '115px'
      });
      if (i == 0) {
        step.css({
          paddingLeft: '23px'
        });
      }
      if (i == last.length - 1) {
        step.css({
          paddingRight: '23px'
        });
        step.find('.stepLine').css({
          width: '50%'
        });
      }
      loopLastArea.append(step);
      count++;
    }

    [loopLeftArea, loopCenterArea, loopRightArea, loopLastArea].forEach(function (item) {
      loopContainer.append(item);
    });

    return loopContainer;
  },
  // 创建危机值节点
  createCvStep: function (info, num) {
    var step = info.step,
      desc = info.desc,
      date = info.date,
      time = info.time;
    var color = '#f02d2d';

    if (desc == 'none') {
      desc = date = time = '';
    }

    var stepContainer = $('<div class="stepContainer"></div>').css({
      // minHeight: desc == '' || desc == 'none' ? '114px' : '',
      minHeight: '114px',
      overflow: 'visible'
    });
    var line = $('<div class="stepLine"></div>');
    var stepNum = $('<p class="stepNum"></p>').html(num);
    var stepTitle = $('<p class="stepTitle"></p>').html(step);
    var stepDesc = $('<p class="stepDesc"></p>').html(desc);
    var stepDate = $('<p class="stepDate"></p>').html(date);
    var stepTime = $('<p class="stepTime"></p>').html(time);

    stepContainer.css({
      position: 'relative',
      textAlign: 'center',
      padding: '5px 0',
      paddingLeft: '5px'
    });
    line.css({
      position: 'absolute',
      top: '9px',
      left: '-8px',
      backgroundColor: color,
      height: '100%',
      width: this.lineWidth,
      zIndex: '-1'
    });
    stepNum
      .css({
        width: '17px',
        height: '17px',
        backgroundColor: color,
        borderRadius: '50%',
        marginTop: '-1px',
        marginLeft: -(17 - 8) / 2 + 'px',
        fontSize: '12px',
        color: 'white'
      })
      .appendTo(line);
    stepTitle.css({
      color: color,
      fontWeight: 'bold'
    });

    [line, stepTitle, stepDesc, stepDate, stepTime].forEach(function (item) {
      stepContainer.append(item);
    });

    return stepContainer;
  },
  // 创建危机值分支
  createCvsBranch: function (infos) {
    var cvsCon = $('<div class="cvs_container"></div>').css({
      position: 'relative',
      left: '49px'
    });

    for (var i = infos.length - 1; i >= 0; i--) {
      cvsCon.append(this.createCvStep(infos[i], i + 1));
    }

    return cvsCon;
  },
  // 创建‘步’
  createStep: function (info, num) {
    var step = info.step,
      desc = info.desc,
      date = info.date,
      time = info.time;
    var color = desc == 'none' ? '#ddd' : this.baseColor;

    if (desc == 'none') {
      desc = date = time = '';
    }

    var stepContainer = $('<div class="stepContainer"></div>').css({
      // minHeight: desc == '' || desc == 'none' ? '114px' : '',
      minHeight: '114px',
      overflow: 'visible'
    });

    if (info.isCv) {
      color = '#f02b2b';
    }

    var line = $('<div class="stepLine"></div>');
    var stepNum = $('<p class="stepNum"></p>').html(num);
    var stepTitle = $('<p class="stepTitle"></p>').html(step);
    var stepDesc = $('<p class="stepDesc"></p>').html(desc);
    var stepDate = $('<p class="stepDate"></p>').html(date);
    var stepTime = $('<p class="stepTime"></p>').html(time);

    stepContainer.css({
      display: 'inline-block',
      position: 'relative',
      textAlign: 'center',
      padding: '5px 15px',
      minWidth: '100px'
    });
    line.css({
      position: 'absolute',
      top: 9 + (9 - parseInt(this.lineWidth)) / 2 + 'px',
      left: '0',
      backgroundColor: color,
      width: '100%',
      height: this.lineWidth,
      zIndex: '-1'
    });
    stepNum.css({
      width: '17px',
      height: '17px',
      backgroundColor: color,
      borderRadius: '50%',
      margin: 'auto',
      lineHeight: '17px',
      fontSize: '12px',
      color: 'white'
    });
    stepTitle.css({
      color: color,
      fontWeight: 'bold'
    });

    if (info.isCv) {
      stepContainer.css({
        verticalAlign: 'bottom',
        marginBottom: '66px'
      });
      line.css({
        top: 'auto',
        bottom: 9 + (9 - parseInt(this.lineWidth)) / 2 + 21 + 'px'
      });
      this.createCvsBranch(info.cvs).prependTo(stepContainer);
    }

    [line, stepNum, stepTitle, stepDesc, stepDate, stepTime].forEach(function (item) {
      stepContainer.append(item);
    });

    return stepContainer;
  },
  createCanvas: function (width, height, trans) {
    var $canvasDom = $('<canvas width="' + width + 'px" height="' + height + 'px"></canvas');
    var canvasDom = $canvasDom[0];
    var ctx = canvasDom.getContext('2d');
    var grd = ctx.createLinearGradient(0, 0, width, 0);
    var rp = trans.split('.')[1];
    if (rp) {
      if (trans.split('.')[0] == 'l') {
        grd.addColorStop(0, this.baseColor);
        grd.addColorStop(0.3, this.baseColor);
        grd.addColorStop(1, '#ddd');
      } else if (trans.split('.')[0] == 'r') {
        grd.addColorStop(0, '#ddd');
        grd.addColorStop(0.7, this.baseColor);
        grd.addColorStop(1, this.baseColor);
      }
    } else {
      if (trans.split('.')[0] == 'l') {
        grd.addColorStop(0, this.baseColor);
        grd.addColorStop(1, '#ddd');
      } else if (trans.split('.')[0] == 'r') {
        grd.addColorStop(0, '#ddd');
        grd.addColorStop(1, this.baseColor);
      }
    }

    switch (rp) {
      case 'st':
        $canvasDom.css({
          borderTopLeftRadius: this.lineWidth
        });
        break;
      case 'sb':
        $canvasDom.css({
          borderBottomLeftRadius: this.lineWidth
        });
        break;
      case 'et':
        $canvasDom.css({
          borderTopRightRadius: this.lineWidth
        });
        break;
      case 'eb':
        $canvasDom.css({
          borderBottomRightRadius: this.lineWidth
        });
        break;
      default:
        break;
    }

    ctx.fillStyle = grd;
    ctx.fillRect(0, 0, width, height);

    $canvasDom.css({
      position: 'absolute',
      top: 9 + (9 - parseInt(this.lineWidth)) / 2 + 'px'
    });

    return canvasDom;
  },
  createStyle: function () {
    var style = [
      '.datagrid-btable tr td .loopContainer{overflow: visible;}',
      '.datagrid-btable tr td .loopContainer div{overflow: visible;}',
      ".loopContainer::after {content: ''; display: block; clear: both;}",
      '.loopContainer .loopRightArea .rowRight_in_loop { text-align: left;}',
      '.loopContainer .stepContainer {vertical-align: bottom;}'
    ].join('');
    return $('<style id="cusLoop_cs">' + style + '</style>');
  },
  justifyStyle: function (index) {
    // debugger;
    var con = $('.cusLoop_con_c' + index).css({ width: 10000 });
    // 消除危机值的影响
    var cv = con.find('.cvs_container');
    var cvH = cv.height() || 0;
    var areas = con.find('.cusLoopArea');
    var conWidth = 2;
    var befores = con.find('.loopLeftArea');
    var afters = con.find('.loopRightArea');
    var last = con.find('.loopLastArea');
    var lastH = last.height();
    var beforeSteps = befores.find('.rowLeft_in_loop .stepContainer');
    if (befores.length) {
      var max = 0;
      for (var i = 0; i < beforeSteps.length; i++) {
        var $af = $(beforeSteps[i]);
        if ($af.width() > max) max = $af.width();
      }
      for (var i = 0; i < beforeSteps.length; i++) {
        var $af = $(beforeSteps[i]);
        $af.width(max + 1);
      }
    }
    var afterSteps = afters.find('.rowRight_in_loop .stepContainer');
    if (lastH) {
      var max = 0;
      for (var i = 0; i < afterSteps.length; i++) {
        var $af = $(afterSteps[i]);
        if ($af.width() > max) max = $af.width();
      }
      for (var i = 0; i < afterSteps.length; i++) {
        var $af = $(afterSteps[i]);
        $af.width(max + 1);
      }
    }
    for (var i = 0; i < areas.length; i++) {
      conWidth += $(areas[i]).width();
    }
    // for (var i = 0; i < afters.length; i++) {
    //   conHeight += $(afters[i]).height();
    // }
    con.width(conWidth);
    var conHeight = $(con).height();
    // 消除一次危机值出现的影响
    var conHeightAfterCvh = $(con).height() - cvH;

    var center = con.find('.loopCenterArea');
    var centerH = center.height();
    var aftersH = afters.height();
    var beforesH = befores.height();
    if (conHeight) {
      center.css({
        marginTop: cvH + (conHeightAfterCvh - centerH) / 2
      });
    }
    if (lastH) {
      last.css({
        marginTop: cvH + (conHeightAfterCvh - lastH) / 2
      });
    }
    if (afters.length) {
      afters.css({
        marginTop: (conHeight - aftersH) / 2
      });
      var aftersFirstRow = afters.find('.rowRight_in_loop').first();
      var aftersFirstRowH = aftersFirstRow.height();
      afters
        .find('.rowRight_in_loop .rowRightLine')
        .first()
        .css({
          top: 9 + (9 - parseInt(this.lineWidth)) / 2 + cvH,
          height: aftersFirstRowH - cvH
        });
    }
    if (befores.length) {
      befores.css({
        marginTop: cvH + (conHeightAfterCvh - beforesH) / 2
      });
    }

    // console.log(conHeight, centerH);
    // console.log(con);
  },
  starter: function () {
    var con = $(this.containerSelector);
    var res = this.res;
    var param = this.param;
    // 添加一次style
    if (!$('#cusLoop_cs')[0]) {
      // console.log($('style').last().parent());
      $('style')
        .last()
        .parent()
        .append(this.createStyle());
    }
    var rowData = res.data;
    console.log(rowData); // 输出拿到的数据
    if (!rowData.length) {
      html = $('<div class="nulldatagrid" style="height: 100px;"><h1 class="nulldataDetail" style="padding: 3px 20px;">暂无数据</h1></div>');
    } else if (param.showData) {
      // 如果是按原始数据显示
      var data = this.showData(rowData);
      html = this.render(data, param.index + 1);
    } else {
      var data = this.handleData(rowData);
      html = this.render(data, param.index + 1);
    }
    // 设置overflow样式
    con
      .css({
        maxWidth: 1000,
        overflow: 'auto'
      })
      .empty()
      .html(html);
    this.justifyStyle(param.index); // 调整样式
  },
  init: function (param) {
    var _this = this;
    if (this.type) {
      // this.getDict('lis', function (res) {
      //   this.setDict(res.records);
      //   this.dictDone = true;
      //   if (this.dataDone) this.starter();
      // });
      // this.getDict('lis').then(res => { });
      this.dictDone = true;
    } else {
      this.dictDone = true;
    }
    if (param.test) {
      return this.render(this.testData);
    } else {
      var con = $(this.containerSelector);

      /* 当数据没有渲染完成时 */
      // var html = '<img class="center-block" src="../resources/image/load.gif" width="100px" height="100px">';
      var html = '<h3 style="padding: 0 30px;">数据加载中...</h3>';
      con && con.empty().html(html);

      this.getData(param).then(function(res) {
        _this.res = res;
        _this.dataDone = true;
        if (_this.dictDone) _this.starter();
      });

      // this.getData(param, function (res) {
      //   this.res = res;
      //   this.dataDone = true;
      //   if (this.dictDone) this.starter();
      // });
    }
  }
};

function handleLisN(data) {
  // console.log(data);
  var lis = {
    tableData: [],
    row: this.setting.lisNormGrid
  };
  var gridAbnormal = this.setting.gridAbnormal;
  var extraLisData = (this.setting.labelConfig.popUpWindow.popTwo && this.setting.labelConfig.popUpWindow.popTwo.lisData) || {};
  var lisItemResultInfo = [];
  data.forEach(function(d) {
    d.lisItemResultInfo.forEach(function(lir) {
      lisItemResultInfo.push(lir);
    });
  });
  lisItemResultInfo.forEach(function(item) {
    var tbi = {};
    for (var key in lis.row) {
      var val = item[key];
      if (key == gridAbnormal.key) {
        for (var i = 0; i < gridAbnormal.replaces.length; i++) {
          if (val == gridAbnormal.replaces[i].split('|')[0]) {
            val = gridAbnormal.replaces[i].split('|')[1];
            break;
          }
        }
      }
      tbi[key] = val;
    }
    // 携带检验弹窗数据
    for (var key in extraLisData) {
      tbi[key] = item[key];
    }
    lis.tableData.push(tbi);
  });

  // 携带异常位置
  var index = -1;
  for (var key in lis.row) {
    index++;
    if (key == gridAbnormal.key) break;
  }
  lis.abnIndex = index;

  // console.log('lis', lis);
  return lis;
}
