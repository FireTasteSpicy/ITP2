function foodDataUK(){
    //Object Properties
    this.name = 'Food Data in UK';
    this.id = 'food-data-in-uk';
    this.title = 'Food Data in UK';
    this.loaded = false;
    
    //Variables
    var data;
    var bubbles = [];
    var maxAmt = 0;
    var years = [];
    var yearSlider;
    var minYear;
    var maxYear;
    
    //preload the csv file
    this.preload = function(){
        var self = this;
        data = loadTable("./data/uk-food/foodData.csv", "csv", "header",
        function(table) {
            self.loaded = true;
        });
    };
    
    //initialise data and create bubbles and year slider
    this.setup = function(){
        var self = this;
        var rows = data.getRows();
        var numColumns = data.getColumnCount();
        
        // Assuming the 5th column contains the first year and last column contains the last year
        minYear = Number(data.columns[5]);  
        maxYear = Number(data.columns[numColumns - 1]);

        // Fill the years array with all years in the data
        for(var i = 5; i < numColumns; i++) {
            var y = Number(data.columns[i]);
            years.push(y);
        }

        // Create the year slider
        yearSlider = createSlider(minYear, maxYear, minYear);
        yearSlider.position(400, 10);
        yearSlider.style('width', '800px');
        yearSlider.parent('years'); //html
        yearSlider.input(function() {
            self.changeYear(this.value());
        });

        //to create bubbles from data
        for(var i = 0; i < rows.length; i++){
            if(rows[i].get(0) != ""){
                var units = rows[i].get(4); // Assuming the 5th column contains the units
                var b = new this.Bubble(rows[i].get(0), units);            
                //add data to the bubble for each year
                for(var j = 5; j < numColumns; j++){
                    if(rows[i].get(j) != ""){
                        var n = rows[i].getNum(j);
                        // to find highest value
                        if(n > maxAmt){
                            maxAmt = n; 
                        }
                        b.data.push(n);
                    }else{
                        b.data.push(0);
                    }
                }
                //add bubble to bubbles array
                bubbles.push(b);
            }
        }
        //initialise each bubble data to first year (for comparison)
        for(var i = 0; i < bubbles.length; i++){
            bubbles[i].setData(0);
        }
    };
    
    //destroy when changing visualisations
    this.destroy = function(){
        bubbles.length = 0;  //empty bubbles array
        yearSlider.remove(); //remove year slider
    };
    
    this.draw = function(){
        background(100);
        //centre the coordinates
        translate(width/2, height/2);
        //update and draw each bubble
        textSize(14);
        for(var i = 0; i < bubbles.length; i++)
        {
            bubbles[i].update(bubbles);
            bubbles[i].draw();
        }

        // Reset coordinates
        resetMatrix();

        // Display title and year
        fill(255);
        textSize(18);
        text(this.title,100,40);
        text('Year: ' + yearSlider.value(), 100, 60);
    }
    

    
    this.Bubble = function (_name, _units){
        //bubble properties
        this.size = 20;
        this.target_size = 20;
        this.pos = createVector(0,0);
        this.direction = createVector(0,0);
        this.name = _name;
        this.units = _units;
        this.color = color(random(40,255), random(40,255), random(40,255));
        this.data = [];
        this.currentData = 0;

        //draw each individual bubble
        this.draw = function()
        {
            push();
            textAlign(CENTER, CENTER);
            noStroke();
            fill(this.color);
            ellipse(this.pos.x, this.pos.y, this.size);
            fill(0);
            // Create a text bounding box based on the bubble size
            var textBoxSize = this.size * 0.8;  // Use 80% of the bubble size for text
            var lineHeight = 14; // Define line height for text wrap
            var lines = this.calcLines(this.name, textBoxSize);
            var textHeight = lines * lineHeight;
            this.wrapText(this.name, this.pos.x, this.pos.y - textHeight / 2, textBoxSize, lineHeight);
            // Display data when mouse is over the bubble
            if(this.mouseOver()) {
                textSize(16);
                fill(0);
                rect(this.pos.x - 25, this.pos.y + this.size/2 - 20, 50, 20);
                fill(255);
                text(this.data[this.currentData] + ' ' + this.units, this.pos.x, this.pos.y + this.size/2 - 10);
            }
            pop();
        }
        
        //update the bubble position based on other bubbles
        this.update = function(_bubbles){
            this.direction.set(0,0);

            for(var i = 0; i < _bubbles.length; i++){
                if(_bubbles[i].name != this.name){
                    var v = p5.Vector.sub(this.pos,_bubbles[i].pos); 
                    var d = v.mag();

                    if(d < this.size/2 + _bubbles[i].size/2){
                        if(d > 0){
                            this.direction.add(v)
                        }else{
                            this.direction.add(p5.Vector.random2D());    

                        }
                    }
                }
            }

            this.direction.normalize();
            this.direction.mult(2);
            this.pos.add(this.direction);

            if(this.size < this.target_size){
                this.size += 1;
            } else if(this.size > this.target_size){
                this.size -= 1;
            }

        }

        //set bubble data and adjust size
        this.setData = function(i){  
            this.currentData = i;
            this.target_size = map(this.data[i], 0, maxAmt, 40, 200);
        }

        //check if mouse is over bubble
        this.mouseOver = function(){
            return dist(mouseX - width/2, mouseY - height/2, this.pos.x, this.pos.y) < this.size/2;
        }
        
        //calculate the number of lines need to wrap text
        this.calcLines = function (text, maxWidth){
            let words = text.split(' ');
            let line = '';
            let lines = 1;

            for(let n = 0; n < words.length; n++) {
                let testLine = line + words[n] + ' ';
                let testWidth = textWidth(testLine);

                if(testWidth > maxWidth && n > 0) {
                    line = words[n] + ' ';
                    lines++;
                } else {
                    line = testLine;
                }
            }
            return lines;
        }
        
        //wrap text within the bubble
        this.wrapText = function(labels, x, y, maxWidth, lineHeight) {
            let words = labels.split(' ');
            let line = '';
            let yoffset = y;
            // If the line is too long, create a new line
            for(let n = 0; n < words.length; n++) {
                let testLine = line + words[n] + ' ';
                let testWidth = textWidth(testLine);
                if(testWidth > maxWidth && n > 0) {
                    text(line, x, yoffset);
                    line = words[n] + ' ';
                    yoffset += lineHeight;
                } else {
                    line = testLine;
                }
            }
            text(line, x, yoffset);
        }
    }
    
    //method to change displayed year (for slider)
    this.changeYear = function(year){
        var y = years.indexOf(year);
        //set to selected year
        for(var i = 0; i < bubbles.length; i++){
            bubbles[i].setData(y);
        }
    }
}