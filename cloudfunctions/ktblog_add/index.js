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
  var subData=event;
  var posttime=new Date().getTime();  
  subData.openid = openid;
  subData.posttime=posttime;


  return await db.collection("blog").add({
    data: subData
  })
  
}