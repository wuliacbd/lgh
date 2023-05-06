let title = ''
const app = getApp();
Page({

  /**
   * 页面的初始数据
   */
  data: {
    active: 0,
    login: false,
    admin: false,
    himself: false,
  },
  goto() {
    if (app.globalData.myopenid != '' && app.globalData.myopenid != null && app.globalData.myopenid != undefined) {
      wx.navigateTo({
        url: '/pages/publish/publish',
      })
    }
    else {
      wx.navigateTo({
        url: '/pages/login/login'
      })
    }
    wx.stopPullDownRefresh()
  },
  Bool() {
    if (app.globalData.myopenid == 'oJziv5dZFyKHfc8xgav8yyo7oelU') {
      this.setData({
        admin: true
      })

    }
  },
  onOpen(event) {
    const { position, name } = event.detail;
    switch (position) {
      case 'right':
        Dialog.confirm({
          message: '确定删除吗？',
        }).then(() => {
          instance.close();
        });
        break;
    }
  },
  onDel(res) {
    var that = this
    const db = wx.cloud.database()
    const _ = db.command;
    var id = res.currentTarget.dataset.orderno
    db.collection('recipe').doc(id).get().then(res => {
      res.caixi = app.globalData.caixi
      res.name = app.globalData.name
    })
    wx.showModal({
      title: '提示',
      content: '确定要删除吗',
      success: function (res) {
        if (res.confirm) {
          db.collection('recipe').doc(id).remove()
          db.collection('shoucang').where({
            Title: app.globalData.name
          }).remove()
          db.collection('caixi').where({
            title: app.globalData.caixi
          }).update({
            data: {
              nameList: _.pull({ nameiiiid: _.eq(id) })
            }
          }).then(res => {
            wx.showToast({
              title: '删除成功',
            })
          })
        } else if (res.cancel) {
          return false;

        }
      }
    })
    this.onLoad()
  },
  /* 搜索
  */
  wxSearchInput: function () {
    wx.navigateTo({
      url: '/pages/search/search',
    })
  },
  onChange(event) {
    wx.showToast({
      title: `切换到标签 ${event.detail.name}`,
      icon: 'none',
    });
  },
  getData() {
    wx.cloud.callFunction({
      name: "getData"
    })
      .then(res => {
        this.setData({
          dataList: res.result.data
        })
        console.log(res)
      })
  },

  /**
   * 生命周期函数--监听页面加载
   */
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
  onShow: function (options) {
    this.onLoad()
    // this.Bool()

  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function () {

  },

  onUnload: function () {
  },
  onPullDownRefresh: function () {
  },

  onReachBottom: function () {
  },
  onShareAppMessage: function () {
  }
})