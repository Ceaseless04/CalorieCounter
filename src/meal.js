// Browser version - uses localStorage since browsers can't write to files directly
var addMeal = function(meal) {
    console.log("Meal added:", meal);
    
    // Read the current data from data.json
    fetch('../data.json')
        .then(response => response.json())
        .then(data => {
            // Add the new meal to the meals array
            data.meals.push(meal);
            
            // In a browser environment, we can't directly write to files
            // This would typically be handled by a server endpoint
            console.log("Updated meals data:", data);
            
            // For demonstration, we'll store in localStorage as an alternative
            localStorage.setItem('mealsData', JSON.stringify(data));
            console.log("Meal saved to localStorage");
        })
        .catch(error => {
            console.error('Error reading data.json:', error);
        });
}

// Node.js version - can actually write to the file system
var addMealToFile = function(meal) {
    if (typeof require !== 'undefined') {
        const fs = require('fs');
        const path = require('path');
        
        console.log("Meal added:", meal);
        
        try {
            // Read the current data from data.json
            const dataPath = path.join(__dirname, '../data.json');
            const rawData = fs.readFileSync(dataPath, 'utf8');
            const data = JSON.parse(rawData);
            
            // Add the new meal to the meals array
            data.meals.push(meal);
            
            // Write the updated data back to the file
            fs.writeFileSync(dataPath, JSON.stringify(data, null, 2), 'utf8');
            console.log("Meal successfully added to data.json");
            
            return data;
        } catch (error) {
            console.error('Error updating data.json:', error);
            throw error;
        }
    } else {
        console.error('Node.js environment required for file operations');
    }
}

// Helper function to create a meal object with current timestamp
var createMeal = function(name, calories, carbs, fat, protein, customDate) {
    const date = customDate || new Date().toISOString().slice(0, 16).replace('T', ' ');
    
    return {
        name: name,
        calories: calories,
        carbs: carbs,
        fat: fat,
        protein: protein,
        date: date
    };
}

// Export functions for use in other files
if (typeof module !== 'undefined' && module.exports) {
    // Node.js environment
    module.exports = {
        addMeal: addMealToFile,
        createMeal: createMeal
    };
} else {
    // Browser environment - attach to window object
    window.addMeal = addMeal;
    window.addMealToFile = addMealToFile;
    window.createMeal = createMeal;
}