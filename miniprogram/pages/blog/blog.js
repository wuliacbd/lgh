import common from "../../js/common.js"
const app = getApp()
var pathArr = [];
var formData = {};
Page({

  /**
   * 页面的初始数据
   */
  data: {
    btnDis: true,
    addName: "",
    fileList: [],
    tempPath: [],
  },
  //监听数据的内容
  onChange(e) {
    var val = e.detail.value
    if (val.length > 0) {
      this.setData({
        btnDis: false
      })
    } else {
      this.setData({
        btnDis: true
      })
    }
  },

  //点击获取位置
  getAddress() {
    //读取用户的设置
    wx.getSetting({
      success: res => {
        if (res.authSetting['scope.userLocation']) {
          this.openMap();
        } else {
          //获取用户授权
          wx.authorize({
            scope: "scope.userLocation",
            success: res => {
              this.openMap();
            },
            fail: err => {
              var usLction = wx.getStorageSync('usLction');
              if (usLction) {
                //引动用户获取位置
                this.getUserLocation()
              }
              wx.setStorageSync('usLction', true)
            }
          })
        }


      }
    })




  },
  //打开地图
  openMap() {
    wx.chooseLocation({
      success: (res) => {
        console.log(res)
        this.setData({
          addName: res.name
        })
      }
    })
  },

  //引导用户获取到位置
  getUserLocation() {
    wx.getSetting({
      success: res => {
        if (!res.authSetting['scope.userLocation']) {
          wx.showModal({
            title: '是否授权获取你的位置',
            content: '只要获取你的位置才能进行后续操作',
            success: res => {
              if (res.confirm) {
                wx.openSetting({
                  success: res => {
                    if (res.authSetting['scope.userLocation']) {
                      wx.showToast({
                        title: '授权成功',
                        icon: "success"
                      })
                      setTimeout(() => {
                        this.openMap()
                      }, 1000)
                    }
                  }
                })
              }
            }
          })
        }
      }
    })
  },

  //提交表单
  onSubmit(res) {
    wx.showLoading({
      title: '数据记载中...'
    })

    var content = res.detail.value.content
    var addname = this.data.addName
    var phone = wx.getSystemInfoSync().model
    var userInfo = app.globalData.userInfo

    var subData = {
      content,
      addname,
      phone,
      userInfo
    }
    if (this.data.tempPath.length) {
      this.data.tempPath.forEach((item, idx) => {
        let suffix = /\.\w+$/.exec(item)[0];
        var filename = new Date().getTime() + suffix;
        wx.cloud.uploadFile({
          cloudPath: filename,
          filePath: item,
        }).then(res => {
          pathArr.push(res.fileID)
          console.log(pathArr)
          if (pathArr.length == this.data.tempPath.length) {
            subData.picUrl = pathArr
            this.pushCloud(subData)
          }
        })
      })
    }


    console.log(subData)
    // var { fileList, vdoUrl}=this.data
    // var d=new Date();
    // var year=d.getFullYear();
    // var month=d.getMonth()+1
    // var day=d.getDate();
    // month = month < 10 ? "0" + month : month + ""
    // day = day < 10 ? "0" + day : day+""
    // var newDate = year+month+day;
    // if(fileList.length>0){      

    //   var uploading=fileList.map((item,idx)=>{
    //     return this.uploadFilePromise("blogImg/" + newDate + "/" + 
    //     common.guid() + 
    //     common.gHz(item.path),item)
    //   })
    //   Promise.all(uploading).then(res=>{         
    //     var newFileArr= res.map(item=>{
    //       return item.fileID
    //     })        
    //     subData.imgUrl = newFileArr
    //     this.pushCloud(subData);
    //     this.showToast();        
    //   })  
    //   return;    
    // }
    // if (vdoUrl){
    //   var vdoPremoise=this.uploadFilePromise
    //   ("blogImg/" + newDate + "/" + common.guid() + common.gHz(vdoUrl), 
    //   { path: vdoUrl})
    //   vdoPremoise.then(res=>{        
    //     var vdoSrc=res.fileID
    //     subData.vdoSrc = vdoSrc
    //     this.pushCloud(subData);
    //     this.showToast();
    //   })
    //   return;
    // }

    // this.pushCloud(subData)
    this.showToast();
  },

  //发布成功后的操作
  showToast() {
    wx.showToast({
      title: '发布成功',
      duration: 1000
    })
    setTimeout(res => {
      var pages = getCurrentPages();
      var beforePage = pages[pages.length - 2];
      beforePage.onLoad();
      wx.reLaunch({
        url: '/pages/pengyouquan/index',
      })
    }, 1500)

  },

  // 进行云存储
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
  //发送到云函数
  pushCloud(subData) {
    wx.cloud.callFunction({
      name: "ktblog_add",
      data: subData,
      success: res => {
        console.log(res)
        wx.hideLoading()
      }
    })
  },

  //处理图像
  afterReadImg(res) {
    console.log(res)
    var oldArr = this.data.fileList
    var newArr = oldArr.concat(res.detail.file)
    this.setData({
      fileList: newArr
    })
  },

  //删除图像
  delImg(res) {
    console.log(res)
    var idx = res.detail.index
    this.data.fileList.splice(idx, 1);
    this.setData({
      fileList: this.data.fileList
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

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.setData({
      tapIdx: options.tapIdx
    })
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {

  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {

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