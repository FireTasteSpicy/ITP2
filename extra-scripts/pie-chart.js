function PieChart(x, y, diameter) {

    this.x = x;
    this.y = y;
    this.diameter = diameter;
    this.hoveredSlice = -1; // -1 means no slice is hovered. 
    this.labelSpace = 30;
    this.current_angles = [];
    this.target_angles = [];
    this.get_radians = function(data) {
        var total = sum(data);
        var radians = [];

        for (let i = 0; i < data.length; i++) {
        radians.push((data[i] / total) * TWO_PI);
        }

        return radians;
    };

    this.draw = function(data, labels, colours, title, total) {

        // Test that data is not empty and that each input array is the
        // same length.
        if (data.length == 0) {
        alert('Data has length zero!');
        } else if (![labels, colours].every((array) => {
        return array.length == data.length;
        })) {
        alert(`Data (length: ${data.length})
            Labels (length: ${labels.length})
            Colours (length: ${colours.length})
            Arrays must be the same length!`);
        }

        if (this.current_angles.length == 0) {
            this.current_angles = this.get_radians(data);
            this.target_angles = this.current_angles; 
        }
    
        // Animate the pie slices using lerp()
        for (let i = 0; i < this.current_angles.length; i++) {
            this.current_angles[i] = lerp(this.current_angles[i], this.target_angles[i], 0.1);
        }

        var angles = this.current_angles;
        var lastAngle = 0;
        var colour;

        
        for (var i = 0; i < data.length; i++) {
            if (colours) {
                colour = colours[i];
            } else {
                colour = map(i, 0, data.length, 0, 255);
            }

            fill(colour);
            stroke(0);
            strokeWeight(1);

            //pop up if hovered
            if (this.hoveredSlice == i) {
                arc(this.x, this.y,
                    this.diameter * 1.1, this.diameter * 1.1,
                    lastAngle, lastAngle + angles[i] + 0.001);
            } else { //otherwise draw normally
                arc(this.x, this.y,
                    this.diameter, this.diameter,
                    lastAngle, lastAngle + angles[i] + 0.001);
            }
            if (labels) {
                // Calculate the total value of data
                var totalValue = data.reduce((acc, value) => acc + value, 0);

                // Calculate percentage and display it in the legend
                var percentage = ((data[i] / totalValue) * 100).toFixed(2);
                this.makeLegendItem(labels[i] + ' (' + percentage + '%)', i, colour);
            }



            
            lastAngle += angles[i];
            }

            if (title) {
                noStroke();
                textAlign('center', 'center');
                textSize(24);
                text(title, this.x, this.y - this.diameter * 0.6);
            }
        };

    this.makeLegendItem = function(label, i, colour) {
        var x = this.x + 50 + this.diameter / 2;
        var y = this.y + (this.labelSpace * i) - this.diameter / 3;
        var boxWidth = this.labelSpace / 2;
        var boxHeight = this.labelSpace / 2;

        // Adjust the position of the text
        var textX = x + boxWidth + 20;
        var textY = y + boxHeight / 2 + 3;
        
        fill(colour);
        rect(x, y, boxWidth, boxHeight);

        fill('black');
        noStroke();
        textAlign('left', 'center');
        if(this.hoveredSlice == i){
            textSize(30);

        } else {
            textSize(16);
        }
        text(label, x + boxWidth + 10, y + boxWidth / 2);
    };

    //determine which slice is hovered
    this.handleMouseHover = function(mX, mY) {
        let distanceFromCenter = dist(mX, mY, 0, 0);
        if (distanceFromCenter <= this.diameter / 2) {
            let angle = atan2(mY, mX);
            if (angle < 0) {
                angle += TWO_PI;
            }
            let totalAngle = 0;
            for (let i = 0; i < this.current_angles.length; i++) {
                totalAngle += this.current_angles[i];
                if (angle <= totalAngle) {
                    this.hoveredSlice = i;
                    return;
                }
            }
        }
        //reset the hovered slice if the mouse is not over the pie chart
        this.hoveredSlice = -1;
    };
}
