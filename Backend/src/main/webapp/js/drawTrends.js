var cleanAxis = function (axis) {
    // Leave the first label
    let last = false;
    let current = true;

    axis.shapes.selectAll("text")
        .each(function (d) {
            d = Math.floor(d);
            current = d;

            if (last === current || last === false || current === 0) {
                this.remove();
            }
            last = current

        });
};


function drawTrends(url, instrument, counterparty, divname) {
    //new line
    d3.select("svg").remove();

    var svg = dimple.newSvg(divname, "100%", "600");

    d3.json(url, function (data) {

        //var inFormat = d3.timeParse("%Y-%m-%dT%H:%M:%S.%L");
        let inFormat = d3.timeParse("%M:%S");
        var timeFormat = d3.timeFormat("%M");
        var frame = 1000;
        var instrument = "All";
        var counterparty = "All";
        var story = null;

        if (instrument !== "All") {
            data = dimple.filterData(data, "instrument_name", instrument)
        }

        if (counterparty !== "All") {
            data = dimple.filterData(data, "counterparty_name", counterparty)
        }

        data.forEach(function (d) {
            // if (d["deal_type"] === "S"){
            //     d["deal_amount"] = -d["deal_amount"]
            // }
            // d["total_amount"] =
            //     d["deal_amount"] * d["deal_quantity"];

            var inDate = inFormat(d["timeonly"]);

            // if (inDate === null){
            //     inDate = altinFormat(d["deal_time"]);
            // }

            d["Time"] = timeFormat(inDate);

        }, this);

        // Create the chart
        var myChart = new dimple.chart(svg, data);
        myChart.setBounds("10%", "10%", "80%", "70%");

        myChart.defaultColors = [
            new dimple.color("#003399", "#0068ae", 1),
            new dimple.color("#009ee0", "#6d9fbd", 1),
            new dimple.color("#667292", "#8d9db6", 1),
            new dimple.color("#fdab18", "#fdd686", 1),
            new dimple.color("#cb501b", "#e5a7bd", 1),
            new dimple.color("#d7cb89", "#ebe6ca", 1),
            new dimple.color("#52397a", "#ab9cbc", 1),
            new dimple.color("#772379", "#bb91bc", 1),
            new dimple.color("#b1be2d", "#d8de96", 1),
            new dimple.color("#007a9e", "#7fbcce", 1),
            new dimple.color("#b9936c", "#dac292", 1),
            new dimple.color("#f7786b", "#f7cac9", 1)
        ];

        // Add an x and 2 y-axes.  When using multiple axes it's
        // important to assign them to variables to pass to the series
        var x = myChart.addCategoryAxis("x", ["timeonly", "Time"]);
        x.addGroupOrderRule("timeonly");
        x.addOrderRule("timeonly");

        //x.hidden=true;

//                var x = myChart.addAxis("x", null, null, "deal_time");
//                x.addOrderRule("deal_time", false);
//                x.tickFormat = d3.timeFormat("%S");
        var y1 = myChart.addMeasureAxis("y", "total_amount");
        var y2 = myChart.addMeasureAxis("y", "total_quantity");
        //x.tickFormat = ',.0f';
        y1.tickFormat = ',.0f';
        y2.tickFormat = ',.0f';
        y1.title = "Total Amount";
        y2.title = "Total Quantity";
        x.title = "Time";
        // Color the sales bars to be highly transparent
        //myChart.assignColor("total_amount", "#222222", "#000000", 0.1);

        // Add the bars mapped to the second y axis
        var deal_amount = myChart.addSeries("Total Quantity", dimple.plot.bar, [x, y2]);
        deal_amount.aggregate = dimple.aggregateMethod.sum;

        var total_amount = myChart.addSeries("Total Amount", dimple.plot.line, [x, y1]);
        total_amount.aggregate = dimple.aggregateMethod.sum;

        myChart.lineMarkers = true;
        var myLegend = myChart.addLegend("90%", "0%", 40, 400, "Right");
        myLegend.fontSize = "13px";


        myChart.draw();

        y1.shapes.selectAll("text").attr("fill", myChart.defaultColors[1].fill).style("opacity", 0.8);
        y2.shapes.selectAll("text").attr("fill", myChart.defaultColors[0].fill).style("opacity", 0.8);
        x.shapes.selectAll("text").style("text-anchor", "start")
            .attr("transform", "translate(0, 0)  rotate(0)" );
        //cleanAxis(x);


        var titleText = svg.append("text")
            .attr("x", myChart._xPixels() + myChart._widthPixels() / 2)
            .attr("y", myChart._yPixels() - 30)
            .style("text-anchor", "middle")
            .style("font-family", "sans-serif")
            .style("font-weight", "bold")
            .style("font-size", "20")
            .text("The data is for instrument " + instrument + " and counterparty " + counterparty );

        svg.selectAll(".dimple-axis")
            .style("font-family", "sans-serif")
            .style("font-size", "15");


        d3.select("#instrument").on("change", function(){
            instrument = d3.select(this).node().value;

            if ( instrument === "All" && counterparty === "All") {
                myChart.storyboard = null;
                myChart.draw(1000);
            } else if ( counterparty === "All" ) {
                story = myChart.setStoryboard(["instrument_name"]);
                story.goToFrame(instrument);
                story.stopAnimation();
            } else if ( instrument === "All" ) {
                story = myChart.setStoryboard(["counterparty_name"]);
                story.goToFrame(counterparty);
                story.stopAnimation();
            } else {
                story = myChart.setStoryboard(["instrument_name", "counterparty_name"]);
                story.goToFrame(instrument + "/" + counterparty);
                story.stopAnimation();
            }
            story.storyLabel.remove();
            titleText.text("The data is for instrument " + instrument + " and counterparty " + counterparty );
            svg.selectAll(".dimple-axis")
                .style("font-family", "sans-serif")
                .style("font-size", "15");
            y1.shapes.selectAll("text").attr("fill", myChart.defaultColors[1].fill).style("opacity", 0.8);
            y2.shapes.selectAll("text").attr("fill", myChart.defaultColors[0].fill).style("opacity", 0.8);
        });
        d3.select("#counterparty").on("change", function(){
            counterparty = d3.select(this).node().value;

            if ( instrument === "All" && counterparty === "All") {
                myChart.storyboard = null;
                myChart.draw(1000);
            } else if ( counterparty === "All" ) {
                story = myChart.setStoryboard(["instrument_name"]);
                story.goToFrame(instrument);
                story.stopAnimation();
            } else if ( instrument === "All" ) {
                story = myChart.setStoryboard(["counterparty_name"]);
                story.goToFrame(counterparty);
                story.stopAnimation();
            } else {
                story = myChart.setStoryboard(["instrument_name", "counterparty_name"]);
                story.goToFrame(instrument + "/" + counterparty);
                story.stopAnimation();
            }
            story.storyLabel.remove();
            titleText.text("The data is for instrument " + instrument + " and counterparty " + counterparty );
            svg.selectAll(".dimple-axis")
                .style("font-family", "sans-serif")
                .style("font-size", "15");
            y1.shapes.selectAll("text").attr("fill", myChart.defaultColors[1].fill).style("opacity", 0.8);
            y2.shapes.selectAll("text").attr("fill", myChart.defaultColors[0].fill).style("opacity", 0.8);
        });




    });
}
