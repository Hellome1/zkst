/* 绘制canvas使用的原始数据 */
let arr = [
  {
    complex: true,
    x: 0,
    y: 0,
    w: 380,
    h: 130,
    padding: 8,
    name: 'header',
    logo: true,
    texts: [
      { align: 'center', fontSize: 20, value: '重庆市中医院' },
      { align: 'center', fontSize: 20, value: '门(急) 诊 处 方', marginTop: 3, rowId: 1 },
      // { align: 'left', fontSize: 16, value: '费别：公费 自费', marginTop: 35, rowId: 2 },
      { align: 'right', fontSize: 16, value: 'No: {{medPrescNo}}', marginTop: 35, rowId: 2 },
      { align: 'left', fontSize: 16, values: '科室：{{encDeptName}}', w: 280, marginTop: 5, rowId: 3 },
      { align: 'right', fontSize: 16, value: '{{encStartTime}}', marginTop: 5, rowId: 3 }
    ]
  },
  { x: 10, y: 20, w: 30, h: 50, text: '姓名' },
  { x: 40, y: 20, w: 90, h: 50, text: '{{name}}' },
  { x: 130, y: 20, w: 60, h: 25, text: '性别' },
  { x: 190, y: 20, w: 60, h: 25, text: '{{gender}}' },
  { x: 250, y: 20, w: 60, h: 25, text: '年龄' },
  { x: 310, y: 20, w: 80, h: 25, text: '{{age}}' },
  { x: 130, y: 45, w: 100, h: 25, text: '平台就诊号' },
  { x: 230, y: 45, w: 160, h: 25, text: '{{hdcEncId}}' },
  { x: 10, y: 70, w: 120, h: 30, text: '单位或家庭住址' },
  { x: 130, y: 70, w: 260, h: 30, text: '-' },
  { x: 10, y: 100, w: 120, h: 30, rowId: 6, text: '临床诊断及类型' },
  { x: 130, y: 100, w: 260, h: 30, rowId: 6, text: '{{diagnoseName}}' },
  {
    complex: true,
    x: 0,
    y: 1,
    w: 380,
    h: 200,
    name: 'medicine',
    padding: 8,
    texts: [
      { align: 'left', fontSize: 16, value: 'RP:' },
      {
        align: 'left',
        textIndent: 50,
        fontSize: 20,
        values: '{{medicine}}'
      },
      { align: 'right', marginRight: 30, marginTop: 30, fontSize: 18, value: '{{frequency}}' },
      // { align: 'right', marginRight: 30, marginTop: 0, fontSize: 18, value: '分早晚两次空腹温服' },
      { align: 'right', marginRight: 30, marginTop: 30, fontSize: 16, value: '{{ordDocName}}' }
    ]
  }
  // { x: 130, y: 100, w: 30, h: 50, text: '医师' },
  // { x: 130, y: 100, w: 130, h: 50, text: '高山' },
  // { x: 130, y: 100, w: 80, h: 50, text: '药品金额及收讫章' },
  // { x: 130, y: 100, w: 140, h: 50, text: '37.5元 李莉' },
  // { x: 130, y: 100, w: 30, h: 50, text: '审核' },
  // { x: 130, y: 100, w: 65, h: 50, text: '孙兰' },
  // { x: 130, y: 100, w: 30, h: 50, text: '调配' },
  // { x: 130, y: 100, w: 65, h: 50, text: '孙兰' },
  // { x: 130, y: 100, w: 30, h: 50, text: '核对' },
  // { x: 130, y: 100, w: 65, h: 50, text: '吴兰' },
  // { x: 130, y: 100, w: 30, h: 50, text: '发药' },
  // { x: 130, y: 100, w: 65, h: 50, text: '吴兰' },
  // {
  //   complex: true,
  //   x: 0,
  //   y: 0,
  //   w: 380,
  //   h: 100,
  //   padding: 8,
  //   logo: true,
  //   texts: [
  //     { align: 'left', fontSize: 14, values: '注：1. 本处方两日内有效。' },
  //     { align: 'left', fontSize: 14, textIndent: 27, values: '2. 取药时请您当面核对药品名称、规格、数量' },
  //     { align: 'left', fontSize: 14, textIndent: 27, values: '3. 延长处方用量时间原因：慢性病 外地 其他' }
  //   ]
  // }
];

