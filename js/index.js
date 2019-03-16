// var nowIndex = 0;
var len;//歌曲数据总长度
var dataList;//歌曲数据对象
var audio = player.AudioManager;//歌曲对象
var controlIndex = null;//控制当前歌曲对象
var timer = null;//图像旋转对象
var  List= null;//渲染歌曲列表对象
var audioStatus = 'auto';//默认自动播放状态；
var statusIndex = 0;// 默认的 状态图标控制 0 对应循环播放 1对应随机 2 对应 单曲循环
// var curIndex;//单曲歌曲索引
// console.log(window.player, window.Zepto)
getdata("../mock/data.json");
function getdata(url) {
    $.ajax({
        url: url,
        type: "GET",
        success: function (data) {
            console.log(data)
            dataList = data;
            len = data.length;
            List = new player.List(data);
            List.renderList();//渲染歌曲列表
            controlIndex = new player.controlIndex(len);
            
            // player.render(data[0]);
            // audio.getAudio(data[0].audio);
            bindEvent();
            bindTouch();
            $('body').trigger('play:change', 0);
        },
        error: function () {
            console.log("error");
        }
    });
}
function bindEvent() { //绑定点击事件
    $('body').on('play:change', function (e, i) { //需要写参数e 不然会报错
        player.render(dataList[i]);//渲染封面
        List.renderActive(i);//渲染当前音乐
        audio.getAudio(dataList[i].audio);//加载音乐
        player.pro.renderAllTime(dataList[i].duration);
        // player.pro.cancelFrame(); //取消运动
        player.pro.stop(0);
        // player.pro.upDate(0);
        $('.img-box').attr('data-deg', 0)
            .css({
                transform: 'rotateZ(' + 0 + 'deg)',
                transition: 'none',
            });
        if (audio.status == 'playing') {
            audio.play();
            player.pro.start(0); //切歌的时候从原点开始运动
            audio.mannagerAudio(autoCallback);//触发自动轮播
            rotated(0);
        }else{
            player.pro.upDate(0);
        }

    });
    $('.prev').on('click', function (e) {
        // if (nowIndex == 0) {
        //     nowIndex = len - 1;
        // } else {
        //     nowIndex--;
        // }
        var i = controlIndex.prev();
        console.log(i)
        // player.render(dataList[i]);
        // audio.getAudio(dataList[i].audio);
        // if (audio.status == 'playing') {
        //     audio.play();
        // }
        $('body').trigger('play:change', i);
    });
    $('.next').on('click', function (e) {
        // if (nowIndex == len - 1) {
        //     nowIndex = 0;
        // } else {
        //     nowIndex++;
        // }
        var i = controlIndex.next();
        // console.log(i);
        // player.render(dataList[i]);
        // audio.getAudio(dataList[i].audio);
        // if (audio.status == 'playing') {
        //     audio.play();
        // }
        $('body').trigger('play:change', i);
    });
    $('.play').on('click', function (e) {
        if (audio.status == 'pause') {
            audio.play();
            player.pro.start();
            var deg = $('.img-box').attr('data-deg') || 0;
            rotated(deg);
            // console.log(controlIndex.index);
            var i = controlIndex.index
           audio.mannagerAudio(autoCallback);//触发自动轮播
        } else {
            audio.pause();
            player.pro.stop();
            clearInterval(timer);
        }
        $(this).toggleClass('playing')
    });
    $('.list').on('click',function(e){
        $('.song-list').css({
            transform:'translatey(0%)',
            transition:'transform 0.3s linear',
        });
        
    });
    $('.close').on('click',function(e){
        $('.song-list').css({
            transform:'translatey(100%)',
            transition:'transform 0.3s linear',
        });
    });
    $('.list-box').on('click','li',function(){
        // console.log($(this).attr('data-list'));
        
        var i = +$(this).attr('data-list');//当前点击的音乐索引 为字符串 转化成数字；
        audio.status = 'playing' //把歌曲状态设置为正在播放状态 点击直接播放；
        $('.play').addClass('playing')//设置 按钮状态；
        $('body').trigger('play:change',i);
        
    });
    $('.status').on('click',function(e){
        if(statusIndex == 2){
            statusIndex  = 0;
        }else{
            statusIndex ++ ;
        }
      switch(statusIndex){
          case 0 : $(this).removeClass('dq').addClass('auto'),audioStatus = 'auto';
          break;
          case 1 : $(this).removeClass('auto').addClass('sj'),audioStatus = 'sj';
          break;
          case 2 : $(this).removeClass('sj').addClass('dq'),audioStatus = 'dq';
          break;
          default : alert('error');
      }
      console.log(audioStatus)
    });
}

function bindTouch() { //绑定进度条的拖拽事件
    var offset = $('.pro-bottom').offset(); //总进度条的 数据
    var l = offset.left;
    var w = offset.width;

    $('.spot').on('touchstart', function (e) { //触摸开始事件
        if(audio.status == 'playing'){
            player.pro.stop(); //拖动进度条的时候 停止自动运动
        }
            
        })
        .on('touchmove', function (e) { //移动事件
            // console.log(e);
            var x = e.changedTouches[0].clientX; //获取 触摸点到 可视区的横向距离
            var per = (x - l) / w; //拉动的距离 占中距离的百分比;
            if (per >= 0 && per <= 1) {
                player.pro.upDate(per);
            }
        })
        .on('touchend', function (e) { //松开事件
            var x = e.changedTouches[0].clientX; //获取 触摸点到 可视区的横向距离
            var per = (x - l) / w; //拉动的距离 占中距离的百分比;
           if(per >=0 && per <=1){
         
            var time = per * dataList[controlIndex.index].duration;//获取当前音乐所播放的时间；controlIndex.index :当前音乐
            audio.playTo(time);//使 播放time时刻的音频；
              player.pro.start(per);
            //   audio.play();
            //       audio.status = 'playing'
            //       $('.play').addClass('playing');
                if(audio.status == 'pause'){
                  audio.play();
                  audio.status = 'playing'
                  $('.play').addClass('playing');
                }
              
            
            // else{
            //     player.pro.stop(per);// 当拉动进度条的时候是暂停的 时候 把 进度条的 进度设为当前的百分比 当按开始播放的时候进度条从当前进度播放
            // }
           }

        });
}

function rotated(deg) {

    clearInterval(timer);
    deg = +deg;
    // deg = pasreInt(deg);
    timer = setInterval(function () {
        deg += 2;
        $('.img-box').attr('data-deg', deg);
        $('.img-box').css({
            transform: 'rotateZ(' + deg + 'deg)',
            transition: 'transform 0.2s linear',
        });
    }, 200);
}
function autoCallback(status){
    switch(status){
        case 'auto' : $('.next').trigger('click');//触发 next点击事件 循环播放
        break;
        case 'sj' :controlIndex.index = Math.round(Math.random() *len), $('body').trigger('play:change', controlIndex.index);//随机播放 设置当前歌曲  为随机的
        break;
        case 'dq' : $('body').trigger('play:change', controlIndex.index);//单曲循环;
        break;
        default : alert(error);
    }
}


// 1.渲染信息 和图片
// 2.点击按钮
// 3.切歌 播放暂停
// 4.图片旋转
// 5.列表切歌
// 6.进度条运动和拖拽