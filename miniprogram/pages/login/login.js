const app = getApp()
Page({
  data: {
    userInfo: {},
    hasUserInfo: false,
    canIUseGetUserProfile: false,
  },
  onLoad() {
    if (wx.getUserProfile) {
      this.setData({
        canIUseGetUserProfile: true
      })
    }

  },
  getUserProfile(e) {
    // 推荐使用wx.getUserProfile获取用户信息，开发者每次通过该接口获取用户个人信息均需用户确认
    // 开发者妥善保管用户快速填写的头像昵称，避免重复弹窗
    wx.getUserProfile({
      desc: '用于完善会员资料', // 声明获取用户个人信息后的用途，后续会展示在弹窗中，请谨慎填写
      success: (res) => {
        this.setData({
          userInfo: res.userInfo,
          hasUserInfo: true
        })
        app.globalData.userInfo = res.userInfo
        app.globalData.nickName = res.userInfo.nickName
        var pages = getCurrentPages();
        var beforePage = pages[pages.length - 2];
        beforePage.onLoad(app.globalData.opt);
        wx.navigateBack({
          delta: 1,
        })
      }
    })
    this.getOpenid()
  },
  getOpenid() {
    var that = this
    wx.cloud.callFunction({    //调用云函数获取openid
      name: "getOpenid",
      success: function (res) {
        var app = getApp();
        app.globalData.myopenid = res.result.openid
      }
    })
  }
})
