;
(function ($, root) {
    function Control(len) {
        this.len = len;
        this.index = 0;
    }
    Control.prototype ={
        prev:function() {
            return this.getIndex(-1);
        },
        next:function() {
               return this.getIndex(1);
        },
        getIndex:function(val){
            this.index = (this.len + val + this.index) % this.len;
            return this.index;
        }
    }
   root.controlIndex = Control;
}(window.Zepto, window.player || (window.player = {})))