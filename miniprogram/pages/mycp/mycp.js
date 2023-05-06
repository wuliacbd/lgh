// pages/mycp/mycp.js
const app=getApp();
Page({

  /**
   * 页面的初始数据
   */
  data: {

  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    const db=wx.cloud.database()
    db.collection("recipe").where({
      _openid:app.globalData.myopenid
    }).get()
    .then(res=>{
      this.setData({
        dataList:res.data
      })
      console.log(res.data)
      
    })
    wx.startPullDownRefresh()
  },
  getDetail(e){
    console.log(e)
    let id=e.currentTarget.dataset.item._id
    wx.navigateTo({
      url: '/pages/detail/detail?id=' +  id
    })
  },
  onDel(res){
    var that=this
    const db=wx.cloud.database()
    const _ = db.command;
    var id=res.currentTarget.dataset.orderno
    db.collection('recipe').doc(id).get().then(res=>{
      res.caixi=app.globalData.caixi
      res.name=app.globalData.name
    })
    wx.showModal({
      title: '提示',
      content:'确定要删除吗',
      success:function(res){
        if(res.confirm){
          db.collection('recipe').doc(id).remove()
          db.collection('shoucang').where({
            Title:app.globalData.name
          }).remove()
          db.collection('caixi').where({
            title:app.globalData.caixi
          }).update({
           data:{
             nameList:_.pull({ nameiiiid:_.eq(id) })
           }
          }).then(res=>{
            wx.showToast({
              title: '删除成功',
            })
          })
    }else if(res.cancel){return false;

    }}})
    this.onLoad()
  },
 
  handleLongPress: function(e) {   
console.log(e)
    var that=this
    const db=wx.cloud.database()
    const _ = db.command;
    var id=e.currentTarget.dataset.item._id
    db.collection('recipe').doc(id).get().then(res=>{
      res.caixi=app.globalData.caixi
      res.name=app.globalData.name
    })
    wx.showModal({
      title: '提示',
      content:'确定要删除吗',
      success:function(res){
        if(res.confirm){
          db.collection('recipe').doc(id).remove()
          db.collection('shoucang').where({
            Title:app.globalData.name
          }).remove()
          db.collection('caixi').where({
            title:app.globalData.caixi
          }).update({
           data:{
             nameList:_.pull({ nameiiiid:_.eq(id) })
           }
          }).then(res=>{
            wx.showToast({
              title: '删除成功',
            })
          })
    }else if(res.cancel){return false;

    }}})
    this.onLoad()
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