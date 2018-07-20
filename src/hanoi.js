class BasicChart{
    constructor(data){
        this.data = data;
        this.margin = 30;
        this.width=window.innerWidth - this.margin*2;
        this.height=window.innerHeight - this.margin*2;
        this.svg = d3.select('#chart-container').append('svg')
            .attr('width',this.width)
            .attr('height',this.height);

        this.chartcanvas = this.svg.append('g')
            .attr('transform',`translate(${this.margin},${this.margin})`);
    }

    getCol(data, col){
        var column=[];
        for(let i=0;i<data.length;i++){
            column.push(data[i][col])
        }
        return column;
    }
}

class HanoiChart extends BasicChart{
    constructor(data){
        super(data);
        var maxVal = d3.max(this.getCol(data, 1));
        var centerline = this.width/3-this.margin/2;
        var textline = this.width*2/3+this.margin/2;

        var xScale = d3.scale.log()
            .base(10)
            .domain([d3.min(this.getCol(data,1))/2,d3.max(this.getCol(data,1))])
            .range([0,textline]);

        var yScale = d3.scale.linear()
            .domain([0, data.length])
            .range([0,this.height-this.margin]);


        this.g = this.chartcanvas.append('g');
        this.g.append('line')
             .attr({
               x1:centerline,
               y1:0,
               x2:centerline,
               y2:this.height,
               stroke:'black'
            });

        this.g.append('line')
            .attr({
                x1:textline,
                y1:0,
                x2:textline,
                y2:this.height,
                stroke:'black'
            })
            .attr('class','seperator');

        var barheight  =this.height/data.length-this.margin/3;
        this.g2 = this.chartcanvas.append('g');
        this.g2.selectAll('rect')
            .data(data)
            .enter()
            .append('rect')
            .attr('x',centerline)
            .attr('y', (d,i)=>yScale(i)+barheight/2)
            .attr('width',0)
            .attr('height',0)
            .on('mouseover',overeffect)
            .on('mouseout',outeffect)
            .transition()
            .duration(2500)
            .attr('x',(d,i)=>centerline-xScale(d[1])/2)
            .attr('y',(d,i)=>yScale(i))
            .attr('width',(d)=>xScale(d[1]))
            .attr('height',barheight)
            .attr('class',(d,i)=>i%2==0?'bar':'bar2')
            .attr({rx:10,ry:10});


        this.g3 = this.chartcanvas.append('g').selectAll('text')
            .data(data)
            .enter().append('text')
            .attr('x',textline)
            .attr('y',(d,i)=>yScale(i)+barheight/2)
            .attr('class','letter')
            .attr('data-letter',(d)=>d[0])
            .text((d)=>d[0]);

        var corner=2;
        function overeffect(d,i){
            var coords = [0,0];
            let scalefactor=0.5;
            coords = d3.mouse(this);
            d3.select(this)
                .attr('class','highlightbar');
            d3.selectAll('.bar')
                .data(data)
                .attr('class','nohighlightbar');
            d3.selectAll('.bar2')
                .attr('class','nohighlightbar');
            var infog=d3.select('svg').select('g')
                .append('g')
                .attr('id','info');
            infog.append('rect')
                .attr('x',coords[0]-d[1].toString().length*10/2)
                .attr('y',coords[1]-45)
                .attr('width',d[1].toString().length*15+'value'.length*15)
                .attr('height',30)
                .attr('rx',corner)
                .attr('ry',corner)
                .attr('class','infobox');
            infog.append('text').text('Value: '+d[1]).attr('x',coords[0]-d[1].toString().length*10/4).attr('y',coords[1]-25);

        }

        function outeffect(d,i){
            d3.select(this).attr('class',i%2==0?'bar':'bar2');

            d3.selectAll('.nohighlightbar')
                .data(data)
                .attr('class',(d,j)=>{
                    console.log(d,i);
                    return j%2==0?'bar':'bar2';
                });
            d3.select('#info').remove();
        }

    }
}

var dataarray = [
    ['All Mail',50000],
    ['Total filtered',10000],
    ['L1',1000],
    ['L2',850],
    ['L3',500],
];
console.log(dataarray);

var container = new HanoiChart(dataarray);
console.log('works');
