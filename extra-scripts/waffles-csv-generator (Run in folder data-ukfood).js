function setup() {
    // variables based on waffles
    var days = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];
    var meals = ['Take-away', 'Cooked from fresh', 'Ready meal', 'Ate out', 'Skipped meal', 'Left overs'];

    // Create a new table
    var table = new p5.Table();

    // Add columns
    for(var i = 0; i < days.length; i++){
        table.addColumn(days[i]);
    }

    // Add 400 rows and populate with random data
    for(var r = 0; r < 400; r++){  
        var newRow = table.addRow();
        for(var d = 0; d < days.length; d++){
            var meal;
            // skew the meal selection toward "Take-away" and "Ate out" on weekdends
            if (days[d] == 'Saturday' || days[d] == 'Sunday') {
                var rand = random();
                if (rand < 0.3) {
                    meal = 'Take-away';
                } 
                else if (rand < 0.6) {
                    meal = 'Ate out';
                } 
                else {
                    meal = random(meals);
                }
            } 
            else {
                meal = random(meals);
            }     
            newRow.setString(days[d], meal);
        }   
    }   

  // Save table as a CSV
  saveTable(table, 'meals.csv');
}
