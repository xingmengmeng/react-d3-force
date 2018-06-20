export function utils(){
    var flg='getComputedStyle' in window;
    function css(curEle){
        var arg2=arguments[1];
        if(typeof arg2==='string'){//获取 or 设置一个
            var arg3=arguments[2];
            if(typeof arg3==='undefined'){//获取
                return this.getCss(curEle,arg2)
            }else{//设置一个
                this.setCss(curEle,arg2,arg3)
            }
        }
        if(arg2.toString()==='[object Object]'){//设置一组
            this.setGroupCss(curEle,arg2)
        }
    }
    function getCss(curEle,attr){
        var val=null;
        var reg=null;
        if(flg){
            val=getComputedStyle(curEle,false)[attr]
        }else{
            //处理透明度
            if(attr==='opacity'){
                val=curEle.currentStyle.filter; //'alpha(opacity=30)'
                reg=/^alpha\(opacity[=:](\d+)\)$/gi;
                //RegExp.$1 --第一个小分组   ；他不受全局g的影响，但是用RegExp之前，一定要先影响lastIndex；能影响lastIndex的属性有两个（test，exec）
                //注意。通过RegExp最多只能拿到$9；第九个小分组之后都拿不到；
                //return reg.test(val)?reg.exec(val)[1]/100:1;
                return reg.test(val)?RegExp.$1/100:1;
            }
            val=curEle.currentStyle[attr];
        }
        //处理单位
        reg=/^([+-])?(\d+(\.\d+)?(px|pt|rem|em))$/i;
        return reg.test(val)?parseFloat(val):val;
    }
    function setCss(curEle,attr,value){
        //处理浮动问题
        if(attr==='float'){
            curEle.style.cssFloat=value;
            curEle.style.styleFloat=value;
            return;
        }
        //处理透明度
        if(attr==='opacity'){
            curEle.style.opacity=value;
            curEle.style.filter='alpha(opacity='+(value*100)+')';
            return;
        }
        //处理单位
        var reg=/^(width|height|left|top|right|bottom|((margin|padding)(left|top|right|bottom)?))$/ig;
        if(reg.test(attr) && value.toString().indexOf('%')===-1){
            value=parseFloat(value)+'px';
        }
        curEle.style[attr]=value;
    }
    function setGroupCss(curEle,opt){
        if(opt.toString()!=='[object Object]') return;//如果opt不是对象，直接阻断程序；
        for(var attr in opt){
            this.setCss(curEle,attr,opt[attr])
        }
    }
    return{
        css,
        getCss,
        setCss,
        setGroupCss
    }
}
    
