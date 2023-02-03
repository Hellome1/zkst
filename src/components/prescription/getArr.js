export function getArr(info) {
  let newArr = [
    { align: 'left', fontSize: 16, value: 'RP:' },
    // {
    //   align: 'left',
    //   textIndent: 50,
    //   fontSize: 20,
    //   values: `${info.medicine}`
    // },
    { align: 'right', marginRight: 30, marginTop: 30, fontSize: 18, value: `${info.frequency}` },
    // { align: 'right', marginRight: 30, marginTop: 0, fontSize: 18, value: '分早晚两次空腹温服' },
    { align: 'right', marginRight: 30, marginTop: 30, fontSize: 16, value: `医师 ${info.ordDocName}` }
  ];
  let medicine = info.medicine,
    len = medicine.length;
  for (let i = len - 1; i >= 0; i--) {
    let template = {
      align: 'left',
      textIndent: 50,
      fontSize: 20,
      values: medicine[i]
    };
    newArr.splice(1, 0, template);
  }
  return [
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
        { align: 'center', fontSize: 20, value: setting.header.hosInfo.hosName.split('专科视图')[0] || '医院' },
        { align: 'center', fontSize: 20, value: '门(急) 诊 处 方', marginTop: 3, rowId: 1 },
        // { align: 'left', fontSize: 16, value: '费别：公费 自费', marginTop: 35, rowId: 2 },
        { align: 'right', fontSize: 16, value: `No: ${info.medPrescNo}`, marginTop: 35, rowId: 2 },
        { align: 'left', fontSize: 16, values: `科室：${info.encDeptName}`, w: 280, marginTop: 5, rowId: 3 },
        { align: 'right', fontSize: 16, value: `${info.encStartDate}`, marginTop: 5, rowId: 3 }
      ]
    },
    { x: 10, y: 20, w: 30, h: 50, text: '姓名' },
    { x: 40, y: 20, w: 90, h: 50, text: `${info.name}` },
    { x: 130, y: 20, w: 60, h: 25, text: '性别' },
    { x: 190, y: 20, w: 60, h: 25, text: `${info.gender}` },
    { x: 250, y: 20, w: 60, h: 25, text: '年龄' },
    { x: 310, y: 20, w: 80, h: 25, text: `${info.age}` },
    { x: 130, y: 45, w: 100, h: 25, text: '平台就诊号' },
    { x: 230, y: 45, w: 160, h: 25, text: `${info.hdcEncId}` },
    { x: 10, y: 70, w: 120, h: 30, text: '单位或家庭住址' },
    { x: 130, y: 70, w: 260, h: 30, text: '-' },
    { x: 10, y: 100, w: 120, h: 30, rowId: 6, text: '临床诊断及类型' },
    { x: 130, y: 100, w: 260, h: 30, rowId: 6, text: `${info.diagnoseName}` },
    {
      complex: true,
      x: 0,
      y: 1,
      w: 380,
      h: 200,
      name: 'medicine',
      padding: 8,
      texts: newArr
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
}
