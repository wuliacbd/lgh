const app=getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {
   imgData:[],
   winWth:"",
   dataList:[],
   popupShow:false,
   commentVal:"",
   commentShow:true,
   commentList:"",
   commentLoading:false,
   isLoading:true,
   admin:false,
   dataResult:[]
  },

  //关闭评论
  popupClose(){
    this.setData({
      popupShow:false
    })
  },



  //点击评论
  clickComment(res){
    if (app.globalData.userInfo){
      var id = res?res.currentTarget.dataset.id:this.data.blogid
      var idx= res?res.currentTarget.dataset.idx:this.data.idx
      this.setData({
        popupShow:true,
        blogid: id,
        idx:idx,
        commentList:"",
        commentLoading:false
      })
      //获取评论的数据
      wx.cloud.callFunction({
        name:"ktblog_comm_show",
        data:{
          blogid:id
        },
        success:res=>{ 
          this.setData({
            commentList:res.result.data,
            commentLoading:true
          })
        }
      })

    }else{
      wx.navigateTo({
        url: '/pages/login/login'
      })
    }
  },

  //监听表单的变化
  commentIpt(res){    
    if (res.detail){
      this.setData({
        commentShow:false,
        commentVal: res.detail
      })
    }else{
      this.setData({
        commentShow: true        
      })
    }
  },  

 

  //发表评论
  clickBtnComment(){
    if(this.data.commentShow){
      return;
    }
    wx.showLoading()
    var content=this.data.commentVal
    var userInfo = app.globalData.userInfo
    var blogid =this.data.blogid;
    
    wx.cloud.callFunction({
      name:"ktblog_comm_add",
      data:{
        content,
        userInfo,
        blogid
      },
      success:res=>{
        var _dataList=this.data.dataList
        var idx=this.data.idx;
        var commNum=_dataList[idx].commNum
        commNum++
        _dataList[idx].commNum=commNum

        this.setData({
          commentVal:"",
          commentShow:true,
          dataList:_dataList
        }) 
        this.clickComment();
        wx.hideLoading()
        
      }
    })
  },






  //点赞操作
  clickZan(res){
    if(app.globalData.userInfo){
      wx.showLoading()
      var id=res.currentTarget.dataset.id
      var idx = res.currentTarget.dataset.idx    
      wx.cloud.callFunction({
        name:"ktblog_zan",
        data:{
          id:id
        },
        success:res=>{
          console.log(res)
          var _dataList=this.data.dataList;
          _dataList[idx].isZan = !_dataList[idx].isZan

          var isZan = this.data.dataList[idx].isZan;
          var zanSize=this.data.dataList[idx].zanSize;

          if(isZan){
            zanSize--;
            _dataList[idx].zanSize=zanSize;
          }else{
            zanSize++;
            _dataList[idx].zanSize = zanSize;
          }

          this.setData({
            dataList: _dataList
          })
          wx.hideLoading()
        }
      })
    }else{
      wx.navigateTo({
        url: '/pages/login/login'
      })
    }


  },
 

  //获取设备的宽度
  getWinWth(){
    var winWth = wx.getSystemInfoSync().screenWidth;
    this.setData({
      winWth: winWth
    })    
  },

  //获取真实的数据
  getBlogList(num=0,page=7){
    const db=wx.cloud.database()
   db.collection("blog")
   .where({
     openid:app.globalData.myopenid
    })
   .orderBy("posttime","desc")
   .skip(num)
   .limit(page)
   .get()
   .then(res=>{
     this.setData({
       dataResult:res.data
     })
    console.log(this.data.dataResult)
     var dataArr=this.data.dataResult
    if(dataArr.length>0){
      for (var i = 0; i < dataArr.length; i++){
        var count = db.collection("blog_zan").where({
          openid: app.globalData.myopenid,
          blogid: dataArr[i]._id
        }).count();
        if (count.total){
          dataArr[i].isZan = false
        }else{
          dataArr[i].isZan = true
        }
  
        var count2 = db.collection("blog_zan").where({        
          blogid: dataArr[i]._id
        }).count();
        dataArr[i].zanSize = count2.total;
        
        var commNum =  db.collection("blog_comment").where({
          blogid:dataArr[i]._id
        }).count();
        dataArr[i].commNum = commNum.total
  
  
        if(app.globalData.myopenid==dataArr[i].openid){
          dataArr[i].delState=true
        }else{
          dataArr[i].delState=false
        }
      }
    }
      
        if(dataArr.length==0){
          this.setData({
            isLoading:false
          })
        }
        var newDataList=[...this.data.dataList,...dataArr]
        this.setData({
          dataList:newDataList
        })
   })
   
      },


  //点击查看大图
  clickBigImg(res){    
    wx.previewImage({
      urls:res.currentTarget.dataset.urls,
      current: res.currentTarget.dataset.current
    })
  },

  //删除自己的博客
  clickDel(e){
    var id=e.currentTarget.dataset.id
    var index=e.currentTarget.dataset.index
    wx.showModal({
      title:"是否删除该条博客",
      success:res=>{                
        if(res.confirm){
          wx.showLoading({
            mask:true
          })

          wx.cloud.callFunction({
            name:"ktblog_del",
            data:{
              id
            },
            success:res=>{              
              var  _dataList=this.data.dataList   
              _dataList.splice(index,1)
              this.setData({
                dataList:_dataList
              })
              wx.hideLoading()
            }
          })
        }
      }
    })
  },
 
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.getWinWth();  
    this.getBlogList();   
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
      var num=this.data.dataList.length;
      this.getBlogList(num);
  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {
    
  }
})