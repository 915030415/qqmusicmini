;
(function($,root){
    function List(data){
       this.data = data;
    }
    List.prototype = {
        renderList:function(){//渲染列表
            // var index = this.index;
            var data = this.data;
            var strList = '';
            data.forEach(function(ele,index){//属性上对应加上 标记
                 strList +='<li data-list = " '+ index +'">\
                <span>'+ ele.song +'</span>\
                <span>-'+ ele.singer +'</span>\
            </li>'
            });
        $('.list-box').html(strList);
        },
        renderActive:function(i){//标记当前音乐
            var index = i;
            $('.list-box li.active').removeClass('active');
            $('.list-box li').eq(index).addClass('active');
        },
    }
    root.List = List;
})(window.Zepto,window.player || (window.player = {}))