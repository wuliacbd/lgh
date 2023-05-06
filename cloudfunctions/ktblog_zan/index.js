// 云函数入口文件
const cloud = require('wx-server-sdk')

cloud.init(
  {
    env:'aaa-0gbvpkroa3498da5',
  }
)
const db=cloud.database()

// 云函数入口函数
exports.main = async (event, context) => {
  const openid = cloud.getWXContext().OPENID
  var blogid=event.id;
  var posttime=new Date().getTime();

  var count= await db.collection("blog_zan").where({
    openid,
    blogid
  }).count()

  
  if (count.total){
    return await db.collection("blog_zan").where({
      openid,
      blogid
    }).remove()

  }else{
    return await db.collection("blog_zan").add({
      data:{
        blogid,
        openid,
        posttime
      }
    })
  }


  
  

}