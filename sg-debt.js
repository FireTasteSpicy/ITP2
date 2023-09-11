function sgDebt(){
    //Object Properties
    this.name = 'SG Debt';
    this.id = 'sg-debt';
    this.title = 'SG Debt';
    this.loaded = false;

    var slider;
    var data;
    var dataArray = [];
    
    //Names for each axis
    this.xAxisLabel = 'Quarter';
    this.yAxisLabel = 'Debt (SGD)';

    var marginSize = 35;

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
        var self = this;
        data = loadTable("./data/sg-debt/sg-debt.csv", "csv", "header",
        function(data) {
            self.loaded = true;
        });
        data.trim();
    };
    
    this.setup = function() {
        //Font
        textSize(16);
        textAlign('center', 'center');

        for (i = 1; i < data.getColumnCount() + 1; i++){
            for (j = 1; j < data.getRowCount() + 1; j++){
                dataArray.push(data.getNum(j, i));
            }
        }    

        console.log(dataArray);

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

    console.log(xAxisLabel);
    }    
}  
