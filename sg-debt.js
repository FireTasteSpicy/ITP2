function sgDebt(){
    //Object Properties
    this.name = 'SG Debt';
    this.id = 'sg-debt';
    this.title = 'SG Debt';
    this.loaded = false;
    
    var slider;
    var data;

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
        // create a slider
        slider = createSlider(1, data.getColumnCount(), 0);
        slider.position(10, 10);
        slider.style('width', '80px');
    }

    //destroy when changing visualisations
    this.destroy = function(){
        yearSlider.remove(); //remove year slider
    };
    
    this.draw = function() {
        background(220);

        let series1 = [];
        let series2 = [];

        // extract data for each series
        for (let i = 1; i < data.getRowCount(); i++) {
            series1.push(data.getNum(i, slider.value()));
            series2.push(data.getNum(i, slider.value() + 1));
        }

        // normalise data
        let maxVal = max(series1.concat(series2));
        series1 = series1.map(val => map(val, 0, maxVal, 0, height));
        series2 = series2.map(val => map(val, 0, maxVal, 0, height));

        // draw series 1
        beginShape();
        for (let i = 0; i < series1.length; i++) {
            vertex(i * (width / series1.length), height - series1[i]);
        }
        endShape();

        // draw series 2
        beginShape();
        for (let i = 0; i < series2.length; i++) {
            vertex(i * (width / series2.length), height - series1[i] - series2[i]);
        }
        endShape();
    }
}    
    
