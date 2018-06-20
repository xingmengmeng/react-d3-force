function Slide(x,y){
    this.x=x;
    this.y=y;
}
Slide.prototype.age=function(){
    return this.x;
}
// function Mychild(x,y,z){
//     Slide.call(this,x,y);
//     this.z=z;
// }
// 拷贝继承
/* function extend(pre,nex){
    for(let arr in pre){
        nex[arr]=pre[arr];
    }
    return nex;
}
extend(Slide.prototype,Mychild.prototype); */
//原型链继承  需要改constructor
/* Mychild.prototype=new Slide();
Mychild.prototype.constructor=Mychild; */
//冒充继承  把父类的公私都给子类的私有
/* let f=new Slide('3','4');
function Mychild(x,y,z){
    for(let arr in f){
        this[arr]=f[arr];
    }
    console.log(this.x);
    this.z=z;
} */
//Objext.create 继承  也需要改constructor   寄生式组合继承
function Mychild(x,y,z){
    Slide.call(this,x,y);
    this.z=z;
}
Mychild.prototype=Object.create(Slide.prototype);
Mychild.prototype.constructor=Mychild;

Mychild.prototype.sex=function(){
    return this.x;
}
export {
    Slide,
    Mychild
}
//es6 类继承
/* export class Slide {
    constructor(x, y) {
        this.x = x;
        this.y = y;
    }
    age() {
        return '年龄为：' + this.x;
    }
}
export class Mychild extends Slide {
    constructor(x, y, z) {
        super(x, y);//必须先写super()不然报错  继承上面的私有属性
        this.z = z;
    }
    sex() {
        return '性别为：' + this.x;
    }
} */
//e6继承原理代码
/* function Slide(x,y){
    this.x=x;
    this.y=y;
}
Slide.prototype.age=function(){
    console.log('年龄为：'+this.x);
}
function Mychild(x,y,z){
    Slide.call(this,x,y);
    this.z=z;
}
Object.setPrototypeOf(Mychild.prototype,Slide.prototype);
Mychild.prototype.sex=function(){
    console.log('性别为：'+this.z);
}
export {
    Slide,
    Mychild
} */