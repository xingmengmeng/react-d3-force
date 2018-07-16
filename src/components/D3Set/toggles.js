import * as d3 from 'd3';
function isLinkLine(node, link) {
    return link.source.id === node.id || link.target.id === node.id;
}
function isLinkNode(currNode, node, link) {
    if (currNode.id === node.id) { return true; }
    return link[currNode.id + '-' + node.id] || link[node.id + '-' + currNode.id];
}
function toggleNode(nodeCircle, currNode, isHover) {
    if (isHover) { // 提升节点层级 
        nodeCircle.sort((a, b) => a.id === currNode.id ? 1 : -1); // this.parentNode.appendChild(this); 
        nodeCircle.style('opacity', .1).filter(node => isLinkNode(currNode, node)).style('opacity', 1);
    }
    else { nodeCircle.style('opacity', 1); }
}
function toggleLine(linkLine, currNode, isHover) {
    if (isHover) { // 加重连线样式 
        linkLine.style('opacity', .1).filter(link => isLinkLine(currNode, link)).style('opacity', 1).classed('link-active', true);
    }
    else { // 连线恢复样式 
        linkLine.style('opacity', 1).classed('link-active', false);
    }
}
function toggleLineText(lineText, currNode, isHover) {
    if (isHover) { // 只显示相连连线文字 
        lineText.style('fill-opacity', link => isLinkLine(currNode, link) ? 1.0 : 0.0);
    } else { // 显示所有连线文字
        lineText.style('fill-opacity', '1.0');
    }
}

function deleteNode(nodeDate) {
    if (this.classList.contains('nodeActive')) {
        d3.select(this).classed('nodeActive', false);
    } else {
        d3.select(this).classed('nodeActive', true);
    }
    let selectedNodeData = d3.selectAll('.nodeActive').data();
    return [...new Set(selectedNodeData)];
}
export { toggleNode, toggleLine, toggleLineText, deleteNode }