const offset = { x: 10, y: 10, maxWidth: 400 }; // 设置处方笺的位置，最大宽度
const fontFamily = "'sans-serif Arial 宋体 微软雅黑'"; // 设置处方笺字体
const fontSeriesString = '16px ' + fontFamily; // 处方笺通用字体
let size = {}; // 记录处方笺最终大小用于重绘

let rawArr; // 记录原始数据，用于新数据到来时赋给arr

// 设置就诊信息
export function setEncInfo(info) {
  arr.forEach(it => {
    if (it.name && it.name === 'header') {
      let texts = it.texts || [];
      texts.forEach(text => {
        if (text.value) {
          text.value = text.value.replace(/{{encStartTime}}/g, info.encStartDate || '');
        } else if (text.values) {
          text.values = text.values.replace(/{{encDeptName}}/g, info.encDeptName || '');
        }
      });
    } else if (it.text && it.text.indexOf('{{') > -1) {
      it.text = it.text.replace(/{{hdcEncId}}/g, info.hdcEncId || '').replace(/{{diagnoseName}}/g, info.diagStr || '');
    }
  });
}

// 设置病人信息
export function setPatientInfo(info) {
  arr.forEach(it => {
    if (it.text && it.text.indexOf('{{') > -1) {
      it.text = it.text
        .replace(/{{name}}/g, info.name || '')
        .replace(/{{gender}}/g, info.gender || '')
        .replace(/{{age}}/g, info.age || '');
    }
  });
  rawArr = copy(arr, true);
}

// 设置处方信息
export function setData(datas) {
  arr.forEach(it => {
    if (it.name && it.name === 'medicine') {
      let texts = it.texts || [];
      texts.forEach(text => {
        if (text.value) {
          text.value = text.value
            .replace(/{{frequency}}/g, datas.frequency || '')
            .replace(/{{ordDocName}}/g, datas.ordDocName ? '医师 ' + datas.ordDocName : '');
        } else if (text.values) {
          text.values = text.values.replace(/{{medicine}}/g, datas.medicine);
        }
      });
    } else if (it.name === 'header') {
      let texts = it.texts || [];
      texts.forEach(text => {
        if (text.value) {
          text.value = text.value.replace(/{{medPrescNo}}/g, datas.medPrescNo || '');
        }
      });
    }
  });
}

export function resetArr() {
  arr = copy(rawArr, true);
  size = {};
}

