let gamesData

const createTreemap = () => {
    const hierarchy = d3.hierarchy(gamesData, (node) => {
        return node.children
    }).sum((node) => {
        return node.value
    }).sort((node1, node2) => {
        return node2.value - node1.value
    })

    const treemap = d3.treemap().size([1200, 800])
    treemap(hierarchy)
    const leaves = hierarchy.leaves()
    console.log(leaves);
    const map = d3.select('#map')

    const colorScale = d3.scaleOrdinal()
                        .domain(['WII', 'DS', 'X360', 'GB', 'PS3', 'NES', 'PS2', '3DS', 'PS4', 'SNES', 'PS', 'N64', 'GBA', 'XB', 'PC', '2600', 'PSP', 'XOne'])
                        .range(['#FF8080', '#FFC180', '#FFED80', '#E4FF80', '#9AFF80', '#80FF9A', '#80FFDA', '#80E8FF', '#80BFFF', '#8095FF', '#AD80FF', '#D980FF', '#FF80F5', '#FF80C2', '#FF809F', '#FF807C', '#FFA7A7', '#FFD4A7']);
  
    const tooltip = d3.select('#tooltip')
                    .style('opacity', 0);

    const cell = map.selectAll('g')
                    .data(leaves)
                    .enter()
                    .append('g');
                      
    cell.append('rect')
        .attr('class', 'tile')
        .attr('fill', (d) => {
            const category = d.data.category;
            return colorScale(category);
        })
        .attr('stroke', 'black')
        .attr('stroke-width', 0.2)
        .attr('x', (d) => d.x0)
        .attr('width', (d) => d.x1 - d.x0)
        .attr('y', (d) => d.y0)
        .attr('height', (d) => d.y1 - d.y0)
        .attr('data-name', (d) => d.data.name)
        .attr('data-category', (d) => d.data.category)
        .attr('data-value', (d) => d.data.value)
        .on('mouseover', (event, d) => {
            tooltip.style('opacity', 0.7);
            tooltip.attr('data-name', d.data.name)
                .attr('data-category', d.data.category)
                .attr('data-value', d.data.value);
            tooltip.html('Name: ' + d.data.name + '<br>' + 'Category: ' + d.data.category + '<br>' + 'Value: ' + d.data.value)
        })
        .on('mousemove', (event) => {
            tooltip.style('left', event.pageX + 10 + 'px')
                .style('top', event.pageY + 10 + 'px');
        })
        .on('mouseout', (d) => {
            tooltip.style('opacity', 0);
        })
                      
    cell.append('text')
        .attr('x', (d) => d.x0 + 10)
        .attr('y', (d) => d.y0 + 20)
        .text((d) => d.data.name)
        .attr('font-size', 12);

    const legend = d3.select('#legend')
                    .attr('width', 1200)
                    .attr('height', 100)
                    .append('g')
                    .attr('class', 'grouping')
                    
    legend.selectAll('rect')
        .data(colorScale.domain())
        .enter()
        .append('rect')
        .attr('class', 'legend-item')
        .attr('fill', (d) => colorScale(d))
        .attr('stroke', 'black')
        .attr('stroke-width', 0.2)
        .attr('x', (d, i) => i * 60)
        .attr('y', 20)
        .attr('width', 50)
        .attr('height', 15);
      
    legend.selectAll('text')
        .data(colorScale.domain())
        .enter()
        .append('text')
        .attr('x', (d, i) => 15 + i * 60) // Ajusta la posición horizontal del texto
        .attr('y', 60)
        .text((d) => d)
        .attr('font-size', 12);

}

d3.json('https://cdn.freecodecamp.org/testable-projects-fcc/data/tree_map/video-game-sales-data.json').then(
    (data, error) => {
        if(error) {
            console.log(log);
        } else {
            gamesData = data;
            createTreemap();
        }
    }
)