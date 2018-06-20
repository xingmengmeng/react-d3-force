import React, { Component } from 'react';
import Slider from '../../components/Slide/index';
const IMAGE_DATA = [
    {
        src: require('../../components/Slide/images/demo1.png'),
        alt: 'images-1',
    },
    {
        src: require('../../components/Slide/images/demo2.png'),
        alt: 'images-2',
    },
    {
        src: require('../../components/Slide/images/demo3.png'),
        alt: 'images-3',
    },
    {
        src: require('../../components/Slide/images/demo4.png'),
        alt: 'images-3',
    },
];
export default class SliderPage extends Component {

    render() {
        return (
            <section>
                {/*speed 速度  delay 每张图片停留的时间 autoplay自动轮播  dots是否有点击的点点  arrows是否有左右箭头*/}
                <Slider items={IMAGE_DATA}
                    speed={.3}
                    delay={2}
                    autoplay={true}
                    dots={true}
                    arrows={true}
                />
            </section>
        )
    }
}