function sgDebt(){
    // Initialize object properties
    this.name = 'SG Debt';
    this.id = 'sg-debt';
    this.title = 'SG Debt';
    this.loaded = false;  // Flag to check if data is loaded
    this.selectedCategory = null;  // Holds the selected debt category
    this.maxTotalCalculated = false;  // Flag to check if maxTotal is calculated

    // Axis labels
    this.xAxisLabel = 'Quarter';
    this.yAxisLabel = 'Debt (SGD)';

    // Layout configuration
    let marginSize = 50;
    this.layout = {
        marginSize: marginSize,
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
        grid: true,

        // Number of axis tick labels to draw so that they are not drawn on
        // top of one another.
        numXTickLabels: 10,
        numYTickLabels: 10,
    };
    //preload the csv file
    this.preload = function(){
        let self = this;
        this.data = loadTable("./data/sg-debt/sg-debt.csv", "csv",
        function(data) {
            self.loaded = true;
        });
    };
    this.setup = function() {
        textSize(16);
        textAlign('center', 'center');
        background(220);

        //find the highest total for each column
        if(this.maxTotalCalculated == false){
            this.calculateMaxTotal(this.data.getColumnCount(),this.data.getRowCount());
            this.maxTotalCalculated = true;
        }
    }
    
    this.draw = function() {
        if (!this.loaded) {
            console.log('Data not yet loaded');
            return;
        }
        if (mouseIsPressed) {
            this.mousePressed();
        }
        //calculates max total debt
        if(this.maxTotalCalculated == false){
            if(this.selectedCategory == null) {
                this.calculateMaxTotal(this.data.getColumnCount(),this.data.getRowCount());
            } else {
                this.calculateMaxTotal(this.data.getColumnCount(),this.selectedCategory + 1);
            }
            this.maxTotalCalculated = true;
        }
        this.drawLabels();
        this.drawData();
        this.drawLegend();
    }
        
    this.drawLabels = function() {
        // Draw title.
        fill(0);
        noStroke();
        textAlign('center', 'center');
        textSize(30);
        text(this.title,
            (this.layout.plotWidth() / 2) + this.layout.leftMargin,
            this.layout.marginSize/2);
        textSize(16);
        // Draw x and y axis.
        drawAxis(this.layout);
        // Draw x and y axis labels.
        drawAxisLabels(this.xAxisLabel,
                    this.yAxisLabel,
                    this.layout);
        // Draw Y-Axis tick labels
        drawYAxisTickLabels(
            0, // min value
            this.maxTotal, // max value
            this.layout,
            this.mapDebtValueToHeight.bind(this), // bind the method to 'this'
            0
        );

        // Draw X-Axis tick labels
        for (i = 0; i < this.layout.numXTickLabels + 1; i++) {
            var numTick = floor(this.data.getColumnCount()/this.layout.numXTickLabels);
            var distTick = floor(this.layout.plotWidth()/(this.layout.numXTickLabels));

            text(this.data.getString(0, i * numTick + 1),
                i * distTick + this.layout.leftMargin + this.layout.marginSize/2,
                this.layout.bottomMargin + textSize());
        }   
        if(this.maxTotal == 0) {
            text('Debt is 0', this.layout.leftMargin + this.layout.plotWidth()/2, this.layout.topMargin + this.layout.plotHeight()/2);
        }
    }

    this.drawData = function() {
        stroke(0);
        strokeWeight(1);
        let seriesBelow = [];
        let seriesTop = [];
        if (seriesBelow.length == 0) {
            for (let i = 1; i < this.data.getColumnCount(); i++) {
                seriesBelow.push(0);
                if(this.selectedCategory == null) {
                    seriesTop.push(this.data.getNum(1, i));
                }
            }
            for (let i = 1; i < this.data.getRowCount(); i++) {
                    if(this.selectedCategory == i) {
                    for (let j = 1; j < this.data.getColumnCount(); j++) {
                        seriesTop.push(this.data.getNum(i, j));
                    }
                }
            }
        }   
        for (let i = 1; i < this.data.getRowCount(); i++) {
            if (this.selectedCategory !== null && i !== this.selectedCategory) {
                continue;
            }    
            fill(i * 30, i * 30, i * 30, 150);
            beginShape();
            // Loop range aligned with seriesBelow and seriesTop
            for (let j = 0; j <= this.data.getColumnCount() - 1; j++) {
                vertex(this.mapQuarterValueToWidth(j), this.mapDebtValueToHeight(seriesBelow[j]));
            }
            for (let j = this.data.getColumnCount() - 1; j >= 0; j--) { 
                vertex(this.mapQuarterValueToWidth(j), this.mapDebtValueToHeight(seriesTop[j]));
            }
            endShape(CLOSE);  
            seriesBelow = seriesTop;
            seriesTop = [];
            // Assuming this.data.getNum(i+1, j) gets the numeric value from the CSV
            if(i < this.data.getRowCount() - 1) {
                for (let j = 1; j < this.data.getColumnCount(); j++) {
                    seriesTop.push((seriesBelow[j-1]) + this.data.getNum(i+1, j));
                }
            }
        }
    }

    // Draw legend
    this.drawLegend = function(){
        fill(0);
        noStroke();
        textAlign(LEFT);
        var textY = this.layout.topMargin + this.layout.pad;
        var textX = this.layout.leftMargin + this.layout.pad * 2;

        text('Legend', textX, textY + this.layout.pad);
        for (var i = 1; i < this.data.getRowCount(); i++) {
            textY += textSize() + this.layout.pad;
            fill(i * 30, i * 30, i * 30, 150);
            rect(textX, textY, 10, 10);
            fill(0);
            text(this.data.getString(i, 0), textX + 15, textY + this.layout.pad);
        }
    }

    //Helper Functions
    this.mapQuarterValueToWidth = function(value) {
        return map(value,
                    0,
                    this.data.getColumnCount() - 1,
                    this.layout.leftMargin,
                    this.layout.rightMargin);
    }
    this.mapDebtValueToHeight = function(debt) {
        return map(debt,
                    0,
                    this.maxTotal,
                    this.layout.bottomMargin,
                    this.layout.topMargin);
    }
    // Mouse pressed function to handle category selection
    this.mousePressed = function() {
        var textY = this.layout.topMargin + this.layout.pad;
        for (var i = 1; i < this.data.getRowCount(); i++) {
            textY += textSize() + this.layout.pad;
            if (mouseX > this.layout.leftMargin && mouseX < this.layout.leftMargin + 50 &&
                mouseY > textY && mouseY < textY + 10) {
                this.selectedCategory = i;
                this.maxTotalCalculated = false;
                return;
            }
        }
        this.selectedCategory = null;
        this.maxTotalCalculated = false;
    }
    // Helper function to calculate the maximum total debt
    this.calculateMaxTotal = function(column, row) {
        //calculate overall maximum total debt
        if(this.selectedCategory == null) {
            this.maxTotal = 0;
            for (let i = 1; i < column; i++) {
                this.columnTotal = 0;
                for (let j = 1; j < row; j++){
                    this.columnTotal += this.data.getNum(j, i);
                }
                if (this.columnTotal > this.maxTotal){
                    this.maxTotal = this.columnTotal;
                }
            }
        } else { //calculate maximum total debt for selected category
            this.maxTotal = 0;
            for (let i = 1; i < column; i++) {
                this.columnTotal = 0;
                this.columnTotal += this.data.getNum(this.selectedCategory, i);
                if (this.columnTotal > this.maxTotal){
                    this.maxTotal = this.columnTotal;
                }
            }
        }
    }
    
}