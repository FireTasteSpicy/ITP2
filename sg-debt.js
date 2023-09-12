//Create a stacked area chart with the values based on each row of the data, the first row
//is the quarter of the year while the first column is the category of debt. The stacked area
//chart will have 2 sliders at the bottom which controls the values shown on the display, with
//the first slider controlling the earliest quarter while the second slider controls the latest
//quarter.

function sgDebt(){


    //Object Properties
    this.name = 'SG Debt';
    this.id = 'sg-debt';
    this.title = 'SG Debt';
    this.loaded = false;

    //Data
    let startSlider;
    let endSlider;
    let data;
    let quarters = [];
    let categories = [];


    //Names for each axis
    this.xAxisLabel = 'Quarter';
    this.yAxisLabel = 'Debt (SGD)';

    let marginSize = 35;

    this.layout = {
        marginSize: marginSize,

        // Locations of margin positions. Left and bottom have double margin
        // size due to axis and tick labels.
        leftMargin: marginSize * 2,
        rightMargin: width - marginSize,
        topMargin: marginSize,
        bottomMargin: height - marginSize * 2,
        pad: 5,

        plotWidth: function() {
        return this.rightMargin - this.leftMargin;
        },

        plotHeight: function() {
        return this.bottomMargin - this.topMargin;
        },

        // Boolean to enable/disable background grid.
        grid: false,

        // Number of axis tick labels to draw so that they are not drawn on
        // top of one another.
        numXTickLabels: 8,
        numYTickLabels: 8,
    };

    //preload the csv file
    this.preload = function(){
        let self = this;
        this.data = loadTable("./data/sg-debt/sg-debt.csv", "csv",
        function(data) {
            self.loaded = true;
        });
        this.data.trim();
    };
    
    this.setup = function() {
        //Font
        textSize(16);
        textAlign('center', 'center');

        //Header
        this.categories = this.data.getColumn(0);
        this.quarters = this.data.getRow(0);

        //find the highest total for each column
        this.maxTotal = 0;
        for (let i = 1; i < this.data.getColumnCount(); i++) {
            this.columnTotal = 0;
            for (let j = 1; j < this.data.getRowCount(); j++){
                this.columnTotal += this.data.getNum(j, i);
            }
            if (this.columnTotal > this.maxTotal){
                this.maxTotal = this.columnTotal;
            }
        }
        
        // Count the number of frames drawn since the visualisation
        // started so that we can animate the plot.
        this.frameCount = 0;

        // create a slider
        // this.startSlider = createSlider(1, this.data.getColumnCount(), 1, 1);
        // this.startSlider.position(10, 10);
        // this.startSlider.style('width', '80px');

        // this.endSlider = createSlider(1, this.data.getColumnCount(), this.data.getColumnCount(), 1);
        // this.endSlider.position(10, 40);
        // this.endSlider.style('width', '80px');
    }

    //destroy when changing visualisations
    this.destroy = function(){
        // this.startSlider.remove();
        // this.endSlider.remove();
    };
    
    this.draw = function() {
        if (!this.loaded) {
            console.log('Data not yet loaded');
            return;
        }

        //Slider, prevents ranges overlapping
        // if (this.startSlider.value() >= this.endSlider.value()) {
        //     this.startSlider.value(this.endSlider.value() - 1);
        // }
        // this.startQuarter = this.startSlider.value();
        // this.endQuarter = this.endSlider.value();




        background(220);

        // Draw x and y axis.
        drawAxis(this.layout);

        // Draw x and y axis labels.
        drawAxisLabels(this.xAxisLabel,
                    this.yAxisLabel,
                    this.layout);

        let seriesBelow = [];
        let seriesTop = [];

        if (seriesBelow.length == 0) {
            for (let i = 1; i < this.data.getColumnCount(); i++) {
                seriesBelow.push(0);
                seriesTop.push(this.data.getNum(1, i));
            }
            console.log(seriesTop);
        }

        vector = createVector(0, 0);
        
        // // extract data for each series
        // for (let i = 1; i < data.getRowCount(); i++) {
        //     for (let j = 1; j < data.getColumnCount(); j++) {
        //     series1.push(data.getNum(i, slider.value()));
        //     series2.push(data.getNum(i, slider.value() + 1));
        // }

        // // normalise data
        // let maxVal = max(series1.concat(series2));
        // series1 = series1.map(val => map(val, 0, maxVal, 0, height));
        // series2 = series2.map(val => map(val, 0, maxVal, 0, height));

        // // draw series 1
        // beginShape();
        // for (let i = 0; i < series1.length; i++) {
        //     vertex(i * (width / series1.length), height - series1[i]);
        // }
        // endShape();

        // // draw series 2
        // beginShape();
        // for (let i = 0; i < series2.length; i++) {
        //     vertex(i * (width / series2.length), height - series1[i] - series2[i]);
        // }
        // endShape();
        // }   
    }  
}