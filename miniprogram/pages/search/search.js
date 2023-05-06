Page({

  data: {
    lists: [],              // 接收搜索的内容
    wxSearchData: '',       // 输入的值
  },

  wxSearchInput: function (value) {
    const db = wx.cloud.database()
    var that = this
    db.collection('recipe').where({
      //使用正则查询，实现对搜索的模糊查询
      name: db.RegExp({
        regexp: value.detail.value,
        //从搜索栏中获取的value作为规则进行匹配。
        options: 'i',
        //大小写不区分
      })
    }).get({
      success: res => {
        console.log(res.data)

        that.setData({
          lists: res.data
        })
      }
    })
  },

  /**
   * 监听软键盘确认键
   */
  wxSearchConfirm: function (e) {
  },

  /**
   * 返回
   */
  back: function (e) {
    wx: wx.navigateBack({
      delta: 1,
    })
  },
  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  handleItemTap(e) {
    let id = e.currentTarget.dataset.item._id
    wx.navigateTo({
      url: '/pages/detail/detail?id=' + id
    })
  },
  onLoad() {

  },
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