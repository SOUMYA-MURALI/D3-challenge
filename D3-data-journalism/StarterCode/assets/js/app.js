function displayToolTip() { 

    //set svg dimensions
    var svgWidth = 1000;
    var svgHeight = 600;
    
    //set borders in svg
    var margin = {
        top: 10,
        right: 50,
        bottom: 150,
        left: 150
    };
    
    //Calculate chart width and height
    var width = svgWidth - margin.right - margin.left;
    var height = svgHeight - margin.top - margin.bottom;
    
    
    //append chart to the scatter id in html
    var chart = d3.select("#scatter").append("div").classed("chart", true);
    
    //append svg 
    var svg = chart.append("svg")
        .attr("width", svgWidth)
        .attr("height", svgHeight);
    
    //append group
    var chartGroup = svg.append("g")
        .attr("transform", `translate(${margin.left}, ${margin.top})`);
    
    
    var xLabelName = "Poverty";
    var yLabelName = "Lacks Healthcare";
    
    // Read CSV
    d3.csv("./assets/data/data.csv").then(function(healthRiskData) {
    
        // parse data
        healthRiskData.forEach(function(data) {
          data.poverty = +data.poverty;
          data.healthcare = +data.healthcare;
        });
    
    
        // create scales
        var xScale = d3.scaleLinear()
        .domain([d3.min(healthRiskData, d => d.poverty) - 1, d3.max(healthRiskData, d => d.poverty) + 2])
        .range([0, width]);
    
        var yScale = d3.scaleLinear()
        .domain([d3.min(healthRiskData, d => d.healthcare) - 0.75, d3.max(healthRiskData, d => d.healthcare) + 2])
        .range([height, 0]);
    
        // create axes
        var xAxis = d3.axisBottom(xScale);
        var yAxis = d3.axisLeft(yScale);
    
        //append x axis
        chartGroup.append("g")
        .classed("x-axis", true)
        .attr("transform", `translate(0, ${height})`)
        .call(xAxis);
    
        //append y axis
        chartGroup.append("g")
        .classed("y-axis", true)
        .call(yAxis);
    
    
        // append circles to data points
        var circlesGroup = chartGroup.selectAll("circle")
        .data(healthRiskData)
        .enter()
        .append("circle")
        .classed("stateCircle", true)
        .attr("cx", d => xScale(d.poverty))
        .attr("cy", d => yScale(d.healthcare))
        .attr("opacity", ".75")
        .attr("r", "12");
    
        //append initial text
        chartGroup.selectAll(".stateText")
        .data(healthRiskData)
        .enter()
        .append("text")
        .classed("stateText", true)
        .attr("x", d => xScale(d.poverty))
        .attr("y", d => yScale(d.healthcare))
        .attr("dy", 3)
        .attr("font-size", "10px")
        .text(function(d){return d.abbr});
    
        //append label
        var xLabel = chartGroup.append("g")
        .attr("transform", `translate(${width / 2}, ${height + 20 + margin.top})`);
        
        //append label text
        xLabel.append("text")
        .attr("x", 0)
        .attr("y", 20)
        .attr("value", "poverty")
        .text("In Poverty (%)");
        
        //append label
        var yLabel = chartGroup.append("g")
        .attr("transform", `translate(${0 - margin.left/4}, ${(height/1.5)})`);
    
        //append label text
        yLabel.append("text")
        .attr("x", 0)
        .attr("y", 0 - 20)
        .attr("transform", "rotate(-90)")
        .attr("value", "healthcare")
        .text("Lacks Healthcare (%)");
    
        // Step 1: Initialize Tooltip
        var toolTip = d3.tip()
            .attr("class", "d3-tip")
            .offset([-8, 0])
            .html(function(d) {
            //console.log(`${d.state}`);
            //console.log(`${xLabelName} ${d.poverty}`);
            //console.log(`${yLabelName} ${d.healthcare}`);
            return (`${d.state}<br>${xLabelName} ${d.poverty}% <br>${yLabelName} ${d.healthcare}%`);
        });
    
        // Step 2: Create the tooltip in chartGroup.
        circlesGroup.call(toolTip);
    
        //add events
        circlesGroup.on("mouseover", function(d) {
            toolTip.show(d, this);
          })
          // Step 4: Create "mouseout" event listener to hide tooltip
            .on("mouseout", function(d) {
              toolTip.hide(d);
            });
         }).catch(function(error) {
               console.log(error);
        });
        
    }
    // When the browser loads, displayToolTip() is called.
    displayToolTip();
    
    