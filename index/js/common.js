var qnapi ='https://www.quannengplayer.com/';
var channelName ='baidu';

(function(w){
// 空函数
function shield(){
    return false;
}
document.addEventListener('touchstart',shield,false);//取消浏览器的所有事件，使得active的样式在手机上正常生效
document.oncontextmenu=shield;//屏蔽选择函数
// H5 plus事件处理
var ws=null,as='pop-in';
function plusReady(){
    ws=plus.webview.currentWebview();
    // Android处理返回键
    plus.key.addEventListener('backbutton',function(){
        back();
    },false);
    compatibleAdjust();
}
if(w.plus){
    plusReady();
}else{
    document.addEventListener('plusready',plusReady,false);
}
// DOMContentLoaded事件处理
var domready=false;
document.addEventListener('DOMContentLoaded',function(){
    domready=true;
    gInit();
    document.body.onselectstart=shield;
    compatibleAdjust();
},false);
// 处理返回事件
w.back=function(hide){
    if(w.plus){
        ws||(ws=plus.webview.currentWebview());
        if(hide||ws.preate){
            ws.hide('auto');
        }else{
            ws.close('auto');
        }
    }else if(history.length>1){
        history.back();
    }else{
        w.close();
    }
};
// 处理点击事件
var openw=null,waiting=null;
/**
 * 打开新窗口
 * @param {URIString} id : 要打开页面url
 * @param {boolean} wa : 是否显示等待框
 * @param {boolean} ns : 是否不自动显示
 * @param {JSON} ws : Webview窗口属性
 */
w.clicked=function(id,wa,ns,ws){
    if(openw){//避免多次打开同一个页面
        return null;
    }
    if(w.plus){
        wa&&(waiting=plus.nativeUI.showWaiting());
        ws=ws||{};
        ws.scrollIndicator||(ws.scrollIndicator='none');
        ws.scalable||(ws.scalable=false);
        var pre='';//'http://192.168.1.178:8080/h5/';
        openw=plus.webview.create(pre+id,id,ws);
        ns||openw.addEventListener('loaded',function(){//页面加载完成后才显示
//      setTimeout(function(){//延后显示可避免低端机上动画时白屏
            openw.show(as);
            closeWaiting();
//      },200);
        },false);
        openw.addEventListener('close',function(){//页面关闭后可再次打开
            openw=null;
        },false);
        return openw;
    }else{
        w.open(id);
    }
    return null;
};
w.openDoc=function(t,c){
//  var d=plus.webview.getWebviewById('document');
//  if(d){
//      d.evalJS('updateDoc("'+t+'","'+c+'")');
//  }else{
//      d=plus.webview.create('/plus/doc.html', 'document', {
//          zindex:9999,
//          popGesture:'hide'
//          }, {preate:true});
//      d.addEventListener('loaded',function(){
//          d.evalJS('updateDoc("'+t+'","'+c+'")');
//      },false);
//  }
    plus.webview.create(c, 'document', {
        titleNView:{
            autoBackButton:true,
            backgroundColor:'#D74B28',
            titleColor:'#CCCCCC',
            titleText:t
        },
        backButtonAutoControl:'close',
        scalable:false
    }).show('pop-in');
}
/**
 * 关闭等待框
 */
w.closeWaiting=function(){
    waiting&&waiting.close();
    waiting=null;
}
// 兼容性样式调整
var adjust=false;
function compatibleAdjust(){
    if(adjust||!w.plus||!domready){
        return;
    }   // iOS平台使用滚动的div
    if('iOS'==plus.os.name){
        var t=document.getElementById("dcontent");
        t&&(t.className="sdcontent");
        t=document.getElementById("content");
        t&&(t.className="scontent");
        //iOS8横竖屏切换div不更新滚动问题
        var lasto=window.orientation;
        window.addEventListener("orientationchange",function(){
            var nowo=window.orientation;
            if(lasto!=nowo&&(90==nowo||-90==nowo)){
                window.dcontent&&(0==dcontent.scrollTop)&&(dcontent.scrollTop=1);
                window.content&&(0==content.scrollTop)&&(content.scrollTop=1);
            }
            lasto=nowo;
        },false);
    }
    adjust=true;
};
w.compatibleConfirm=function(){
    plus.nativeUI.confirm('本OS原生层面不提供该控件，需使用mui框架实现类似效果。请点击“确定”下载Hello mui示例',function(e){
        if(0==e.index){
            plus.runtime.openURL("http://www.dcloud.io/hellomui/");
        }
    },"",["确定","取消"]);
}
// 通用元素对象
var _dout_=null,_dcontent_=null;
w.gInit=function(){
    _dout_=document.getElementById("output");
    _dcontent_=document.getElementById("dcontent");
};
// 清空输出内容
w.outClean=function(){
    _dout_.innerText="";
    _dout_.scrollTop=0;//在iOS8存在不滚动的现象
};
// 输出内容
w.outSet=function(s){
    _dout_.innerText=s+"\n";
    (0==_dout_.scrollTop)&&(_dout_.scrollTop=1);//在iOS8存在不滚动的现象
};
// 输出行内容
w.outLine=function(s){
    _dout_.innerText+=s+"\n";
    (0==_dout_.scrollTop)&&(_dout_.scrollTop=1);//在iOS8存在不滚动的现象
};
// 格式化时长字符串，格式为"HH:MM:SS"
w.timeToStr=function(ts){
    if(isNaN(ts)){
        return "--:--:--";
    }
    var h=parseInt(ts/3600);
    var m=parseInt((ts%3600)/60);
    var s=parseInt(ts%60);
    return (ultZeroize(h)+":"+ultZeroize(m)+":"+ultZeroize(s));
};
// 格式化日期时间字符串，格式为"YYYY-MM-DD HH:MM:SS"
w.dateToStr=function(d){
    return (d.getFullYear()+"-"+ultZeroize(d.getMonth()+1)+"-"+ultZeroize(d.getDate())+" "+ultZeroize(d.getHours())+":"+ultZeroize(d.getMinutes())+":"+ultZeroize(d.getSeconds()));
};
/**
 * zeroize value with length(default is 2).
 * @param {Object} v
 * @param {Number} l
 * @return {String} 
 */
w.ultZeroize=function(v,l){
    var z="";
    l=l||2;
    v=String(v);
    for(var i=0;i<l-v.length;i++){
        z+="0";
    }
    return z+v;
};
/**
 * check the validity of the input phone number 
 */
w.invalidMobieNumberCheck = function(number) {
    
};
/**
 * get the style of button  
 */
w.getBtnStyle = function(enable) {
    var bgColor = enable ? "#3a8bd6" : "#edf8fe";
    var color = enable ? "#ffffff" : "#999999";
    return "background-color: " + bgColor + ";color: " + color + ";border-radius: 85px;font-size: 18px;border: none;";
};
w.getBtnStyleOne = function(enable) {
    var bgColor = enable ? "#3a8bd6" : "#dbdbdb";
    var border = enable ? "1px solid #1a92ff" : "1px solid #ccc5c5"
    return "background-color: " + bgColor + ";color: #ffffff;border-radius: 85px;font-size: 18px;border: "+border+";";
};
/**
 * check whether the input content is valid
 */
w.checkEmptyString = function(content) {
    return content === null || content === undefined || content.length <= 0
};
w.dateFormat = function(timeStamp, withTime) {
    function addZero(m) {
        return m < 10 ? '0' + m : m;
    }
    function format(timeStamp, withTime) {
        var time = new Date(timeStamp);
        var y = time.getFullYear();
        var m = time.getMonth()+1;
        var d = time.getDate();
        var h = time.getHours();
        var mm = time.getMinutes();
        var s = time.getSeconds();
        return y + '-' + addZero(m) + '-' + addZero(d) + ' ' + (withTime ? addZero(h) + ':' + addZero(mm) + ':' + addZero(s) : "");
    }
    return format(timeStamp, withTime)
}
w.getFormattedDuration = function(duration) {
        if (duration <= 0) {
        return "00:00:00";
    }
    var seconds = duration % 60;
    var minutes = (duration - seconds) / 60 % 60;
    var hours = (duration - (seconds + minutes * 60)) / 3600;
    return (hours >= 10 ? hours : "0" + hours) + ":"
                + (minutes >= 10 ? minutes : "0" + minutes) + ":"
                    + (seconds >= 10 ? seconds : "0" + seconds)
}
w.copyShare = function(text,toast) {
    that = this;
    mui.plusReady(function() {
        //判断是安卓还是ios
        if (mui.os.ios) {
            //ios
            var UIPasteboard = plus.ios.importClass("UIPasteboard");
            var generalPasteboard = UIPasteboard.generalPasteboard();
            //设置/获取文本内容:
            generalPasteboard.plusCallMethod({
                setValue: text,
                forPasteboardType: "public.utf8-plain-text"
            });
            generalPasteboard.plusCallMethod({
                valueForPasteboardType: "public.utf8-plain-text"
            });
        } else {
            //安卓
            var context = plus.android.importClass("android.content.Context");
            var main = plus.android.runtimeMainActivity();
            var clip = main.getSystemService(context.CLIPBOARD_SERVICE);
            plus.android.invoke(clip, "setText", text);
        }
    });
    mui.toast(toast)
}
})(window);
