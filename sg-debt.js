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

        background(220);

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


        // Draw x and y axis.
        // drawAxis(this.layout);

        // // Draw x and y axis labels.
        // drawAxisLabels(this.xAxisLabel,
        //             this.yAxisLabel,
        //             this.layout);

        let seriesBelow = [];
        let seriesTop = [];

        if (seriesBelow.length == 0) {
            for (let i = 1; i < this.data.getColumnCount(); i++) {
                seriesBelow.push(0);
                seriesTop.push(this.data.getNum(1, i));
            }
        }   

        
        // Ensure seriesBelow and seriesTop are initialized (Issue 1)
        if (seriesBelow.length === 0) {
            // Initialize seriesBelow based on the first row of your CSV data, if needed
        }

        // Ensure these mapping functions are defined and working as expected (Issue 2)
        // this.mapQuarterValueToWidth(j)
        // this.mapDebtValueToHeight(seriesBelow[j])

        for (let i = 1; i < this.data.getRowCount() - 1; i++) {
            fill(i * 40, i * 40, i * 40, 150);
            beginShape(POINTS);
            
            // Loop range aligned with seriesBelow and seriesTop (Issue 4)
            for (let j = 0; j < this.data.getColumnCount() - 1; j++) {
                vertex(this.mapQuarterValueToWidth(j), this.mapDebtValueToHeight(seriesBelow[j]));
            }

            // Modified loop range to include j = 0 and j = 1 (Issue 5)
            for (let j = this.data.getColumnCount() - 1; j >= 0; j--) { 
                vertex(this.mapQuarterValueToWidth(j), this.mapDebtValueToHeight(seriesTop[j]));
            }
            
            // Use CLOSE to properly close the shape (Issue 5)
            endShape();  
            
            // Update seriesBelow for the next iteration
            seriesBelow = seriesTop;
            seriesTop = [];

            // Assuming this.data.getNum(i+1, j) gets the numeric value from the CSV (Issue 3)
            for (let j = 1; j < this.data.getColumnCount(); j++) {
                console.log(this.data.getColumnCount());
                console.log(seriesBelow[j-1]);
                console.log(i+1, j)
                console.log(this.data.getNum(i+1, j));
                seriesTop.push((seriesBelow[j]) + this.data.getNum(i+1, j));
            }
        }
    
    }

    //Helper Functions
    this.mapQuarterValueToWidth = function(value) {
        return map(value,
                    0,
                    this.data.getColumnCount()),
                    this.layout.leftMargin,
                    this.layout.rightMargin;
    }
    this.mapDebtValueToHeight = function(debt) {
        return map(debt,
                    0,
                    this.maxTotal,
                    this.layout.bottomMargin,
                    this.layout.topMargin);
    }
}