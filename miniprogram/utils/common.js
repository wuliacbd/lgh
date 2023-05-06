var common = {
  //数值类型截取
  getStrLen: function (str, len) {
    if (str.length > len) {
      return str.substring(0, len) + "...";
    } else {
      return str;
    }
  },
  //时间戳
  timesFun: function (timesData) {
    //如果时间格式是正确的，那下面这一步转化时间格式就可以不用了
    var dateBegin = timesData; //将-转化为/，使用new Date    
    var dateEnd = getDate(); //获取当前时间   
    var dateDiff = dateEnd.getTime() - dateBegin; //时间差的毫秒数
    var yearDiff = Math.floor(dateDiff / (24 * 3600 * 1000 * 365));
    var dayDiff = Math.floor(dateDiff / (24 * 3600 * 1000)); //计算出相差天数
    var leave1 = dateDiff % (24 * 3600 * 1000) //计算天数后剩余的毫秒数
    var hours = Math.floor(leave1 / (3600 * 1000)) //计算出小时数
    //计算相差分钟数
    var leave2 = leave1 % (3600 * 1000) //计算小时数后剩余的毫秒数
    var minutes = Math.floor(leave2 / (60 * 1000)) //计算相差分钟数
    //计算相差秒数
    var leave3 = leave2 % (60 * 1000) //计算分钟数后剩余的毫秒数
    var seconds = Math.round(leave3 / 1000);
    var timesString = '';
    if (yearDiff != 0) {
      timesString = yearDiff + '年前';
    } else if (yearDiff == 0 && dayDiff != 0) {
      timesString = dayDiff + '天前';
    } else if (dayDiff == 0 && hours != 0) {
      timesString = hours + '小时前';
    } else if (hours == 0 && minutes != 0) {
      timesString = minutes + '分钟前';
    } else if (minutes == 0 && seconds < 60) {
      timesString = '刚刚';
    }
    return timesString
  },
  //6666变6k+
  getMyNum:function(num){
    if(num<1000){
      return num;
    }else if(num>=1000&&num<10000){
      return (num/1000).toFixed(1)+"k"
    }else if(num>=10000&&num<100000){
      return (num/10000).toFixed(1)+"w"
    }else{
      return "10w+"
    }
  },
  //时间戳处理
  myDate: function (value, type = 0){
    var time = getDate(value);
    var year = time.getFullYear();
    var month = time.getMonth() + 1;
    var date = time.getDate();
    var hour = time.getHours();
    var minute = time.getMinutes();
    var second = time.getSeconds();
    month = month < 10 ? "0" + month : month;
    date = date < 10 ? "0" + date : date;
    hour = hour < 10 ? "0" + hour : hour;
    minute = minute < 10 ? "0" + minute : minute;
    second = second < 10 ? "0" + second : second;
    var arr = [
      year + "-" + month + "-" + date,
      year + "-" + month + "-" + date + " " + hour + ":" + minute + ":" + second,
      year + "年" + month + "月" + date,
      year + "年" + month + "月" + date + " " + hour + ":" + minute + ":" + second,      
      hour + ":" + minute + ":" + second
    ]
    return arr[type];
  }

}
global.Object = Object
global.Array = Array
// global.Buffer = Buffer
global.DataView = DataView
global.Date = Date
global.Error = Error
global.Float32Array = Float32Array
global.Float64Array = Float64Array
global.Function = Function
global.Int8Array = Int8Array
global.Int16Array = Int16Array
global.Int32Array = Int32Array
global.Map = Map
global.Math = Math
global.Promise = Promise
global.RegExp = RegExp
global.Set = Set
global.String = String
global.Symbol = Symbol
global.TypeError = TypeError
global.Uint8Array = Uint8Array
global.Uint8ClampedArray = Uint8ClampedArray
global.Uint16Array = Uint16Array
global.Uint32Array = Uint32Array
global.WeakMap = WeakMap
global.clearTimeout = clearTimeout
global.isFinite = isFinite
global.parseInt = parseInt
global.setTimeout = setTimeout


module.exports = common;