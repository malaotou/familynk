var Utils = {
  sendResponse(res, status, message, data) {
    res.send(data)
    res.end();
  },
  getNewReltion(sex, relation) {
    return new Promise((resolve, reject) => {
      switch (relation) {
        case 1: // 父亲 
          if (sex == 1) {
            resolve({
              relation: "儿子",
              relationId: 9
            })
          } else {
            resolve({
              relation: "女儿",
              relationId: 10
            })
          };
          break;
        case 2: // 妈妈
          if (sex == 1) {
            resolve({
              relation: "儿子",
              relationId: 9
            });
          } else {
            resolve({
              relation: "女儿",
              relationId: 10
            })
          };
          break;
        case 3: // 哥哥
          if (sex == 1) {
            resolve({
              relation: "弟弟",
              relationId: 5
            });
          } else {
            resolve({
              relation: "妹妹",
              relationId: 6
            });
          };
          break;
        case 4: // 姐姐
          if (sex == 1) {
            resolve({
              relation: "弟弟",
              relationId: 5
            });;
          } else {
            resolve({
              relation: "妹妹",
              relationId: 6
            });
          };
          break;
        case 5: // 弟弟
          if (sex == 1) {
            resolve({
              relation: "哥哥",
              relationId: 3
            });
          } else {
            resolve({
              relation: "妹妹",
              relationId: 4
            });
          };
          break;
        case 6: // 妹妹
          if (sex == 1) {
            resolve({
              relation: "哥哥",
              relationId: 3
            });

          } else {
            resolve({
              relation: "妹妹",
              relationId: 4
            });
          };
          break;
        case 7: // 老婆
          resolve({
            relation: "老公",
            relationId: 8
          });
          break;
        case 8: // 老公
          resolve({
            relation: "老婆",
            relationId: 7
          });
          break;
        case 9: // 儿子
          if (sex == 1) {
            resolve({
              relation: "爸爸",
              relationId: 1
            });
          } else {
            resolve({
              relation: "妈妈",
              relationId: 2
            });
          };
          break;
        case 10: // 女儿
          if (sex == 1) {
            resolve({
              relation: "爸爸",
              relationId: 1
            });;
          } else {
            resolve({
              relation: "妈妈",
              relationId: 2
            });
          };
          break;
      }
    })
  }
}
module.exports = Utils;