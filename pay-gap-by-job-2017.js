function PayGapByJob2017() {

    // Name for the visualisation to appear in the menu bar.
    this.name = 'Pay gap by job: 2017';

    // Each visualisation must have a unique ID with no special
    // characters.
    this.id = 'pay-gap-by-job-2017';

    // Property to represent whether data has been loaded.
    this.loaded = false;

    // Graph properties.
    this.pad = 20;
    this.dotSizeMin = 15;
    this.dotSizeMax = 40;
    
    // Preload the data. This function is called automatically by the
    // gallery when a visualisation is added.
    this.preload = function() {
        var self = this;
        this.data = loadTable(
        './data/pay-gap/occupation-hourly-pay-by-gender-2017.csv', 'csv', 'header',
        // Callback function to set the value
        // this.loaded to true.
        function(table) {
            self.loaded = true;
        });

    };

    this.setup = function() {
    };

    this.destroy = function() {
    };

    this.draw = function() {
        if (!this.loaded) {
        console.log('Data not yet loaded');
        return;
        }

        // Draw the axes.
        this.addAxes();

        // Get data from the table object.
        // Data for the chart
        var propFemale = this.data.getColumn('proportion_female');
        var payGap = this.data.getColumn('pay_gap');
        var numJobs = this.data.getColumn('num_jobs');
        
        // Convert numerical data from strings to numbers.
        propFemale = stringsToNumbers(propFemale);
        payGap = stringsToNumbers(payGap);
        numJobs = stringsToNumbers(numJobs);

        // Set ranges for axes, use full 100% for x-axis (proportion of women in roles).
        var propFemaleMin = 0;
        var propFemaleMax = 100;

        // For y-axis (pay gap) use a symmetrical axis equal to the largest gap direction so that equal pay (0% pay gap) is in the centre of the canvas. Above the line means men are paid more. Below the line means women are paid more.
        var payGapMin = -20;
        var payGapMax = 20;

        // Find smallest and largest numbers of people across all categories to scale the size of the dots.
        var numJobsMin = min(numJobs);
        var numJobsMax = max(numJobs);

        stroke(0);
        strokeWeight(1);

        for (i = 0; i < this.data.getRowCount(); i++) {
            //Temperature based on numJobs, to change in the future
            fill(map(numJobs[i], numJobsMin, numJobsMax, 0, 255));
            ellipse(
                map(propFemale[i], propFemaleMin, propFemaleMax,
                    this.pad, width - this.pad),
                map(payGap[i], payGapMin, payGapMax,
                    height - this.pad, this.pad),
                map(numJobs[i], numJobsMin, numJobsMax,
                    this.dotSizeMin, this.dotSizeMax)
            );
        }
    };

    this.addAxes = function () {
        stroke(200);

        // Add vertical line.
        line(width / 2,
            0 + this.pad,
            width / 2,
            height - this.pad);

        // Add horizontal line.
        line(0 + this.pad,
            height / 2,
            width - this.pad,
            height / 2);
        
        // Add labels for axes
        textAlign(CENTER, TOP);
        textSize(14);
        fill(0);
        text('proportion of Women in Roles (%)', width/2, height - this.pad + 5);
        
        textAlign(CENTER, LEFT);
        text('Pay Gap', this.pad + 20, height/2);
    };
}
