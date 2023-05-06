// pages/suiji/suiji.js
const app=getApp();
Page({

  /**
   * 页面的初始数据
   */
  data: {
    empPath: [],
    shows: false, //控制下拉列表的显示隐藏，false隐藏、true显示
    selectDatas: ['','全部'], //下拉列表的数据
    indexs: 0, //选择的下拉列 表下标,
    caixiList:[],
    suiji:[],
    cardTypeDict:[],
    shou:[],
  },
  selectTaps() {
    this.setData({
      shows: !this.data.shows,
    });

  },
  // 点击下拉列表
  optionTaps(e) {
    let Indexs = e.currentTarget.dataset.index; //获取点击的下拉列表的下标
    console.log(Indexs)
    app.globalData.caixi=this.data.selectDatas[Indexs]
    this.setData({
      indexs: Indexs,
      shows: !this.data.shows, 

    });

  },
  getcaixi(){
    const db = wx.cloud.database();
    const _=db.command;
    db.collection('caixi').field({
      title:true,
      _id:false
    }).get().then(res=>{
      if(this.data.selectDatas[2]==null||this.data.selectDatas[2]==undefined){
      let newList=res.data 
      let selectDatas=this.data.selectDatas
      for (let i in newList) {
        selectDatas.push(newList[i].title); 
      }
      this.setData({
        selectDatas:selectDatas
      })
     }
     else{
      console.log(1231)
     }
   
     
    })
  },
  xuan(){
    const db = wx.cloud.database();
    const _=db.command;
    if(app.globalData.caixi=="全部"){
      db.collection('recipe')
      .aggregate()
      .sample({
        size: 1
      })

      .end().then(
        res => {
          this.setData({
            suiji:res.list[0].name
          })
            console.log(this.data.suiji)
             },
       
        )
    }
    else{
      db.collection('recipe')
      .aggregate()
      .match({caixi:app.globalData.caixi})
      .sample({
        size: 1
      })
      .end().then(
        res => {
          this.setData({
            suiji:res.list[0].name
          })
            console.log(this.data.suiji)
             },
       
        )
    }
  },
  addForm: function(data) {
    console.log(data.detail.value)//  {username: "hgj", password: "fsdfsd"}
    this.setData({
      cardTypeDict: this.data.cardTypeDict.concat(data.detail.value.cai)
});
console.log(this.data.cardTypeDict)
  },
  shou(){
    var index = Math.floor((Math.random()*this.data.cardTypeDict.length));
   this.setData({
     shou:this.data.cardTypeDict[index]
   })
  },
  wxSearchInput: function (value) {
    
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function () {
    this.getcaixi()
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