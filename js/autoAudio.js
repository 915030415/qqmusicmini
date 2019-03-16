;
(function($,root){
    function auto(data,status,curTime){
        this.curTime = curTime;
        this.data = data;
        this.status = status;
    }
    
    Auto.prototype = {
        autoPlay:function(){},
        randowPlat:function(){},
        
    }
})(window.Zepto,window.player || (window.player = {}))