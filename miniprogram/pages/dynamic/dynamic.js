const app = getApp();

Page({

  /**
   * 页面的初始数据
   */
  data: {
    admin: false,
    lists: [],              // 接收搜索的内容
    wxSearchData: '',       // 输入的值
  },
  getDetail(e) {
    let id = e.currentTarget.dataset.item._id
    wx.navigateTo({
      url: '/pages/dynamicdetail/dynamicdetail?id=' + id
    })
  },
  getData() {
    wx.cloud.callFunction({
      name: "getData"
    })
      .then(res => {
        this.setData({
          dataList: res.result.data
        })
      })
  },
  /* 搜索
   */
  wxSearchInput: function () {
    wx.navigateTo({
      url: '/pages/search/search',
    })
    // var that = this;

    // if (value.detail.value.length > 0) {
    //   const db = wx.cloud.database()
    //   var that = this
    //   db.collection('dynamics').where({
    //   //使用正则查询，实现对搜索的模糊查询
    //   title: db.RegExp({
    //   regexp: value.detail.value,
    //   //从搜索栏中获取的value作为规则进行匹配。
    //   options: 'i',
    //   //大小写不区分
    //   })
    //   }).get({
    //   success: res => {
    //   console.log(res)
    //   that.setData({
    //     wxSearchData: value.detail.value,
    //     lists: data
    //   })
    //   },
    //   fail: function (res) {console.log('失败') },
    //  complete: function (res) { },
    //   })
    // }
    // success: function (res) {
    //   if (res.code) {
    //     var data = that.data.lists;
    //     console.log(data)
    //     for (let i = 0; i < res.data.length; i++) {
    //         data.push(res.data[i]);
    //     }
    //     that.setData({
    //       wxSearchData: value.detail.value,
    //       lists: data
    //     })
    //   }
    // },
    //     fail: function (res) {console.log('失败') },
    //     complete: function (res) { },
    //   })
    // }
  },
  Bool() {
    if (app.globalData.myopenid == 'oJziv5dZFyKHfc8xgav8yyo7oelU') {
      this.setData({
        admin: true
      })
    }
    else {
      this.setData({
        admin: false
      })
    }
    wx.stopPullDownRefresh()
  },

  onLoad: function (options) {

    this.getData()
    this.Bool()
    wx.startPullDownRefresh()
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
  onPullDownRefresh: function (options) {
    this.getData()
    this.Bool()
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

  },
  onShow: function () {
    this.onLoad()
  }
})