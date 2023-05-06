// pages/detail/detail.js
const app = getApp();
const db = wx.cloud.database();
var demo = require("../../utils/util")
Page({

  /**
   * 页面的初始数据
   */
  data: {
    id: '',
    shoucang: '',
    comment: '',
    autoplay: true,
    interval: 3000,
    duration: 1200,
    admin: false,
  },
  getDetail() {

    db.collection('recipe')
      .where({
        _id: app.globalData.nameiiiid
      }).get()
      .then(res => {
        console.log(res.data)
        this.setData({
          dataList: res.data
        })
        app.globalData.name = res.data[0].name,
          app.globalData.imageurl = res.data[0].imageurl,
          app.globalData.Author = res.data[0].author,
          app.globalData.Date = res.data[0].Date
        app.globalData.myopenid = res.data[0]._openid
      })

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
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.Bool()
    console.log({ options })
    app.globalData.opt = options
    app.globalData.nameiiiid = options.id
    this.getDetail()
    this.BOOl()
    this.getComment()
  },
  BOOl() {

    db.collection("shoucang").where({
      titleid: app.globalData.nameiiiid,

    })
      .get()
      .then(res => {
        console.log(res.data)
        if (res.data[0]._openid == app.globalData.myopenid) {

          this.setData({
            shoucang: true
          })
        }
      })

  },
  getComment() {
    db.collection('comment').where({
      titleid: app.globalData.nameiiiid
    }).get()
      .then(res => {
        this.setData({
          commenList: res.data
        })
      })
  },
  deleteClick: function (event) {
    const that = this

    var id = event.currentTarget.dataset.deleteid;
    // console.log(res.data._id)
    wx.showModal({
      title: "是否确定删除",
      success(res) {
        if (res.confirm == true) {
          console.log('用户点击了确定')

          //删除操作
          wx.cloud.database().collection('comment').doc(id)
            .remove()
            .then(res => {
              console.log('删除成功', res)
              wx.showToast({
                title: '删除成功',
                icon: 'success'
              })
              that.onLoad(app.globalData.opt)
            })
        }
        else if (res.cancel == true) {
          console.log('用户点击了取消')
        }

        that.onLoad(app.globalData.opt)
        that.getComment()
      }

    })
  },
  formSubmit: function (e) {
    let that = this;

    // let list = that.data.comment_list;
    // let comment_total = that.data.comment_total;
    let comment = e.detail.value.comment;
    // let title =e.title;
    // let nickName =app.globalData.userInfo.nickName;
    //     if(app.globalData.userinfo ==undefined || app.globalData.userInfo == null ||  app.globalData.userInfo==""){
    //       wx.showToast({
    //         title:'请先登录',
    //         icon: 'none',
    //         duration: 1500
    //       })
    //       wx.switchTab({
    //         url: '/pages/login/login'
    // });
    //     }
    if (comment == undefined || comment == null || comment == "") {
      wx.showToast({
        title: '请输入内容',
        icon: 'none',
        duration: 1500
      });
      return;
    }

    else if (app.globalData.userInfo == undefined || app.globalData.userInfo == null || app.globalData.userInfo == "") {
      wx.showToast({
        title: '请先登录',
        icon: 'none',
        duration: 1500
      })
      wx.navigateTo({
        url: '/pages/login/login'
      })

    }
    else {
      var args = {
        cNickName: app.globalData.userInfo.nickName,
        cAvatarUrl: app.globalData.userInfo.avatarUrl,
        createDate: demo.formatTime(new Date(), "Y-M-D h:m:s"),
        comment: comment,
        flag: true,
        titleid: app.globalData.nameiiiid
      }

      that.addPostComment(args);
      that.onLoad(app.globalData.opt)
      this.getComment()
    }
  },
  /**
 * 新增评论
 */
  addPostComment(commentContent) {
    const db = wx.cloud.database();
    db.collection('comment').add({
      data: commentContent
    }).then(res => {
      wx.showToast({
        title: '评论成功',
        icon: 'success',
        duration: 1500
      });
    })
    this.onLoad(app.globalData.opt);
  },
  ClickSC: function () {
    if (app.globalData.userInfo == undefined || app.globalData.userInfo == null || app.globalData.userInfo == "") {
      wx.showToast({
        title: '请先登录',
        icon: 'none',
        duration: 1500
      })
      wx.navigateTo({
        url: '/pages/login/login',
      })
      this.setData({
        shoucang: false
      })
    }
    else {
      if (this.data.shoucang == false) {
        db.collection('shoucang').add({
          data: {
            Img: app.globalData.imageurl,
            Title: app.globalData.name,
            Date: app.globalData.date,
            Author: app.globalData.Author,
            titleid: app.globalData.nameiiiid
          }
        })
        this.setData({
          shoucang: true
        })
        wx.showToast({
          title: '收藏成功',
          icon: 'success'
        })
      } else {
        db.collection('shoucang').where({
          titleid: app.globalData.nameiiiid,
          _openid: app.globalData.myopenid
        }).remove({
          success: res => {
            this.setData({
              shoucang: false
            })
            wx.showToast({
              title: '取消收藏',
              icon: 'success'
            })
          }
        })
      }
    }
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