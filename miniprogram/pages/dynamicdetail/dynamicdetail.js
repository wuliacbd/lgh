var app = getApp();
const db = wx.cloud.database()
var demo = require("../../utils/util")
Page({
  data: {

    admin: false,
    shoucang: '',
    comment: '',

  },
  onLoad(opt) {
    wx.showLoading({
      title: '数据加载中。。。',
    })

    app.globalData.opt = opt
    const id = opt.id
    app.globalData.id = id
    wx.cloud.database().collection('dynamics').doc(id).get()
      .then(res => {
        this.setData({
          item: res.data
        })
        app.globalData.title = res.data.title,
          app.globalData.imageurl = res.data.imageurl,
          app.globalData.Author = res.data.author,
          app.globalData.Date = res.data.Date
        if (app.globalData.myopenid == 'oJziv5dZFyKHfc8xgav8yyo7oelU') {
          this.setData({
            admin: true
          })
          console.log(this.data.admin)
        }
        else {
          this.setData({
            admin: false
          })
        }
      })
    this.BOOl()
    this.getComment()
    wx.hideLoading();
  },

  BOOl() {

    db.collection("shoucang").where({
      titleid: app.globalData.id,
      _openid: app.globalData.myopenid
    })
      .get()
      .then(res => {
        if (res.data[0]._openid == app.globalData.myopenid) {
          this.setData({
            shoucang: true
          })
        }
      })

  },
  getComment() {
    db.collection('comment').where({
      titleid: app.globalData.id
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
        titleid: app.globalData.id
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
            Title: app.globalData.title,
            Date: app.globalData.date,
            Author: app.globalData.Author,
            titleid: app.globalData.id,
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
          titleid: app.globalData.id,
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
  onShow: function () {
    this.onLoad(app.globalData.opt)
  }


})