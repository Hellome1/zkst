export default function Prescription(tableArr) {
  if (!(this instanceof Prescription)) return new Prescription(tableArr);
  if (!(tableArr instanceof Array)) {
    console.error('Accepted param is not an Array!');
  } else {
    this.tableArr = tableArr;
    this.size = {};
    this.init();
    return this.presc;
  }
}

Prescription.prototype = {
  constructor: Prescription,
  offset: { x: 10, y: 10, maxWidth: 400 }, // 设置处方笺的位置，最大宽度
  fontFamily: "'sans-serif Arial 宋体 微软雅黑'", // 设置处方笺字体
  fontSeriesString: '', // 处方笺通用字体
  init() {
    let presc = document.createElement('canvas');
    presc.dynamic = false;
    presc.height = 660;
    presc.width = 400;
    this.presc = presc;
    this.draw(presc);
  },
  draw(dom) {
    let c = dom.getContext('2d');
    let arr = this.tableArr;
    this.fontSeriesString = '14px ' + this.fontFamily;

    let devicePixelRatio = window.devicePixelRatio || 1,
      backingStoreRatio = c.webkitBackingStorePixelRatio || 1;
    let ratio = devicePixelRatio / backingStoreRatio;
    c.scale(ratio, ratio); // 设置缩放比，解决字模糊的问题

    c.textBaseline = 'top';
    c.font = this.fontSeriesString;
    let offsetX = this.offset.x,
      offsetY = this.offset.y,
      currentX = 0,
      currentY = 0,
      memoryCompass = null,
      rowMinHeight = null;
    for (let i = 0; i < arr.length; i++) {
      if (rowMinHeight === null) {
        if (i - 1 >= 0 && arr[i - 1].w + arr[i].w > this.offset.maxWidth) {
          rowMinHeight = arr[i - 1].h;
        } else {
          rowMinHeight = arr[i].h;
        }
      } else if (arr[i].h < rowMinHeight) {
        if (i - 1 >= 0 && arr[i - 1].w + arr[i].w > this.offset.maxWidth) {
          rowMinHeight = arr[i - 1].h;
        } else {
          if (currentX + arr[i].w < this.offset.maxWidth) {
            memoryCompass = i;
            rowMinHeight = arr[i].h;
          }
        }
      }
      if (currentX + arr[i].w > this.offset.maxWidth) {
        currentX = memoryCompass ? arr[memoryCompass].x - offsetX + 0.5 : 0;
        currentY += rowMinHeight;
        memoryCompass = null;
        rowMinHeight = null;
      }
      arr[i].x = currentX + offsetX;
      arr[i].y = currentY + offsetY;
      currentX += arr[i].w;
      if (arr[i].complex) {
        this.draw_withMoreFunction(c, arr[i]);
        if (arr[i].logo) this.logo(c);
        c.font = this.fontSeriesString;
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
            if (paddingX > minPadding) {
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
      let size = this.size;
      size.height = size.height ? size.height + currentY : currentY + arr[arr.length - 1].h;
      size.width = 400;
      dom.height = ratio * (size.height + 2 * this.offset.y);
      dom.width = ratio * size.width;
      dom.style.height = size.height + 2 * this.offset.y + 'px';
      dom.style.width = size.width + 'px';
      dom.dynamic = true;
      this.draw(dom);
    }
  },
  // 画框，框里文字有多种排版方式
  draw_withMoreFunction(c, infos) {
    let texts = infos.texts,
      padding = infos.padding,
      currentY = padding,
      arr = this.tableArr;
    infos.x = infos.x - 0.5; // 减0.5让边框更清晰
    infos.y = infos.y - 0.5;
    currentY += infos.y;
    let initialCurrentY = currentY - padding; // 初始触笔的y值，用于计算文字画完之后的高度是否超过了设定的高度
    for (let i = 0; i < texts.length; i++) {
      let text = texts[i],
        align = text.align,
        textHeight = text.fontSize,
        font = textHeight + 'px ' + this.fontFamily,
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
        x = this.offset.x + padding + text.textIndent;
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
          if (x - this.offset.x + txtWidth + padding > maxWidthOfValues) {
            y += textHeight + lineBetween;
            x = this.offset.x + padding;
          }
          if (txt.indexOf('<') > -1 && j + 2 < txts.length - 1 && txts[j + 2].indexOf('>') > -1) {
            c.font = smallFontHeight + 'px ' + this.fontFamily;
            j += 2;
          } else if (txt.indexOf('<') > -1 && j + 3 <= txts.length - 1 && txts[j + 1].indexOf('/') > -1 && txts[j + 3].indexOf('>') > -1) {
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

        x += this.offset.x;
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
      if (infos === arr[arr.length - 1]) this.size.height = infos.h;
    }
    c.strokeRect(infos.x, infos.y, infos.w, infos.h);
  },
  // canvas定制画logo
  logo(c) {
    c.beginPath();
    let logoLeft = 315,
      logoTop = 40,
      logoX = logoLeft + this.offset.x,
      logoY = logoTop + this.offset.y;
    c.font = '18px' + this.fontFamily;
    c.fillText('普', logoX, logoY);
    let textWidth = c.measureText('普').width;
    this.oval(c, logoX, logoY, textWidth);
  },
  // canvas贝塞尔曲线模仿椭圆
  oval(c, logoX, logoY, textWidth) {
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
};
