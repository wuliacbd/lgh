// pages/addsteps/addsteps.js
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
  onSubmit(res) {
    wx.showLoading({
      title: '数据记载中...'
    })

    var content = res.detail.value.content
    app.globalData.con = content

    console.log("111", this.data.tempPath)
    if (this.data.tempPath.length) {
      console.log("t")
      this.data.tempPath.forEach((item, idx) => {
        console.log("z")
        let suffix = /\.\w+$/.exec(item)[0];
        var filename = new Date().getTime() + suffix;
        wx.cloud.uploadFile({
          cloudPath: filename,
          filePath: item,
        }).then(res => {
          console.log("c")
          app.globalData.picUrl = res.fileID

          console.log("222", app.globalData.con, app.globalData.picUrl)
          // pathArr.push(res.fileID)
          // if (pathArr.length == this.data.tempPath.length) {
          //   console.log(pathArr)
          //  app.globalData.picUrl = res.fileID
          //  console.log(app.globalData.con,app.globalData.picUrl)
          // }
        })
      })

    }
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
    wx.navigateBack({

    })
  },

  // 进行云存储

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