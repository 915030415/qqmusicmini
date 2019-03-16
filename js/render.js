;
(function($,root){
    //渲染图片
    function renderImg(src){
        var img = new Image();
         img.src = src;
         img.onload = function(){
             $('.img-box img').attr('src',src);
             root.blurImg(img,$('body'));//背景加上 高斯滤镜
         }
    }
    //渲染歌曲信息
    function renderInfo(info){
        var str = '<div class="song-name">'+ info.song +'</div>\
        <div class="songer-name">'+ info.singer +'</div>\
        <div class="alblum-name">'+ info.album +'</div>';
        $('.song-info').html(str);
    }
    function renderIsLike(like){
        if(like){
            $('.like').addClass('likeing');
        }else{
            $('.like').removeClass('likeing')
        }
    }
    root.render = function(data){
        // console.log(data.image)
        renderImg(data.image);
        renderInfo(data)
        renderIsLike(data.isLike)
    }
})(window.Zepto,window.player ||(window.player = {}));