// 画表入口
function drawLittleGrid(dom) {
  let c = dom.getContext('2d');

  let devicePixelRatio = window.devicePixelRatio || 1,
    backingStoreRatio = c.webkitBackingStorePixelRatio || 1;
  let ratio = devicePixelRatio / backingStoreRatio;
  c.scale(ratio, ratio); // 设置缩放比，解决字模糊的问题

  c.textBaseline = 'top';
  c.font = fontSeriesString;
  let offsetX = offset.x,
    offsetY = offset.y,
    currentX = 0,
    currentY = 0,
    memoryCompass = null,
    rowMinHeight = null;
  for (let i = 0; i < arr.length; i++) {
    if (rowMinHeight === null) {
      if (i - 1 >= 0 && arr[i - 1].w + arr[i].w > offset.maxWidth) {
        rowMinHeight = arr[i - 1].h;
      } else {
        rowMinHeight = arr[i].h;
      }
    } else if (arr[i].h < rowMinHeight) {
      if (i - 1 >= 0 && arr[i - 1].w + arr[i].w > offset.maxWidth) {
        rowMinHeight = arr[i - 1].h;
      } else {
        if (currentX + arr[i].w < offset.maxWidth) {
          memoryCompass = i;
          rowMinHeight = arr[i].h;
        }
      }
    }
    if (currentX + arr[i].w > offset.maxWidth) {
      currentX = memoryCompass ? arr[memoryCompass].x - offsetX + 0.5 : 0;
      currentY += rowMinHeight;
      memoryCompass = null;
      rowMinHeight = null;
    }
    arr[i].x = currentX + offsetX;
    arr[i].y = currentY + offsetY;
    currentX += arr[i].w;
    if (arr[i].complex) {
      draw_withMoreFunction(c, arr[i]);
      if (arr[i].logo) logo(c);
      c.font = fontSeriesString;
    } else {
      c.lineWidth = 1;
      arr[i].x = arr[i].x - 0.5;
      arr[i].y = arr[i].y - 0.5;
      let txts = arr[i].text.split(''),
        textWidth = c.measureText(arr[i].text).width,
        minPadding = 3,
        paddingX = (arr[i].w - textWidth) / 2,
        singleTextHeight = 16,
        paddingY = (arr[i].h - singleTextHeight) / 2,
        txt = '',
        finalTxts = [],
        textHeight = singleTextHeight;
      if (paddingX < minPadding) {
        for (let j = 0; j < txts.length; j++) {
          let trytxt = txt;
          trytxt += txts[j];
          let trytxtWidth = c.measureText(trytxt).width,
            trytxtPadding = (arr[i].w - trytxtWidth) / 2;
          if (trytxtPadding < minPadding) {
            if (txt) j--;
            finalTxts.push(txt);
            textHeight += singleTextHeight;
            txt = '';
          } else if (j === txts.length - 1 && j) {
            txt += txts[j];
            finalTxts.push(txt);
            txt = '';
          } else {
            txt += txts[j];
          }

          let txtWidth = c.measureText(txt).width,
            txtPadding = (arr[i].w - txtWidth) / 2;
          if (paddingX > 0) {
            paddingX = Math.min(paddingX, txtPadding);
          } else {
            paddingX = txtPadding;
          }
        }
      }
      let height = Math.max(arr[i].h, textHeight + minPadding * 2);
      arr[i].h = height;
      if (arr[i].rowId && i - 1 >= 0 && height > arr[i - 1].h && arr[i - 1].rowId && arr[i].rowId === arr[i - 1].rowId) arr[i - 1].h = height;
      let newPadding = (height - textHeight) / 2;
      paddingY = paddingY > 0 ? paddingY : 0;
      if (newPadding > 0) {
        paddingY = Math.floor(newPadding);
      }
      if (finalTxts.length) {
        for (let j = 0; j < finalTxts.length; j++) {
          c.fillText(finalTxts[j], arr[i].x + paddingX, arr[i].y + paddingY + 1 + j * singleTextHeight);
        }
      } else {
        c.fillText(arr[i].text, arr[i].x + paddingX, arr[i].y + paddingY + 1);
      }

      c.strokeRect(arr[i].x, arr[i].y, arr[i].w, height);
    }
  }

  if (dom.dynamic === false) {
    size.height = size.height ? size.height + currentY : currentY + arr[arr.length - 1].h;
    size.width = 400;
    dom.height = ratio * (size.height + 2 * offset.y);
    dom.width = ratio * size.width;
    dom.style.height = size.height + 2 * offset.y + 'px';
    dom.style.width = size.width + 'px';
    dom.dynamic = true;
    drawLittleGrid(dom);
  }
}

