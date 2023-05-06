let name = ''
let food = ''
let content = ''
let jiang = ''
let filepath = ''
var pathArr = [];
var formData = {};
var steps = [];
var demo = require("../../utils/util")
var common = require("../../utils/common.js")
const app = getApp()
const _ = wx.cloud.database().command
Page({

  /**
   * 页面的初始数据
   */
  data: {
    tempPath: [],
    shows: false, //控制下拉列表的显示隐藏，false隐藏、true显示
    selectDatas: [''], //下拉列表的数据
    indexs: 0, //选择的下拉列 表下标,
    caixiList: [],
    steps: {}
  },
  selectTaps() {
    this.setData({
      shows: !this.data.shows,
    });

  },
  // 点击下拉列表
  optionTaps(e) {
    let Indexs = e.currentTarget.dataset.index; //获取点击的下拉列表的下标
    console.log(Indexs)
    app.globalData.caixi = this.data.selectDatas[Indexs]
    this.setData({
      indexs: Indexs,
      shows: !this.data.shows,

    });

  },
  getcaixi() {
    const db = wx.cloud.database();
    const _ = db.command;
    db.collection('caixi').field({
      title: true,
      _id: false
    }).get().then(res => {
      if (this.data.selectDatas[1] == null || this.data.selectDatas[1] == undefined) {
        let newList = res.data
        let selectDatas = this.data.selectDatas
        for (let i in newList) {
          selectDatas.push(newList[i].title);
        }
        this.setData({
          selectDatas: selectDatas
        })
      }
      else {
        console.log(1231)
      }


    })
  },
  addImg() {
    wx.chooseImage({
      count: 9,
      success: res => {
        var oldPath = this.data.tempPath
        var newPath = oldPath.concat(res.tempFilePaths).slice(0, 9)
        console.log(res)
        this.setData({
          tempPath: newPath
        })
      }
    })
  },

  clickDel(res) {
    var idx = res.currentTarget.dataset.idx
    var tempPath = this.data.tempPath
    tempPath.splice(idx, 1)
    this.setData({
      tempPath: tempPath
    })
  },

  showBigImg(res) {
    var idx = res.currentTarget.dataset.idx
    wx.previewImage({
      urls: this.data.tempPath,
      current: this.data.tempPath[idx]
    })
  },
  getID() {
    db.collection('recipe').where({
      name: formData.name,
      author: app.globalData.nickName,
      imageurl: formData.picUrl,
      food: formData.source,
      jiang: formData.jiang,
    }).get().then(res => {
      if (res.data[0]._id == undefined) {
        this.getID()

      }
      else {
        console.log(res.data[0]._id)
        app.globalData.nameiiid = res.data[0]._id
      }
    })
  },
  push() {
    const db = wx.cloud.database();
    db.collection('caixi')
      .where({
        title: app.globalData.caixi
      })
      .update({
        data: {
          nameList: _.push(
            {
              name: formData.name,
              imageurl: formData.picUrl,
              author: app.globalData.nickName,
              food: formData.source,
              jiang: formData.jiang,
              nameiiiid: app.globalData.nameiiid,
            })
        }
      }).then(res => {
        console.log(app.globalData.nameiiid)
      })
  },
  //上传到云数据库
  pushCloud(formData) {
    console.log(steps)
    const db = wx.cloud.database();
    db.collection('recipe').add({
      data: {
        caixi: app.globalData.caixi,
        name: formData.name,
        author: app.globalData.nickName,
        food: formData.source,
        jiang: formData.jiang,
        imageurl: formData.picUrl,
        steps: steps,
        time: demo.formatTime(new Date(), "Y-M-D"),
      }
    }).then(res => {
      db.collection('recipe').where({
        caixi: app.globalData.caixi,
        name: formData.name,
        author: app.globalData.nickName,
        imageurl: formData.picUrl,
        food: formData.source,
        jiang: formData.jiang,
      }).get().then(res => {
        console.log(res)
        if (res.data[0]._id == undefined) {
          this.getID()
        }
        else {
          console.log(res.data[0]._id)
          app.globalData.nameiiid = res.data[0]._id
        }
        this.push()

      })


      pathArr = [];

      wx.showToast({

        title: '发布成功'
      })
      wx.hideLoading();
      steps = [];
      setTimeout(res => {
        wx.reLaunch({
          url: '/pages/index/index',
        })
      }, 1500)
    })
    // this.getID()





  },
  //表单提交

  onSubmit(res) {
    wx.showLoading({
      title: '发布中...',
      mask: true
    })
    formData = res.detail.value

    console.log(formData)
    var name = res.detail.value.name
    var food = res.detail.value.source
    var jiang = res.detail.value.jiang
    if (name.length == 0 || food.length == 0 || jiang.length == 0) {
      wx.showToast({
        title: '未填写完成',
        icon: "none",
        mask: true
      })
      return;
    }
    if (this.data.tempPath.length) {
      this.data.tempPath.forEach((item, idx) => {
        let suffix = /\.\w+$/.exec(item)[0];
        var filename = new Date().getTime() + suffix;
        this.uploadFile(filename, item)
      })
    }
    else {
      this.pushCloud(formData)
    }

    //this.pushCloud(formData)
  },
  //更新文件夹名

  uploadFile(filename, path) {
    wx.cloud.uploadFile({
      cloudPath: filename,
      filePath: path
    }).then(res => {
      pathArr.push(res.fileID)
      console.log(pathArr)
      if (pathArr.length == this.data.tempPath.length) {
        formData.picUrl = pathArr
        this.pushCloud(formData)
      }
    })
  },
  // getTitle(e){
  //   title=e.detail.value;
  //   console.log(title)
  // },
  // getAuthor(e){
  //   author=e.detail.value;
  //   console.log(author)
  // },
  // getContent(e){
  //   content=e.detail.value;
  //   console.log(content)
  // },
  //   addArticle(){
  //     if(title==''){
  //       wx.showToast({
  //       icon : 'none' ,
  //       title:'标题为空',
  //       })
  //     }
  //     else if(author==''){
  //       wx.showToast({
  //       icon : 'none' ,
  //       title:'作者为空',
  //       })
  //     }
  //     else if(content==''){
  //       wx.showToast({
  //       icon : 'none' ,
  //       title:'内容为空',
  //       })
  //     }
  //     else{
  //       const db = wx.cloud.database();
  //       db.collection('dynamics').add({
  //         data:{
  //         title:title,
  //         author:author,
  //         content:content,
  //         imageurl:this.data.imgbox,
  //         time:demo.formatTime(new Date(),"Y-M-D"),
  //         }
  //       })
  //       .then( res =>{
  //         console.log('添加成功', res)

  //     })
  //     wx.switchTab({
  //       url: '/pages/dynamic/dynamic',
  //     })
  //   }
  // },
  // upload(){
  //     // let that = this;
  //     // 选择一张图片
  //     wx.chooseImage({
  //       count: 1,
  //       sizeType: ['original', 'compressed'],
  //       sourceType: ['album', 'camera'],
  //       success: (res) => {
  //         // tempFilePath可以作为img标签的src属性显示图片
  //         const tempFilePaths = res.tempFilePaths[0]
  //         // that.uploadFile(tempFilePaths) 如果这里不是=>函数
  //         //则使用上面的that = this
  //         this.uploadFile(tempFilePaths) 
  //       },
  //     })
  //   },
  //   //上传操作
  //   uploadFile(filePath) {
  //     wx.cloud.uploadFile({
  //       cloudPath: (new Date()).valueOf()+'.png', // 文件名
  //       filePath: filePath, // 文件路径
  //       success: res => {
  //         // get resource ID
  //         console.log(res.fileID)
  //         filepath=res.fileID
  //       },
  //       fail: err => {
  //         // handle error
  //       }
  //     })
  //   },
  // imgDelete1: function (e) {
  //   let that = this;
  //   let index = e.currentTarget.dataset.deindex;
  //   let imgbox = this.data.imgbox;
  //   imgbox.splice(index, 1)
  //   that.setData({
  //     imgbox: imgbox
  //   });
  // },
  // // 选择图片 &&&
  // addPic1: function (e) {
  //   var imgbox = this.data.imgbox;
  //   console.log(imgbox)
  //   var that = this;
  //   var n = 5;
  //   if (5 > imgbox.length > 0) {
  //     n = 5 - imgbox.length;
  //   } else if (imgbox.length == 5) {
  //     n = 1;
  //   }
  //   wx.chooseImage({
  //     count: n, // 默认9，设置图片张数
  //     sizeType: ['original', 'compressed'], // 可以指定是原图还是压缩图，默认二者都有
  //     sourceType: ['album', 'camera'], // 可以指定来源是相册还是相机，默认二者都有
  //     success: function (res) {
  //       // console.log(res.tempFilePaths)
  //       // 返回选定照片的本地文件路径列表，tempFilePath可以作为img标签的src属性显示图片
  //       var tempFilePaths = res.tempFilePaths

  //       if (imgbox.length == 0) {
  //         imgbox = tempFilePaths
  //       } else if (5 > imgbox.length) {
  //         imgbox = imgbox.concat(tempFilePaths);
  //       }
  //       that.setData({
  //         imgbox: imgbox
  //       }); 

  //     }

  //   })
  // },

  // //图片
  // imgbox: function (e) {
  //   this.setData({
  //     imgbox: e.detail.value
  //   })
  // },
  // fb: function (e) {
  //   if (!this.data.imgbox.length) {
  //     wx.showToast({
  //       icon: 'none',
  //       title: '图片类容为空'
  //     });
  //   } else {
  //       //上传图片到云存储
  //       wx.showLoading({
  //         title: '上传中',
  //       })
  //       let promiseArr = [];
  //       for (let i = 0; i < this.data.imgbox.length; i++) {
  //         promiseArr.push(new Promise((reslove, reject) => {
  //           let item = this.data.imgbox[i];
  //           let suffix = /\.\w+$/.exec(item)[0];//正则表达式返回文件的扩展名
  //           wx.cloud.uploadFile({
  //             cloudPath: new Date().getTime() + suffix, // 上传至云端的路径
  //             filePath: item, // 小程序临时文件路径
  //             success: res => {
  //               this.setData({
  //                 fileIDs: this.data.fileIDs.concat(res.fileID)
  //               });
  //               console.log(res.fileID)//输出上传后图片的返回地址
  //               reslove();
  //               wx.hideLoading();
  //               wx.showToast({
  //                 title: "上传成功",
  //               })
  //             },
  //             fail: res=>{
  //               wx.hideLoading();
  //               wx.showToast({
  //                 title: "上传失败",
  //               })
  //             }

  //           })
  //         }));
  //       }
  //       Promise.all(promiseArr).then(res => {//等数组都做完后做then方法
  //         console.log("图片上传完成后再执行")
  //         this.setData({
  //           imgbox:[]
  //         })
  //       })

  //     }
  // },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {

  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {
    this.getcaixi()


  },

  /**
   * 生命周期函数--监听页面显示
   */

  onShow: function () {
    setTimeout(function () {
      if (app.globalData.con != null && app.globalData.con != undefined && app.globalData.picUrl != undefined && app.globalData.picUrl != null) {
        let temp = {
          con: app.globalData.con,
          picUrl: app.globalData.picUrl
        }
        steps.push(temp)
        console.log("444", steps)
        //  app.globalData.con=null
        //  app.globalData.picUrl=null
      }
    }, 2000)


  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function () {

  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function () {

  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function () {

  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {

  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  }
})