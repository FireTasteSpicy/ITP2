function Waffles(){
    
    //properties
    this.name = 'How Do People Prepare Meals';
    this.id = 'how-do-people-prepare-meals';
    this.title = 'How Do People Prepare Meals, Generated Survey';
    this.loaded = false;    
    var data;
    var waffles = [];
    
    //preload data
    this.preload = function(){
        var self = this;
        data = loadTable("./data/uk-food/meals.csv", "csv", "header",
        function(table) {
            self.loaded = true;
        });
    }
    
    //Setup waffles
    this.setup = function() {
        var days = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"]
        var values = ['Take-away', 'Cooked from fresh', 'Ready meal', 'Ate out', 'Skipped meal', 'Left overs']  
        
        //box colours
        var colours = [];
        //random colours generator
        for (let i = 0; i < values.length; i++) {
            //i is included to ensure no 2 colours are the same
            let r = random(0 + i * 20, 255);  // Red
            let g = random(0 + i * 20, 255);  // Green
            let b = random(0 + i * 20, 255);  // Blue
            colours.push(color(r, g, b));
        }
        
        for(var i = 0; i < days.length; i++){
            //first four days
            if(i < 4){
                waffles.push(new this.Waffle(50 + (i * 220), 90, 200, 200, 10, 10, data, days[i], values, colours));
            }
            //other days
            else{
                waffles.push(new this.Waffle(150 + ((i - 4) * 220), 340, 200, 200, 10, 10, data, days[i], values, colours));
            }
        };
    };
    
    //call to destroy the chart
    this.destroy = function(){
        waffles.length = 0;
    }
    
    //draws waffles
    this.draw = function(){
        //draw title
        fill(0);
        noStroke();
        textAlign('center', 'center');
        textSize(20);
        text(this.title, (50 + (4 * 220) / 2), 40);
        
        
        for (var i = 0; i < waffles.length; i++){
            waffles[i].draw();
        }
        for (var i = 0; i < waffles.length; i++){ 
            waffles[i].checkMouse(mouseX, mouseY);
        }
    };
    
    //single Waffle
    this.Waffle = function(x, y, width, height, boxes_across, boxes_down, table, columnHeading, possibleValues, colours){
        //variables
        var x = x;
        var y = y;
        var height = height;
        var width = width;
        var boxes_down = boxes_down;
        var boxes_across = boxes_across;
        var column = table.getColumn(columnHeading);
        var possibleValues = possibleValues;
        var colours = colours;

        //arrays
        var categories = [];
        var boxes =[];
        var label = columnHeading;
        
        //find the index of a category in the categories array function
        function categoryLocation(categoryName) {
            //check if categoryName matches input categories
            for (var i = 0; i < categories.length; i++){
                if(categoryName == categories[i].name){
                    return i;
                }            
            } 
            //-1 in case of invalid category names
            return -1;
        }

        //add categories from possibleValues to the categories array 
        function addCategories(){
            //loop through all possibe values to add categories
            for(var i = 0; i< possibleValues.length; i++){
                categories.push({
                    "name" : possibleValues[i],
                    "count" : 0,
                    "colour" : colours[i % colours.length]                        
                })
            }
            
            //loop through all columns to increment count
            for (var i = 0; i< column.length; i++){
                var catLocation = categoryLocation(column[i])
                if(catLocation != -1){
                    categories[catLocation].count++
                }
            }

            //iterate over the categories and add proportions
            for(var i = 0; i < categories.length; i++){
                categories[i].boxes = round((categories[i].count/column.length) * (boxes_down * boxes_across));
            }

            console.log(categories);
        }

        //add boxes function
        function addBoxes(){
            this.currentCategory = 0;
            var currentCategoryBox = 0;

            var boxWidth = width/boxes_across;
            var boxHeight = height/boxes_down;

            
            for(var i = 0; i < boxes_down; i++){
                boxes.push([])
                for(var j = 0; j < boxes_across; j++){
                    if (currentCategoryBox == categories[currentCategory].boxes){
                        currentCategoryBox = 0;
                        currentCategory++;
                    }

                    boxes[i].push(new Box(x + (j * boxWidth), y + (i * boxHeight), boxWidth, boxHeight, categories[currentCategory]));
                    currentCategoryBox++;
                }
            }
        }

        //add categories and boxes
        addCategories();
        addBoxes();
        
        //draw chart function
        this.draw = function(){
            stroke(1);
            //chart
            for(var i = 0; i < boxes.length; i++){
                for(var j = 0; j < boxes[i].length; j++){
                    if(boxes[i][j].category != undefined){
                        boxes[i][j].draw();
                    }
                }    
            }
            //day labels
            push();
            textAlign(CENTER, TOP);
            textSize(16);
            fill(0);
            text(label, x + width/2, y + height + 20);
            pop();
        }

        //text appear when hovering over chart
        this.checkMouse = function(mouseX, mouseY){
            for(var i = 0; i < boxes.length; i++){
                for(var j = 0; j < boxes[i].length; j++){
                    if(boxes[i][j].category != undefined){
                        var mouseOver = boxes[i][j].mouseOver(mouseX, mouseY);
                        if(mouseOver != false){
                            push();
                            fill(0);
                            textSize(20);
                            var tWidth = textWidth(mouseOver);
                            textAlign(LEFT, TOP);
                            rect(mouseX, mouseY, tWidth + 20, 40);
                            fill(255);
                            text(mouseOver, mouseX + 10, mouseY + 10);
                            pop();
                            break;
                        }
                    }
                }
            }
        }
    }
}
