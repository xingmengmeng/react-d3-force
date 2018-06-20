import * as d3 from 'd3';
export default function(w,h){//w:容器宽  h容器高
    return d3.forceSimulation([])
        .force("link", d3.forceLink([]).id((d)=>(d.id)).distance(100))
        .force("charge", d3.forceManyBody().strength(-2500))
        .force("center", d3.forceCenter( w,  h))
        .force("x", d3.forceX())
        .force("y", d3.forceY())
        .force("collide",d3.forceCollide().strength(0.2).iterations(5))
}