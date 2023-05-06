// 云函数入口文件
const cloud = require('wx-server-sdk')

cloud.init(
  {
    env:'aaa-0gbvpkroa3498da5',
  }
)
const db=cloud.database();

// 云函数入口函数
exports.main = async (event, context) => {
  const openid = cloud.getWXContext().OPENID
  var {num,page}=event;
  var dataResult= await db.collection("blog").orderBy("posttime","desc").skip(num).limit(page).get()
  var dataArr=dataResult.data
  
  if(dataArr.length>0){

    for (var i = 0; i < dataArr.length; i++){
      var count =await db.collection("blog_zan").where({
        openid: openid,
        blogid: dataArr[i]._id
      }).count();
      if (count.total){
        dataArr[i].isZan = false
      }else{
        dataArr[i].isZan = true
      }

      var count2 = await db.collection("blog_zan").where({        
        blogid: dataArr[i]._id
      }).count();
      dataArr[i].zanSize = count2.total;
      
      var commNum = await db.collection("blog_comment").where({
        blogid:dataArr[i]._id
      }).count();
      dataArr[i].commNum = commNum.total


      if(openid==dataArr[i].openid){
        dataArr[i].delState=true
      }else{
        dataArr[i].delState=false
      }


      
    }

  }
  return dataArr;
  
}