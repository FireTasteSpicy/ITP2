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
    let slider;
    let data;
    let dataArray = [];
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

        console.log(this.data);


        //Populate dataArray
        this.categories = this.data.getColumn(0);
        this.data.removeColumn(0);
        this.quarters = this.data.getRow(0);
        this.data.removeRow(0);

        this.dataArray = this.data.getArray();

        console.log(this.dataArray);

        for (let i = 0; i < this.dataArray.length; i++) {
            for(let j = 0; j < this.dataArray[i].length; j++){
                this.dataArray[i][j] = parseInt(this.dataArray[i][j]);
            }
        }


        // create a slider
        slider = createSlider(1, data.getColumnCount(), 0);
        slider.position(10, 10);
        slider.style('width', '80px');
    }

    //destroy when changing visualisations
    this.destroy = function(){
        // yearSlider.remove(); //remove year slider
    };
    
    this.dataProcessing = function(){
    }


    this.draw = function() {
    //     background(220);

    //     let series1 = [];
    //     let series2 = [];

    //     // extract data for each series
    //     for (let i = 1; i < data.getRowCount(); i++) {
    //         for (let j = 1; j < data.getColumnCount(); j++) {
    //         series1.push(data.getNum(i, slider.value()));
    //         series2.push(data.getNum(i, slider.value() + 1));
    //     }

    //     // normalise data
    //     let maxVal = max(series1.concat(series2));
    //     series1 = series1.map(val => map(val, 0, maxVal, 0, height));
    //     series2 = series2.map(val => map(val, 0, maxVal, 0, height));

    //     // draw series 1
    //     beginShape();
    //     for (let i = 0; i < series1.length; i++) {
    //         vertex(i * (width / series1.length), height - series1[i]);
    //     }
    //     endShape();

    //     // draw series 2
    //     beginShape();
    //     for (let i = 0; i < series2.length; i++) {
    //         vertex(i * (width / series2.length), height - series1[i] - series2[i]);
    //     }
    //     endShape();
    //     }   
    }  
}