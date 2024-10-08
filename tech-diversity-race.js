function TechDiversityRace() {

    // Name for the visualisation to appear in the menu bar.
    this.name = 'Tech Diversity: Race';

    // Each visualisation must have a unique ID with no special
    // characters.
    this.id = 'tech-diversity-race';

    // Property to represent whether data has been loaded.
    this.loaded = false;

    // Preload the data. This function is called automatically by the
    // gallery when a visualisation is added.
    this.preload = function() {
        var self = this;
        this.data = loadTable(
        './data/tech-diversity/race-2018.csv', 'csv', 'header',
        // Callback function to set the value
        // this.loaded to true.
        function(table) {
            self.loaded = true;
        });
    };

    this.setup = function() {
        if (!this.loaded) {
            console.log('Data not yet loaded');
            return;
        }

        var self = this;

        // Create a select DOM element.
        this.select = createSelect();
        this.select.position(350, 40);

        // Fill the options with all company names.
        var companies = this.data.columns;
        // First entry is empty.
        for (let i = 1; i < companies.length; i++) {
            this.select.option(companies[i]);
        }

        // Handle company change and update the target angles
        this.select.changed(function() {
            var selectedCompany = self.select.value();
            var newCol = self.data.getColumn(selectedCompany);
            newCol = stringsToNumbers(newCol);
            
            // Update the target angles in pie chart
            self.pie.target_angles = self.pie.get_radians(newCol);
        });
    };

    // Destroy the DOM elements and clear event listeners
    this.destroy = function() {
        this.select.remove();
    };

    // Create a new pie chart object.
    this.pie = new PieChart(width / 2, height / 2, width * 0.4);

    this.draw = function() {
        if (!this.loaded) {
            console.log('Data not yet loaded');
            return;
        }

        // Get the value of the company we're interested in from the
        // select item.
        var companyName = this.select.value();

        // Get the column of raw data for companyName.
        var col = this.data.getColumn(companyName);

        // Convert all data strings to numbers.
        col = stringsToNumbers(col);

        // Copy the row labels from the table (the first item of each row).
        var labels = this.data.getColumn(0);

        // Colour to use for each category.
        var colours = ['blue', 'red', 'green', 'pink', 'purple', 'yellow'];

        // Make a title.
        var title = 'Employee diversity at ' + companyName;

        // Draw the pie chart!
        this.pie.draw(col, labels, colours, title);

        this.mouseMoved();
    };
    // Check if the mouse is over the canvas area where the pie chart is displayed
    this.mouseMoved = function (){
        if (mouseX > 0 && mouseX < width && mouseY > 0 && mouseY < height) {
            let mX = mouseX - this.pie.x;
            let mY = mouseY - this.pie.y;
            this.pie.handleMouseHover(mX, mY);
        }
    };
}
