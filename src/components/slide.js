export class Slide {
    constructor(x, y) {
        this.x = x;
        this.y = y;
    }
    age() {
        return '年龄为：' + this.x;
    }
}
//es6继承的原理  
/* export class Mychild{

}
//Mychild的实例  继承Slide的方法  原型的继承
Object.setPrototypeOf(Mychild.prototype, Slide.prototype);
//Mychild的实例  继承Slide的静态属性  构造函数的继承
Object.setPrototypeOf(Mychild, Slide); */
export class Mychild extends Slide {
    constructor(x, y, z) {
        super(x, y);//必须先写super()不然报错  继承上面的私有属性
        this.z = z;
    }
    sex() {
        return '性别为：' + this.x;
    }
}
