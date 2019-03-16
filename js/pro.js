;
(function ($, root) {
    var duration,frameId;
    var startTime,lastPer = 0;
     function renderAllTime(allTime){
         duration = allTime;
         var time = formatTime(allTime);
         $('.all-time').html(time);
     }
     function formatTime(t){
         t = Math.round(t);//方法可把一个数字舍入为最接近的整数。
          var m = Math.floor( t / 60);
          var s = t % 60;
          s = s >=10 ? s : '0' + s;
          m = m >= 10 ? m : '0' + m;
          return m + ':' + s;
     }
     function start(p){
        cancelAnimationFrame(frameId);
         lastPer = p == undefined ? lastPer : p; //切歌的时候 回到原点
         startTime = new Date().getTime();
         function frame() {
             var curTime = new Date().getTime();
             var per =  lastPer + (curTime - startTime )/ (duration *1000);// 暂停时候的百分比 加上 更新的百分比
             
             if(per <= 1){
                 upDate(per)
             }else{
                 cancelAnimationFrame(frameId);
             }
             frameId = requestAnimationFrame(frame)//以每隔16.666ms 执行一次 相当定时器
         }
        frame();
     }
     function upDate(per){
         if(per == 0){// 当进度条 到 0时 lastPer 也要规0 不然当 拉动进度条 然后暂停 再切歌 再点击 播放时 start 会以 暂停时候的 百分比 设置 新的百分比
            
             lastPer = 0;
         }
         var time = formatTime(per * duration);
         $('.cur-time').html(time);
         var x = (per - 1) * 100;
         $('.pro-top').css({
             transform:'translatex(' + x + '%)'
         })
     }
     function stop(){
        
        cancelAnimationFrame(frameId);
        var curTime = new Date().getTime();
        lastPer += (curTime - startTime) / (duration * 1000);//+=的原因为 多次 暂停
     }
     function cancelFrame(){//正在播放的时候切歌 取消 运动;
        cancelAnimationFrame(frameId);
     }
     root.pro = {
         renderAllTime : renderAllTime,
         start:start,
         stop:stop,
         upDate:upDate,
         cancelFrame,
     }
}(window.Zepto, window.player || (window.player = {})))