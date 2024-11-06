// Importing necessary modules
const express = require('express');
const app = express();

// Port for the server
const PORT = 3000;

// Food data functions with delays
const getFoodList = () => {
    return new Promise(resolve => {
        setTimeout(() => {
            resolve([
                { name: "Pav Bhaji", description: "Spicy mixed vegetable mash with bread", price: 150 },
                { name: "Paneer Rice", description: "Butter Paneer with rice", price: 200 }
            ]);
        }, 115);
    });
};

const getAvailableLocations = () => {
    return new Promise(resolve => {
        setTimeout(() => {
            resolve(["Panaji", "Margao", "Vasco", "Mapusa"]);
        }, 12000); // 2 minutes in milliseconds
    });
};

const getNutritionalInfo = () => {
    return new Promise(resolve => {
        setTimeout(() => {
            resolve([
                { name: "Pav Bhaji", calories: 400, protein: 10, carbs: 60, fat: 15 },
                { name: "Paneer Rice", calories: 450, protein: 20, carbs: 50, fat: 20 }
            ]);
        }, 300);
    });
};

const getStockOutFoods = () => {
    return new Promise(resolve => {
        setTimeout(() => {
            resolve(["Paneer Rice"]);
        }, 100);
    });
};

app.get('/api/food', async (req, res) => {
    try {
        // Execute all functions in parallel
        console.log("Started")
        const [foodList, locations, nutritionalInfo, stockOutFoods] = await Promise.all([
            getFoodList(),
            getAvailableLocations(),
            getNutritionalInfo(),
            getStockOutFoods()
        ]);
        console.log("resolved")

        // Merge the data into a single object
        const foodData = {
            foodList: foodList.map(food => ({
                ...food,
                nutritionalInfo: nutritionalInfo.find(info => info.name === food.name),
                inStock: !stockOutFoods.includes(food.name)
            })),
            availableLocations: locations
        };

        // Send the response
        res.json(foodData);
    } catch (error) {
        res.status(500).json({ message: "Error fetching food data", error: error.message });
    }
});

app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
