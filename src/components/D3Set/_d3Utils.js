import * as d3 from 'd3';
//设置线的编号
function setLinkNumber(group, type) {
    if (group.length === 0) return;
    //对该分组内的关系按照方向进行分类，此处根据连接的实体ASCII值大小分成两部分  
    var linksA = [], linksB = [];
    for (var i = 0; i < group.length; i++) {
        var link = group[i];
        if (link.source < link.target) {
            linksA.push(link);
        } else {
            linksB.push(link);
        }
    }
    //确定关系最大编号。为了使得连接两个实体的关系曲线呈现对称，根据关系数量奇偶性进行平分。  
    //特殊情况：当关系都是连接到同一个实体时，不平分  
    var maxLinkNumber = 0;
    if (type === 'self') {
        maxLinkNumber = group.length;
    } else {
        maxLinkNumber = group.length % 2 === 0 ? group.length / 2 : (group.length + 1) / 2;
    }
    //如果两个方向的关系数量一样多，直接分别设置编号即可  
    if (linksA.length === linksB.length) {
        let startLinkNumber = 1;
        for (let i = 0; i < linksA.length; i++) {
            linksA[i].linknum = startLinkNumber++;
        }
        startLinkNumber = 1;
        for (let i = 0; i < linksB.length; i++) {
            linksB[i].linknum = startLinkNumber++;
        }
    } else {//当两个方向的关系数量不对等时，先对数量少的那组关系从最大编号值进行逆序编号，然后在对另一组数量多的关系从编号1一直编号到最大编号，再对剩余关系进行负编号  
        //如果抛开负号，可以发现，最终所有关系的编号序列一定是对称的（对称是为了保证后续绘图时曲线的弯曲程度也是对称的）  
        var biggerLinks, smallerLinks;
        if (linksA.length > linksB.length) {
            biggerLinks = linksA;
            smallerLinks = linksB;
        } else {
            biggerLinks = linksB;
            smallerLinks = linksA;
        }

        let startLinkNumber = maxLinkNumber;
        for (let i = 0; i < smallerLinks.length; i++) {
            smallerLinks[i].linknum = startLinkNumber--;
        }
        var tmpNumber = startLinkNumber;

        startLinkNumber = 1;
        var p = 0;
        while (startLinkNumber <= maxLinkNumber) {
            biggerLinks[p++].linknum = startLinkNumber++;
        }
        //开始负编号  
        startLinkNumber = 0 - tmpNumber;
        for (let i = p; i < biggerLinks.length; i++) {
            biggerLinks[i].linknum = startLinkNumber++;
        }
    }
}
//设置线的分组
function setLinks(links) {
    //关系分组  
    var linkGroup = {};
    //对连接线进行统计和分组，不区分连接线的方向，只要属于同两个实体，即认为是同一组  
    var linkmap = {}
    for (var i = 0; i < links.length; i++) {
        var key = links[i].source < links[i].target ? links[i].source + ':' + links[i].target : links[i].target + ':' + links[i].source;
        if (!linkmap.hasOwnProperty(key)) {
            linkmap[key] = 0;
        }
        linkmap[key] += 1;
        if (!linkGroup.hasOwnProperty(key)) {
            linkGroup[key] = [];
        }
        linkGroup[key].push(links[i]);
    }
    //为每一条连接线分配size属性，同时对每一组连接线进行编号  
    for (let i = 0; i < links.length; i++) {
        let key = links[i].source < links[i].target ? links[i].source + ':' + links[i].target : links[i].target + ':' + links[i].source;
        links[i].size = linkmap[key];
        //同一组的关系进行编号  
        var group = linkGroup[key];
        var keyPair = key.split(':');
        var type = 'noself';//标示该组关系是指向两个不同实体还是同一个实体  
        if (keyPair[0] === keyPair[1]) {
            type = 'self';
        }
        //给节点分配编号  
        setLinkNumber(group, type);
    }

}
//渲染的连续点击D3，即扩散动画
function tick(link, node, svg_texts, path_text, path_text_text) {
    link.attr('d', function (d) {
        //如果连接线连接的是同一个实体，则对path属性进行调整，绘制的圆弧属于长圆弧，同时对终点坐标进行微调，避免因坐标一致导致弧无法绘制 
        if (d.target === d.source) {
            let dr = 30 / d.linknum;
            return "M" + d.source.x + "," + d.source.y + "A" + dr + "," + dr + " 0 1,1 " + d.target.x + "," + (d.target.y + 1);
        } else if (d.size % 2 !== 0 && d.linknum === 1) {//如果两个节点之间的连接线数量为奇数条，则设置编号为1的连接线为直线，其他连接线会均分在两边  
            return 'M ' + d.source.x + ' ' + d.source.y + ' L ' + d.target.x + ' ' + d.target.y;
        }
        //根据连接线编号值来动态确定该条椭圆弧线的长半轴和短半轴，当两者一致时绘制的是圆弧  
        //注意A属性后面的参数，前两个为长半轴和短半轴，第三个默认为0，第四个表示弧度大于180度则为1，小于则为0，这在绘制连接到相同节点的连接线时用到；第五个参数，0表示正角，1表示负角，即用来控制弧形凹凸的方向。本文正是结合编号的正负情况来控制该条连接线的凹凸方向，从而达到连接线对称的效果  
        var curve = 1.5;
        var homogeneous = 1.2;
        var dx = d.target.x - d.source.x,
            dy = d.target.y - d.source.y,
            dr = Math.sqrt(dx * dx + dy * dy) * (d.linknum + homogeneous) / (curve * homogeneous);
        //当节点编号为负数时，对弧形进行反向凹凸，达到对称效果  
        if (d.linknum < 0) {
            dr = Math.sqrt(dx * dx + dy * dy) * (-1 * d.linknum + homogeneous) / (curve * homogeneous);
            return "M" + d.source.x + "," + d.source.y + "A" + dr + "," + dr + " 0 0,0 " + d.target.x + "," + d.target.y;
        }
        return "M" + d.source.x + "," + d.source.y + "A" + dr + "," + dr + " 0 0,1 " + d.target.x + "," + d.target.y;
    });

    //更新节点坐标  限制节点位置
    node.attr("cx", function (d) { return d.x; })
        .attr("cy", function (d) { return d.y; });
    //更新文字坐标
    svg_texts.attr("x", function (d) { return d.x; })
        .attr("y", function (d) { return d.y + 5; });

    /* path_text.attr('transform', function (d, i) {
        if (d.target.x < d.source.x) {
            let bbox = this.getBBox();
            let rx = bbox.x + bbox.width / 2;
            let ry = bbox.y + bbox.height / 2;
            return 'rotate(180 ' + rx + ' ' + ry + ')';
        }
        else {
            return 'rotate(0)';
        }
    }); */
    path_text.attr("x", function (d) { return (d.source.x + d.target.x) / 2 - 60; })
        .attr("y", function (d) { return (d.source.y + d.target.y) / 2 - 13; })
    path_text_text.attr("x", function (d) { return (d.source.x + d.target.x) / 2-20; })
        .attr("y", function (d) { return (d.source.y + d.target.y) / 2+4; })
}
//设置整体导向图的拖拽及放大缩小
function setSvg(svg, g, force, centerX, centerY) {
    let tmpx, tmpy;
    svg.call(d3.drag()
        .on("start", function (e) {
            if (!d3.event.active) force.alphaTarget(0.3).restart();  //restart是重新恢复模拟
            tmpx = d3.event.x;
            tmpy = d3.event.y;
        })
        .on("drag", function (e) {
            let x = d3.event.x - tmpx,
                y = d3.event.y - tmpy;
            force.force("center", d3.forceCenter(centerX + x / 2, centerY + y / 2));
        })
        .on("end", function (e) {
            if (!d3.event.active) force.alphaTarget(0);
            let x = d3.event.x - tmpx,
                y = d3.event.y - tmpy;
            force.force("center", d3.forceCenter(centerX + x / 2, centerY + y / 2));
            centerX = centerX + x / 2
            centerY = centerY + y / 2;
        })
    )
    var zoom = d3.zoom()
        .scaleExtent([0, 1.2])//用于设置最小和最大的缩放比例  
        .on("zoom", function () {
            g.attr("transform", d3.event.transform);
            g.attr("scale", d3.event.transform.k)
        })
    svg.call(zoom)
}
export { setLinkNumber, setLinks, tick, setSvg }