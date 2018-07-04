import * as d3 from 'd3';
function dragstarted(d, force) {
    if (!d3.event.active) force.alphaTarget(0.3).restart();  //restart是重新恢复模拟
    d.fx = d.x;    //d.x是当前位置，d.fx是固定位置
    d.fy = d.y;
}

function dragged(d) {
    d.fx = d3.event.x;
    d.fy = d3.event.y;
}

function dragended(d, force) {
    if (!d3.event.active) force.alphaTarget(0);
    // d.fx = d.x;       //解除dragged中固定的坐标
    // d.fy = d.y;
    d.fx = null;
    d.fy = null;
}
export { dragstarted, dragged, dragended }