// 画框，框里文字有多种排版方式
function draw_withMoreFunction(c, infos) {
  let texts = infos.texts,
    padding = infos.padding,
    currentY = padding;
  infos.x = infos.x - 0.5; // 减0.5让边框更清晰
  infos.y = infos.y - 0.5;
  currentY += infos.y;
  let initialCurrentY = currentY - padding; // 初始触笔的y值，用于计算文字画完之后的高度是否超过了设定的高度
  for (let i = 0; i < texts.length; i++) {
    let text = texts[i],
      align = text.align,
      textHeight = text.fontSize,
      font = textHeight + 'px ' + fontFamily,
      textWidth,
      x,
      y,
      textSpace = 0;

    if (typeof text.value === 'string' && text.value.match(/^\s*$/)) {
      continue;
    }
    if (i) textSpace = text.marginTop || 3;
    if (i === 0) textHeight = 0;
    y = currentY + textSpace + textHeight;
    if (text.values) {
      let txts = text.values.split(''),
        lineBetween = 3,
        maxWidthOfValues = text.w || infos.w,
        smallFontHeight = textHeight - 2;
      text.textIndent = text.textIndent || 0;
      x = offset.x + padding + text.textIndent;
      c.font = font;
      text.y = y;
      for (let j = 0; j < txts.length; j++) {
        let txt = txts[j],
          txtWidth;

        while (/\d/.test(txts[j + 1]) && j + 1 < txts.length) {
          txt += txts[j + 1];
          j++;
        }
        txtWidth = c.measureText(txt).width;
        if (x - offset.x + txtWidth + padding > maxWidthOfValues) {
          y += textHeight + lineBetween;
          x = offset.x + padding;
        }
        if (txt.indexOf('<') > -1 && j + 2 < txts.length - 1 && txts[j + 2].indexOf('>') > -1) {
          c.font = smallFontHeight + 'px ' + fontFamily;
          j += 2;
        } else if (txt.indexOf('<') > -1 && j + 3 < txts.length - 1 && txts[j + 1].indexOf('/') > -1 && txts[j + 3].indexOf('>') > -1) {
          c.font = font;
          j += 3;
        } else {
          if (c.font.indexOf(smallFontHeight + 'px') > -1) {
            c.fillText(txt, x, y + 2);
          } else {
            c.fillText(txt, x, y);
          }
          x += txtWidth;
        }
      }
      currentY = y;
    } else {
      c.font = font;
      textWidth = c.measureText(text.value).width;

      switch (align) {
        case 'center':
          x = (infos.w - textWidth) / 2;
          x = x > padding ? x : padding;
          break;
        case 'right':
          x = infos.w - textWidth - padding;
          if (text.marginRight) x -= text.marginRight;
          x = x > padding ? x : padding;
          break;
        case 'left':
          x = padding;
        default:
          break;
      }

      x += offset.x;
      if (text.textIndent) x += text.textIndent;
      if (i - 1 >= 0 && text.rowId && texts[i - 1].rowId === text.rowId) y = texts[i - 1].y;
      text.y = y;
      c.fillText(text.value, x, y);
      currentY = y > currentY ? y : currentY;
    }
    if (i === texts.length - 1) currentY += textHeight;
  }

  if (currentY - initialCurrentY > infos.h - 8) {
    infos.h = currentY - initialCurrentY + 8;
    if (infos === arr[arr.length - 1]) size.height = infos.h;
  }
  c.strokeRect(infos.x, infos.y, infos.w, infos.h);
}

// canvas定制画logo
function logo(c) {
  c.beginPath();
  let logoLeft = 315,
    logoTop = 40,
    logoX = logoLeft + offset.x,
    logoY = logoTop + offset.y;
  c.font = '18px' + fontFamily;
  c.fillText('普', logoX, logoY);
  let textWidth = c.measureText('普').width;
  oval(c, logoX, logoY, textWidth);
}

// canvas贝塞尔曲线模仿椭圆
function oval(c, logoX, logoY, textWidth) {
  let x,
    y,
    rl = 22,
    rs = 18;
  x = logoX + textWidth / 2;
  y = logoY + 9;
  c.lineWidth = 3;
  c.moveTo(x - rl, y);
  let adjust = 1;
  c.quadraticCurveTo(x - rl + adjust, y + rs - adjust, x, y + rs);
  c.quadraticCurveTo(x + rl - adjust, y + rs - adjust, x + rl, y);
  c.quadraticCurveTo(x + rl - adjust, y - rs + adjust, x, y - rs);
  c.quadraticCurveTo(x - rl + adjust, y - rs + adjust, x - rl, y);
  c.stroke();
}

export { drawLittleGrid };

export function copy() {
  var target = arguments[0];
  var isDept = arguments[1] === true;
  var count = arguments[2] || 0;
  count++;
  if (count > 10) {
    var errMsg = 'Error: loopCount has been over maximum count limits, which is "10"!';
    console.error(errMsg);
    return errMsg;
  }
  if (isDept) {
    var duplicate;
    if (target instanceof Array) {
      duplicate = [];
      for (var i = 0; i < target.length; i++) {
        duplicate.push(copy(target[i], isDept, count));
      }
    } else if (target instanceof Function) {
      duplicate = target;
    } else if (target instanceof Object) {
      duplicate = {};
      for (var k in target) {
        duplicate[k] = copy(target[k], isDept, count);
      }
    } else {
      duplicate = target;
    }
    return duplicate;
  } else {
    var duplicate;
    if (target instanceof Array) {
      duplicate = [];
      for (var i = 0; i < target.length; i++) {
        duplicate.push(target[i]);
      }
    } else if (target instanceof Function) {
      duplicate = target;
    } else if (target instanceof Object) {
      duplicate = {};
      for (var k in target) {
        duplicate[k] = target[k];
      }
    } else {
      duplicate = target;
    }
    return duplicate;
  }
}
