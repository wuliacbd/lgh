const app = getApp()
Page({
  data: {
    imgData: [],
    winWth: "",
    dataList: [],
    popupShow: false,
    commentVal: "",
    commentShow: true,
    commentList: "",
    commentLoading: false,
    isLoading: true,
    admin: false,
  },
  popupClose() {
    this.setData({
      popupShow: false
    })
  },
  clickComment(res) {
    if (app.globalData.userInfo) {
      var id = res ? res.currentTarget.dataset.id : this.data.blogid
      var idx = res ? res.currentTarget.dataset.idx : this.data.idx
      this.setData({
        popupShow: true,
        blogid: id,
        idx: idx,
        commentList: "",
        commentLoading: false
      })
      wx.cloud.callFunction({
        name: "ktblog_comm_show",
        data: {
          blogid: id
        },
        success: res => {
          this.setData({
            commentList: res.result.data,
            commentLoading: true
          })
        }
      })

    } else {
      wx.navigateTo({
        url: '/pages/login/login'
      })
    }
  },
  commentIpt(res) {
    if (res.detail) {
      this.setData({
        commentShow: false,
        commentVal: res.detail
      })
    } else {
      this.setData({
        commentShow: true
      })
    }
  },
  clickBtnComment() {
    if (this.data.commentShow) {
      return;
    }
    wx.showLoading()
    var content = this.data.commentVal
    var userInfo = app.globalData.userInfo
    var blogid = this.data.blogid;
    wx.cloud.callFunction({
      name: "ktblog_comm_add",
      data: {
        content,
        userInfo,
        blogid
      },
      success: res => {
        var _dataList = this.data.dataList
        var idx = this.data.idx;
        var commNum = _dataList[idx].commNum
        commNum++
        _dataList[idx].commNum = commNum
        this.setData({
          commentVal: "",
          commentShow: true,
          dataList: _dataList
        })
        this.clickComment();
        wx.hideLoading()
      }
    })
  },
  clickZan(res) {
    if (app.globalData.userInfo) {
      wx.showLoading()
      var id = res.currentTarget.dataset.id
      var idx = res.currentTarget.dataset.idx
      wx.cloud.callFunction({
        name: "ktblog_zan",
        data: {
          id: id
        },
        success: res => {
          console.log(res)
          var _dataList = this.data.dataList;
          _dataList[idx].isZan = !_dataList[idx].isZan
          var isZan = this.data.dataList[idx].isZan;
          var zanSize = this.data.dataList[idx].zanSize;
          if (isZan) {
            zanSize--;
            _dataList[idx].zanSize = zanSize;
          } else {
            zanSize++;
            _dataList[idx].zanSize = zanSize;
          }
          this.setData({
            dataList: _dataList
          })
          wx.hideLoading()
        }
      })
    } else {
      wx.navigateTo({
        url: '/pages/login/login'
      })
    }
  },
  getWinWth() {
    var winWth = wx.getSystemInfoSync().screenWidth;
    this.setData({
      winWth: winWth
    })
  },
  addBlogBtn() {
    if (app.globalData.userInfo) {
      wx.navigateTo({
        url: '/pages/blog/blog'
      })
    } else {
      wx.navigateTo({
        url: '/pages/login/login',
      })
    }
  },
  getBlogList(num = 0, page = 7) {
    wx.cloud.callFunction({
      name: "ktblog_show",
      data: {
        num: num,
        page: page
      },
      success: res => {
        console.log(res)
        if (res.result.length == 0) {
          this.setData({
            isLoading: false
          })
        }
        var newDataList = [...this.data.dataList, ...res.result]
        this.setData({
          dataList: newDataList
        })
      }
    })
  },
  clickBigImg(res) {
    wx.previewImage({
      urls: res.currentTarget.dataset.urls,
      current: res.currentTarget.dataset.current
    })
  },
  Bool() {
    if (app.globalData.myopenid == 'oJziv5dZFyKHfc8xgav8yyo7oelU') {
      this.setData({
        admin: true
      })
    }
  },
  onPullDownRefresh: function () {
    this.onLoad()
    wx.showNavigationBarLoading() //在标题栏中显示加载
    setTimeout(function () {
      wx.hideNavigationBarLoading() //完成停止加载
      wx.stopPullDownRefresh() //停止下拉刷新
    }, 1500);
  },
  clickDel(e) {
    var id = e.currentTarget.dataset.id
    var index = e.currentTarget.dataset.index
    wx.showModal({
      title: "是否删除该条动态",
      success: res => {
        if (res.confirm) {
          wx.showLoading({
            mask: true
          })
          wx.cloud.callFunction({
            name: "ktblog_del",
            data: {
              id
            },
            success: res => {
              var _dataList = this.data.dataList
              _dataList.splice(index, 1)
              this.setData({
                dataList: _dataList
              })
              wx.hideLoading()
            }
          })
        }
      }
    })
  },
  onLoad: function (options) {
    this.getWinWth();
    this.getBlogList();
    this.Bool();
  },
  onReady: function () {
  },
  onShow: function () {
  },
  onHide: function () {
  },
  onUnload: function () {
  },
  onPullDownRefresh: function () {
  },
  onReachBottom: function () {
    var num = this.data.dataList.length;
    this.getBlogList(num);
  },
  onShareAppMessage: function () {
  }
})