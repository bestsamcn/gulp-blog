require.config({
    baseUrl:'/',
    paths:{
        template:'assets/libs/arttemplate',
        jquery:'assets/libs/jquery/dist/jquery.min',
        bootstrap:'assets/libs/bootstrap/dist/js/bootstrap.min',
        owlcarousel:'assets/libs/owl.carousel/dist/owl.carousel.min',
        q:'assets/libs/q/q'
    },
    shim:{
        q:{
            exports:'q'
        },
    	jquery:{
    		exports:'jquery'
    	},
    	template:{
    		exports:'template'
    	},
    	bootstrap:{
    		deps:['jquery'],
            exports:'bootstrap'
    	},
    	owlcarousel:{
    		deps:['jquery'],
            exports:'owlcarousel'
    	}
    }
});
define(['template','q', 'jquery', 'owlcarousel', 'bootstrap'], function(template, q, jquery, owlcarousel, bootstrap){
    // template helper
     /**
     * 时间格式化
     * @param  {number} num 时间戳
     * @return {string} 指定的时间格式
     */
    template.helper('dateFormat', function(date, format){

        if (!arguments[0]) {
            return '暂无'
        }
        date = new Date(date);
        var map = {
            "M": date.getMonth() + 1, //月份
            "d": date.getDate(), //日
            "h": date.getHours(), //小时
            "m": date.getMinutes(), //分
            "s": date.getSeconds(), //秒
            "q": Math.floor((date.getMonth() + 3) / 3), //季度
            "S": date.getMilliseconds() //毫秒
        };
        format = format.replace(/([yMdhmsqS])+/g, function(all, t) {
            var v = map[t];
            if (v !== undefined) {
                if (all.length > 1) {
                    v = '0' + v;
                    v = v.substr(v.length - 2);
                }
                return v;
            } else if (t === 'y') {
                return (date.getFullYear() + '').substr(4 - all.length);
            }
            return all;
        });
        return format;
    });

    /**
     * 时间倒读
     * @param  {number} oldDate 时间戳
     * @return {string} 倒读
     */
    template.helper('dateDesc',function(oldDate){
        var now=new Date().getTime(),
            past =  !isNaN(oldDate) ? oldDate : new Date(oldDate).getTime(),
            diffValue = now - past,
            res='',
            s = 1000,
            m = 1000 * 60,
            h = m * 60,
            d = h * 24,
            hm = d * 15,
            mm = d * 30,
            y = mm * 12,
            _y = diffValue/y,
            _mm =diffValue/mm,
            _w =diffValue/(7*d),
            _d =diffValue/d,
            _h =diffValue/h,
            _m =diffValue/m,
            _s = diffValue/s;
        if(_y>=1) res=parseInt(_y) + '年前';
        else if(_mm>=1) res=parseInt(_mm) + '个月前';
        else if(_w>=1) res=parseInt(_w) + '周前';
        else if(_d>=1) res=parseInt(_d) +'天前';
        else if(_h>=1) res=parseInt(_h) +'小时前';
        else if(_m>=1) res=parseInt(_m) +'分钟前';
        else if(_s>=1) res=parseInt(_s) +'秒前';
        else res='刚刚';
        return res;
    });

    /**
     * 只显示指定字数，isPoint为真时，剩余以。。。代替,否则直接截取。
     */
    template.helper('textEllipsis', function(str, len, isPoint){
        isPoint = isPoint || true;
        if(!str) return;
        if(str.length <= len) return str;
        return (isPoint ? str.substring(0, len)+'...' : str.substring(0, len));
    });

    /**
     * 数字转换
     */
    template.helper('transNum', function(num){
        if(!num) return 0;
        if (num >= 10000) {
            num = Math.round(num / 10000 * 100) / 100 +' W';
        } else if(num>= 1000) {
            num = Math.round(num / 1000 * 100) / 100 +' K';
        } else {
            num = num;
        }
        return num;
    })

    /**
    *@alertInfo 错误提示
    *@info param {string} 提示的信息
    *@des startMove 依赖window.commonModule.startMove
    */
    var alertInfo = function(info){
        if(!info) return;
        if(document.getElementsByTagName('body')[0].childNodes[0].id==='alert-info') return;
        var that = this;
        var docHtml = document.body || document.documentElement;
        var clientHeight = docHtml.clientHeight;
        var nClientWidth = docHtml.clientWidth;
        var infoDiv = document.createElement('p');
        infoDiv.id='alert-info';
        infoDiv.className='alert-info';
        infoDiv.innerHTML = info;
        var oBody = document.getElementsByTagName('body')[0];
        console.log(nClientWidth)
        oBody.insertBefore(infoDiv,oBody.childNodes[0]);
        that.startMove(infoDiv,{top:'0'},function(){
            setTimeout(function(){
                if(nClientWidth <= 768){
                    that.startMove(infoDiv,{top:'-60'},function(){
                        oBody.removeChild(infoDiv);
                    });
                }else{
                    that.startMove(infoDiv,{top:'-80'},function(){
                        oBody.removeChild(infoDiv);
                    });
                }
            },2000);
        });
    }


    /**
    *@function startMove 运动函数
    *@o {DOM object} 当前DOM对象
    *@j {JSON} 配置参数 例如{'height':300}
    *@f {function} 回调函数
    *@example startMove(obj,{'height':300},fuction(){})
    */
    var startMove = function(o,j,f){
        clearInterval(o.iTimer);
        var iSpeed=0,iCur = 0,b;
        o.iTimer = setInterval(function(){
            b =true;
            for(var a in j){
                iTarget = j[a];
                iCur = a == 'opacity' ? Math.round(o.getStyle('opacity') * 100) : iCur = parseInt(o.getStyle(a));
                iSpeed = (iTarget - iCur) /8;
                iSpeed  = iSpeed > 0 ? Math.ceil(iSpeed) : Math.floor(iSpeed);
                if(iCur != iTarget){
                    b = false;
                    if(a == 'opacity'){
                        o.style.opacity = (iCur + iSpeed) / 100;
                        o.style.filter = 'alpha(opacity'+(iCur + iSpeed)+')';
                    }else{
                        o.style[a] = (iCur+iSpeed) + 'px';
                    }
                }
                if(b){
                    clearInterval(o.iTimer);
                    f && f();
                }
            }
        },30);
        o.getStyle = function(a){
            if(o.currentStyle){
                return o.currentStyle[a];
            }else{
                return getComputedStyle(o,false)[a];
            }
        }
    }

    /**
     * 运动函数
     * @param  {dom}   obj
     * @param  {obj}   json 运动参数
     * @param  {function} fn   回调
     */
    var moveStart = function(obj, json, fn) {
        var that = this;
        clearInterval(obj.timer);
        obj.timer = setInterval(function() {
            var bStop = true;
            var icur = 0;
            icur = parseInt(that.getStyle(obj, 'top'));
            var iSpeed = (json['top'] - icur) / 8;
            // alert('iSpeed'+iSpeed)
            iSpeed = iSpeed > 0 ? Math.ceil(iSpeed) : Math.floor(iSpeed);
            if (icur != json['top']) {
                bStop = false;
            }
            obj.style['top'] = icur + iSpeed + 'px';
            if (bStop) {
                clearInterval(obj.timer);
                fn && fn();
            }
        }, 30);
    }

    /**
     * 返回元素最终显示样式
     * @param  {[type]} element [description]
     * @param  {[type]} attr    [description]
     * @return {[type]}         [description]
     */
    var getStyle = function(element, attr) {
        return getComputedStyle(element, false)[attr];
    }

    /**
    *@function toScrollHeight 跳到指定滚动条高度
    *@param iTarget {number} 指定滚动条高度 例如:300
    *@param obj {object} 触发该方法的对象
    *@example toScrollHeight(300,document.getElementId('obj'))
    */
    var toScrollHeight = function(iTarget,obj){
        var that =this;
        var iTimer = null;
        var b = 0;
        //不能放在scroll时间里，否则无滚动，不能点击
        if(obj !== 'undefined'){
            obj.addEventListener('click',function(){
                clearInterval(iTimer);
                runFn(iTarget);
            });
        }
        window.addEventListener('scroll',function(){
            if (b != 1) {
                clearInterval(iTimer);
            }
            b = 2;
        });
        function runFn(iTarget,iCur) {
            clearInterval(iTimer);
            var iSpeed = 0,iCur = 0;
            iTimer = setInterval(function() {
                iCur = document.documentElement.scrollTop || document.body.scrollTop;
                //一直没想到会是这步的原因,由于放向的不同,取值会不同,ceil是为了向下滚动,为正数,floor是为了向上滚动,为负数
                iSpeed = iSpeed > 0 ?  Math.ceil((iTarget - iCur) / 7) : Math.floor((iTarget -iCur)/7);
                if (iCur != iTarget) {
                    document.documentElement.scrollTop = document.body.scrollTop = iCur + iSpeed;
                } else {
                    clearInterval(iTimer);
                }
                b = 1;
            }, 30);
        }
    }
    var $$ =  {
        alertInfo:alertInfo,
        startMove:startMove,
        moveStart:moveStart,
        getStyle:getStyle,
        toScrollHeight:toScrollHeight
    }
	return {
		template:template,
        q:q,
		$:jquery,
        $$:$$
	}
});
