function TechDiversityGender() {

    // Name for the visualisation to appear in the menu bar.
    this.name = 'Tech Diversity: Gender';

    // Each visualisation must have a unique ID with no special
    // characters.
    this.id = 'tech-diversity-gender';


    // Layout object to store all common plot layout parameters and
    // methods.
    this.layout = {
        // Locations of margin positions. Left and bottom have double margin
        // size due to axis and tick labels.
        leftMargin: 130,
        rightMargin: width,
        topMargin: 30,
        bottomMargin: height,
        pad: 5,

        plotWidth: function() {
        return this.rightMargin - this.leftMargin;
        },

        // Boolean to enable/disable background grid.
        grid: true,

        // Number of axis tick labels to draw so that they are not drawn on
        // top of one another.
        numXTickLabels: 10,
        numYTickLabels: 8,
    };

    // Middle of the plot: for 50% line.
    this.midX = (this.layout.plotWidth() / 2) + this.layout.leftMargin;

    // Default visualisation colours.
    this.femaleColour = color(255, 0 ,0);
    this.maleColour = color(0, 255, 0);

    // Property to represent whether data has been loaded.
    this.loaded = false;

    // Preload the data. This function is called automatically by the
    // gallery when a visualisation is added.
    this.preload = function() {
        var self = this;
        this.data = loadTable(
        './data/tech-diversity/gender-2018.csv', 'csv', 'header',
        // Callback function to set the value
        // this.loaded to true.
        function(table) {
            self.loaded = true;
        });

    };

    this.setup = function() {
        // Font defaults.
        textSize(16);
        // Reset animation progress
        this.animationProgress = 0;

    };

    this.destroy = function() {
    };

    this.draw = function() {

        //Ensures that the animation progress is capped at 100
        if (this.animationProgress < 100){
            this.animationProgress += 1;
        }
        
        // Check if the data has been loaded before drawing.
        if (!this.loaded) {
            console.log('Data not yet loaded');
            return;
        }

        // Draw Female/Male labels at the top of the plot.
        this.drawCategoryLabels();

        var lineHeight = (height - this.layout.topMargin) /this.data.getRowCount();

        for (var i = 0; i < this.data.getRowCount(); i++) {

        // Calculate the y position for each company.
        var lineY = (lineHeight * i) + this.layout.topMargin;

        // Create an object that stores data from the current row.
        var company = {
            // Convert strings to numbers.
            'name': this.data.getString(i, 'company'),
            'female': this.data.getNum(i, 'female'),
            'male': this.data.getNum(i, 'male'),
        };

        // Draw the company name in the left margin.
        fill(0);
        noStroke();
        textAlign('right', 'top');
        text(company.name,
            this.layout.leftMargin - this.layout.pad,
            lineY);

        // Calculate the y position for each company.
        var lineY = (lineHeight * i) + this.layout.topMargin;

        // For female employees
        let barLengthFemale = this.mapPercentToWidth(company.female);
        let animatedBarLengthFemale = map(this.animationProgress, 0, 100, 0, barLengthFemale);
        fill(this.femaleColour);
        rect(this.layout.leftMargin, lineY, animatedBarLengthFemale, lineHeight - this.layout.pad);

        // For male employees
        let barLengthMale = this.mapPercentToWidth(company.male);
        let animatedBarLengthMale = map(this.animationProgress, 0, 100, 0, barLengthMale);
        fill(this.maleColour);
        rect(this.layout.leftMargin + animatedBarLengthFemale, lineY, animatedBarLengthMale, lineHeight - this.layout.pad);

        this.mouseOver(animatedBarLengthFemale, animatedBarLengthMale, lineY, lineHeight, company);
    }

        // Draw 50% line
        stroke(150);
        strokeWeight(1);
        line(this.midX,
            this.layout.topMargin,
            this.midX,
            this.layout.bottomMargin);

        console.log(this.animationProgress);
    };

    // Draw the category labels above the plot.
    this.drawCategoryLabels = function() {
        fill(0);
        noStroke();
        textAlign('left', 'top');
        text('Female',
            this.layout.leftMargin,
            this.layout.pad);
        textAlign('center', 'top');
        text('50%',
            this.midX,
            this.layout.pad);
        textAlign('right', 'top');
        text('Male',
            this.layout.rightMargin,
            this.layout.pad);
    };

    // Helper Function
    this.mapPercentToWidth = function(percent) {
        return map(percent,
                0,
                100,
                0,
                this.layout.plotWidth());
    };

    this.mouseOver = function(animatedBarLengthFemale, animatedBarLengthMale, lineY, lineHeight, company) {
        // Check if mouse is over the female bar and display percentage
        if (mouseX >= this.layout.leftMargin && mouseX <= (this.layout.leftMargin + animatedBarLengthFemale) &&
            mouseY >= lineY && mouseY <= (lineY + lineHeight - this.layout.pad)) {
            fill(255);
            rectMode(CENTER);
            rect(mouseX, mouseY - 10, 40, 20);
            fill(0);
            textAlign(CENTER, CENTER);
            text(company.female + '%', mouseX, mouseY - 10);
            rectMode(CORNER);
        }

        // Check if mouse is over the male bar and display percentage
        if (mouseX >= (this.layout.leftMargin + animatedBarLengthFemale) && mouseX <= (this.layout.leftMargin + animatedBarLengthFemale + animatedBarLengthMale) &&
            mouseY >= lineY && mouseY <= (lineY + lineHeight - this.layout.pad)) {
            fill(255);
            rectMode(CENTER);
            rect(mouseX, mouseY - 10, 40, 20);
            fill(0);
            textAlign(CENTER, CENTER);
            text(company.female + '%', mouseX, mouseY - 10);
            rectMode(CORNER);
        }
    }
}
