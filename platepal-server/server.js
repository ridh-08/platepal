const express = require("express");
const cors = require("cors");

const app = express();
app.use(cors());
app.use(express.json());

// Sample recipes database
   const recipes = [
        {
            id: 1,
            name: "Avocado Toast",
            category: "Breakfast",
            cuisine: "American",
            ingredients: [
                { name: "Avocado", quantity: "1", unit: "whole" },
                { name: "Bread", quantity: "2", unit: "slices" },
                { name: "Salt", quantity: "1", unit: "pinch" }
            ],
            steps: [
                "Toast the bread.",
                "Mash the avocado and spread it on toast.",
                "Sprinkle salt and serve."
            ],
            image: "C:/Users/Riddhi/Desktop/Course material- 3rd year/Winter Semester/CSE519/Assignments+Project/Project/platepal/platepal-server/avocado-toast.jpg",
            dietary: ["Vegan", "Vegetarian"]
        },
        {
            id: 2,
            name: "Spaghetti Carbonara",
            category: "Lunch",
            cuisine: "Italian",
            ingredients: [
                { name: "Spaghetti", quantity: "200", unit: "g" },
                { name: "Egg", quantity: "2", unit: "large" },
                { name: "Bacon", quantity: "100", unit: "g" },
                { name: "Parmesan Cheese", quantity: "50", unit: "g" },
                { name: "Black Pepper", quantity: "1", unit: "tsp" }
            ],
            steps: [
                "Boil spaghetti until al dente.",
                "Fry the bacon until crispy.",
                "Mix eggs and cheese, then combine with spaghetti and bacon.",
                "Add black pepper and serve."
            ],
            image: "https://example.com/carbonara.jpg",
            dietary: ["Non-Vegetarian"]
        },
        // Add more recipes here...
        {
            id: 3,
            name: "Chana Masala",
            category: "Dinner",
            cuisine: "Indian",
            ingredients: [
                { name: "Chickpeas", quantity: "200", unit: "g" },
                { name: "Tomatoes", quantity: "2", unit: "medium" },
                { name: "Onion", quantity: "1", unit: "medium" },
                { name: "Garlic", quantity: "2", unit: "cloves" },
                { name: "Garam Masala", quantity: "1", unit: "tsp" }
            ],
            steps: [
                "Sauté onions and garlic.",
                "Add tomatoes and cook until soft.",
                "Add chickpeas and spices, then simmer.",
                "Serve with rice or bread."
            ],
            image: "https://example.com/chana-masala.jpg",
            dietary: ["Vegan", "Vegetarian", "Gluten-Free"]
        },
        {
            id: 4,
            name: "Sushi Rolls",
            category: "Dinner",
            cuisine: "Japanese",
            ingredients: [
                { name: "Sushi Rice", quantity: "200", unit: "g" },
                { name: "Nori Sheets", quantity: "2", unit: "sheets" },
                { name: "Cucumber", quantity: "1", unit: "small" },
                { name: "Carrot", quantity: "1", unit: "small" },
                { name: "Avocado", quantity: "1/2", unit: "whole" }
            ],
            steps: [
                "Prepare sushi rice.",
                "Place nori on a rolling mat and spread rice evenly.",
                "Add sliced vegetables and roll tightly.",
                "Cut into pieces and serve."
            ],
            image: "https://example.com/sushi-rolls.jpg",
            dietary: ["Vegan", "Vegetarian"]
        },
        {
            id: 5,
            name: "Chicken Stir Fry",
            category: "Lunch",
            cuisine: "Chinese",
            ingredients: [
                { name: "Chicken Breast", quantity: "200", unit: "g" },
                { name: "Bell Peppers", quantity: "1", unit: "medium" },
                { name: "Soy Sauce", quantity: "2", unit: "tbsp" },
                { name: "Garlic", quantity: "2", unit: "cloves" },
                { name: "Ginger", quantity: "1", unit: "tsp" }
            ],
            steps: [
                "Sauté garlic and ginger.",
                "Add chicken and cook until browned.",
                "Add vegetables and stir-fry with soy sauce.",
                "Serve hot with rice or noodles."
            ],
            image: "https://example.com/chicken-stir-fry.jpg",
            dietary: ["Non-Vegetarian", "Dairy-Free"]
        },
        {
            id: 6,
            name: "Quinoa Salad",
            category: "Dinner",
            cuisine: "Mediterranean",
            ingredients: [
                { name: "Quinoa", quantity: "1", unit: "cup" },
                { name: "Cucumber", quantity: "1/2", unit: "medium" },
                { name: "Tomato", quantity: "1", unit: "medium" },
                { name: "Olive Oil", quantity: "2", unit: "tbsp" },
                { name: "Lemon Juice", quantity: "1", unit: "tbsp" }
            ],
            steps: [
                "Cook quinoa and let it cool.",
                "Chop vegetables and mix with quinoa.",
                "Drizzle with olive oil and lemon juice.",
                "Toss and serve."
            ],
            image: "https://example.com/quinoa-salad.jpg",
            dietary: ["Vegan", "Gluten-Free"]
        },
        // Add more recipes to reach 100+
        {
            id: 7,
            name: "Tacos al Pastor",
            category: "Dinner",
            cuisine: "Mexican",
            ingredients: [
                { name: "Pork", quantity: "200", unit: "g" },
                { name: "Pineapple", quantity: "1/2", unit: "cup" },
                { name: "Tortillas", quantity: "2", unit: "pieces" },
                { name: "Cilantro", quantity: "1", unit: "tbsp" },
                { name: "Onion", quantity: "1/2", unit: "small" }
            ],
            steps: [
                "Marinate pork with spices and grill.",
                "Chop pineapple and mix with pork.",
                "Fill tortillas with pork mixture.",
                "Top with onion and cilantro, then serve."
            ],
            image: "https://example.com/tacos.jpg",
            dietary: ["Non-Vegetarian", "Dairy-Free"]
        },
        {
            id: 8,
            name: "Greek Yogurt Parfait",
            category: "Breakfast",
            cuisine: "Greek",
            ingredients: [
                { name: "Greek Yogurt", quantity: "1", unit: "cup" },
                { name: "Honey", quantity: "1", unit: "tbsp" },
                { name: "Granola", quantity: "1/4", unit: "cup" },
                { name: "Berries", quantity: "1/2", unit: "cup" }
            ],
            steps: [
                "Layer yogurt, granola, and berries in a glass.",
                "Drizzle with honey.",
                "Repeat layers and serve."
            ],
            image: "https://example.com/yogurt-parfait.jpg",
            dietary: ["Vegetarian", "Gluten-Free"]
        },
        {
            id: 9,
            name: "Falafel Wrap",
            category: "Lunch",
            cuisine: "Middle Eastern",
            ingredients: [
                { name: "Falafel", quantity: "4", unit: "pieces" },
                { name: "Pita Bread", quantity: "1", unit: "piece" },
                { name: "Tahini Sauce", quantity: "2", unit: "tbsp" },
                { name: "Lettuce", quantity: "1/2", unit: "cup" },
                { name: "Tomato", quantity: "1", unit: "medium" }
            ],
            steps: [
                "Warm the pita bread.",
                "Place falafel inside and add lettuce and tomato.",
                "Drizzle with tahini sauce.",
                "Wrap and serve."
            ],
            image: "https://example.com/falafel-wrap.jpg",
            dietary: ["Vegan", "Vegetarian"]
        },
        {
            id: 10,
            name: "Miso Soup",
            category: "Appetizer",
            cuisine: "Japanese",
            ingredients: [
                { name: "Miso Paste", quantity: "1", unit: "tbsp" },
                { name: "Tofu", quantity: "100", unit: "g" },
                { name: "Seaweed", quantity: "1", unit: "tbsp" },
                { name: "Green Onions", quantity: "1", unit: "stalk" },
                { name: "Water", quantity: "2", unit: "cups" }
            ],
            steps: [
                "Boil water and dissolve miso paste.",
                "Add tofu and seaweed.",
                "Garnish with green onions and serve."
            ],
            image: "https://example.com/miso-soup.jpg",
            dietary: ["Vegan", "Vegetarian", "Gluten-Free"]
        },
        // Continue adding more recipes until you reach 100+
        {
            id: 11,
            name: "Pav Bhaji",
            category: "Snack",
            cuisine: "Indian",
            ingredients: [
                { name: "Potatoes", quantity: "2", unit: "medium" },
                { name: "Tomatoes", quantity: "2", unit: "medium" },
                { name: "Peas", quantity: "1/2", unit: "cup" },
                { name: "Butter", quantity: "2", unit: "tbsp" },
                { name: "Pav Bread", quantity: "2", unit: "pieces" }
            ],
            steps: [
                "Boil and mash vegetables.",
                "Cook with butter and spices.",
                "Serve with toasted pav bread."
            ],
            image: "https://example.com/pav-bhaji.jpg",
            dietary: ["Vegetarian"]
        },
        {
            id: 12,
            name: "Pad Thai",
            category: "Dinner",
            cuisine: "Thai",
            ingredients: [
                { name: "Rice Noodles", quantity: "200", unit: "g" },
                { name: "Egg", quantity: "1", unit: "large" },
                { name: "Tofu", quantity: "100", unit: "g" },
                { name: "Peanuts", quantity: "2", unit: "tbsp" },
                { name: "Soy Sauce", quantity: "1", unit: "tbsp" }
            ],
            steps: [
                "Cook noodles and drain.",
                "Stir-fry tofu and egg.",
                "Mix noodles with sauce and peanuts.",
                "Serve hot."
            ],
            image: "https://example.com/pad-thai.jpg",
            dietary: ["Vegetarian"]
        },
        {
            id: 13,
            name: "Borscht",
            category: "Soup",
            cuisine: "Russian",
            ingredients: [
                { name: "Beetroot", quantity: "2", unit: "medium" },
                { name: "Cabbage", quantity: "1", unit: "cup" },
                { name: "Carrot", quantity: "1", unit: "medium" },
                { name: "Garlic", quantity: "2", unit: "cloves" },
                { name: "Vegetable Broth", quantity: "3", unit: "cups" }
            ],
            steps: [
                "Boil vegetables in broth.",
                "Blend or leave chunky.",
                "Serve warm with sour cream."
            ],
            image: "https://example.com/borscht.jpg",
            dietary: ["Vegan", "Vegetarian"]
        },
        {
            id: 14,
            name: "Shakshuka",
            category: "Breakfast",
            cuisine: "North African",
            ingredients: [
                { name: "Eggs", quantity: "2", unit: "large" },
                { name: "Tomatoes", quantity: "2", unit: "medium" },
                { name: "Onion", quantity: "1", unit: "medium" },
                { name: "Garlic", quantity: "2", unit: "cloves" },
                { name: "Cumin", quantity: "1", unit: "tsp" }
            ],
            steps: [
                "Sauté onion and garlic.",
                "Add tomatoes and spices.",
                "Crack eggs over the sauce and cook.",
                "Serve hot with bread."
            ],
            image: "https://example.com/shakshuka.jpg",
            dietary: ["Vegetarian"]
        },
        {
            id: 15,
            name: "Kimchi Fried Rice",
            category: "Lunch",
            cuisine: "Korean",
            ingredients: [
                { name: "Rice", quantity: "1", unit: "cup" },
                { name: "Kimchi", quantity: "1/2", unit: "cup" },
                { name: "Egg", quantity: "1", unit: "large" },
                { name: "Soy Sauce", quantity: "1", unit: "tbsp" },
                { name: "Sesame Oil", quantity: "1", unit: "tsp" }
            ],
            steps: [
                "Stir-fry kimchi with rice.",
                "Add soy sauce and sesame oil.",
                "Top with a fried egg and serve."
            ],
            image: "https://example.com/kimchi-fried-rice.jpg",
            dietary: ["Vegetarian", "Dairy-Free"]
        },
        // Continue adding more recipes until you reach 100+
        {
            id: 16,
            name: "French Onion Soup",
            category: "Appetizer",
            cuisine: "French",
            ingredients: [
                { name: "Onions", quantity: "2", unit: "large" },
                { name: "Beef Broth", quantity: "3", unit: "cups" },
                { name: "Butter", quantity: "2", unit: "tbsp" },
                { name: "Cheese", quantity: "50", unit: "g" },
                { name: "Baguette", quantity: "2", unit: "slices" }
            ],
            steps: [
                "Caramelize onions in butter.",
                "Add broth and simmer.",
                "Serve with melted cheese on bread."
            ],
            image: "https://example.com/french-onion-soup.jpg",
            dietary: ["Vegetarian"]
        },
        {
            id: 17,
            name: "Matcha Latte",
            category: "Beverage",
            cuisine: "Japanese",
            ingredients: [
                { name: "Matcha Powder", quantity: "1", unit: "tsp" },
                { name: "Hot Water", quantity: "1/4", unit: "cup" },
                { name: "Milk", quantity: "3/4", unit: "cup" },
                { name: "Honey", quantity: "1", unit: "tsp" }
            ],
            steps: [
                "Whisk matcha powder with hot water until smooth.",
                "Heat and froth milk.",
                "Combine milk with matcha and sweeten with honey."
            ],
            image: "https://example.com/matcha-latte.jpg",
            dietary: ["Vegetarian"]
        },
        {
            id: 18,
            name: "Piña Colada",
            category: "Beverage",
            cuisine: "Caribbean",
            ingredients: [
                { name: "Pineapple Juice", quantity: "1", unit: "cup" },
                { name: "Coconut Milk", quantity: "1/2", unit: "cup" },
                { name: "Ice", quantity: "1", unit: "cup" },
                { name: "Sugar", quantity: "1", unit: "tsp" }
            ],
            steps: [
                "Blend all ingredients until smooth.",
                "Serve chilled with a pineapple slice."
            ],
            image: "https://example.com/pina-colada.jpg",
            dietary: ["Vegan", "Vegetarian", "Dairy-Free"]
        },
        {
            id: 19,
            name: "Golden Turmeric Milk",
            category: "Beverage",
            cuisine: "Indian",
            ingredients: [
                { name: "Milk", quantity: "1", unit: "cup" },
                { name: "Turmeric", quantity: "1/2", unit: "tsp" },
                { name: "Ginger", quantity: "1/2", unit: "tsp" },
                { name: "Honey", quantity: "1", unit: "tsp" }
            ],
            steps: [
                "Heat milk with turmeric and ginger.",
                "Stir in honey and serve warm."
            ],
            image: "https://example.com/golden-milk.jpg",
            dietary: ["Vegetarian", "Gluten-Free"]
        },
        {
            id: 20,
            name: "Berry Smoothie",
            category: "Beverage",
            cuisine: "American",
            ingredients: [
                { name: "Mixed Berries", quantity: "1", unit: "cup" },
                { name: "Banana", quantity: "1", unit: "medium" },
                { name: "Yogurt", quantity: "1/2", unit: "cup" },
                { name: "Honey", quantity: "1", unit: "tsp" }
            ],
            steps: [
                "Blend all ingredients until smooth.",
                "Serve chilled."
            ],
            image: "https://example.com/berry-smoothie.jpg",
            dietary : ["Vegetarian", "Gluten-Free"]
        },
        {
            id: 21,
            name: "Caprese Salad",
            category: "Appetizer",
            cuisine: "Italian",
            ingredients: [
                { name: "Tomatoes", quantity: "2", unit: "large" },
                { name: "Mozzarella Cheese", quantity: "150", unit: "g" },
                { name: "Basil", quantity: "1", unit: "bunch" },
                { name: "Olive Oil", quantity: "2", unit: "tbsp" },
                { name: "Balsamic Vinegar", quantity: "1", unit: "tbsp" }
            ],
            steps: [
                "Slice tomatoes and mozzarella.",
                "Layer with basil leaves.",
                "Drizzle with olive oil and balsamic vinegar."
            ],
            image: "https://example.com/caprese-salad.jpg",
            dietary: ["Vegetarian"]
        },
        {
            id: 22,
            name: "Vegetable Stir Fry",
            category: "Lunch",
            cuisine: "Asian",
            ingredients: [
                { name: "Broccoli", quantity: "1", unit: "cup" },
                { name: "Carrots", quantity: "1", unit: "medium" },
                { name: "Bell Peppers", quantity: "1", unit: "medium" },
                { name: "Soy Sauce", quantity: "2", unit: "tbsp" },
                { name: "Sesame Oil", quantity: "1", unit: "tbsp" }
            ],
            steps: [
                "Heat oil in a pan.",
                "Add vegetables and stir-fry.",
                "Add soy sauce and serve."
            ],
            image: "https://example.com/vegetable-stir-fry.jpg",
            dietary: ["Vegan", "Gluten-Free"]
        },
        {
            id: 23,
            name: "Beef Tacos",
            category: "Dinner",
            cuisine: "Mexican",
            ingredients: [
                { name: "Ground Beef", quantity: "250", unit: "g" },
                { name: "Taco Shells", quantity: "4", unit: "pieces" },
                { name: "Lettuce", quantity: "1", unit: "cup" },
                { name: "Cheese", quantity: "100", unit: "g" },
                { name: "Salsa", quantity: "1/2", unit: "cup" }
            ],
            steps: [
                "Cook ground beef until browned.",
                "Fill taco shells with beef and toppings.",
                "Serve with salsa."
            ],
            image: "https://example.com/beef-tacos.jpg",
            dietary: ["Non-Vegetarian"]
        },
        {
            id: 24,
            name: "Pasta Primavera",
            category: "Dinner",
            cuisine: "Italian",
            ingredients: [
                { name: "Pasta", quantity: "200", unit: "g" },
                { name: "Zucchini", quantity: "1", unit: "medium" },
                { name: "Bell Peppers", quantity: "1", unit: "medium" },
                { name: "Olive Oil", quantity: "2", unit: "tbsp" },
                { name: "Parmesan Cheese", quantity: "50", unit: "g" }
            ],
            steps: [
                "Cook pasta according to package instructions.",
                "Sauté vegetables in olive oil.",
                "Combine pasta with vegetables and cheese."
            ],
            image: "https://example.com/pasta-primavera.jpg",
            dietary: ["Vegetarian"]
        },
        {
            id: 25,
            name: "Chocolate Chip Cookies",
            category: "Dessert",
            cuisine: "American",
            ingredients: [
                { name: "Flour", quantity: "2", unit: "cups" },
                { name: "Butter", quantity: "1", unit: "cup" },
                { name: "Sugar", quantity: "1", unit: "cup" },
                { name: "Brown Sugar", quantity: "1", unit: "cup" },
                { name: "Chocolate Chips", quantity: "2", unit: "cups" }
            ],
            steps: [
                "Preheat oven to 350°F (175°C).",
                "Cream butter and sugars together.",
                "Add flour and chocolate chips.",
                "Scoop onto baking sheet and bake for 10-12 minutes."
            ],
            image: "https://example.com/chocolate-chip-cookies.jpg",
            dietary: ["Vegetarian"]
        },
        {
            id: 26,
            name: "Lentil Soup",
            category: "Soup",
            cuisine: "Mediterranean",
     ingredients: [
                { name: "Lentils", quantity: "1", unit: "cup" },
                { name: "Carrots", quantity: "2", unit: "medium" },
                { name: "Celery", quantity: "1", unit: "stalk" },
                { name: "Onion", quantity: "1", unit: "medium" },
                { name: "Vegetable Broth", quantity: "4", unit: "cups" }
            ],
            steps: [
                "Sauté onions, carrots, and celery until soft.",
                "Add lentils and broth, then simmer until lentils are tender.",
                "Season to taste and serve warm."
            ],
            image: "https://example.com/lentil-soup.jpg",
            dietary: ["Vegan", "Gluten-Free"]
        },
        {
            id: 27,
            name: "Stuffed Bell Peppers",
            category: "Dinner",
            cuisine: "American",
            ingredients: [
                { name: "Bell Peppers", quantity: "4", unit: "pieces" },
                { name: "Ground Turkey", quantity: "500", unit: "g" },
                { name: "Rice", quantity: "1", unit: "cup" },
                { name: "Tomato Sauce", quantity: "1", unit: "cup" },
                { name: "Cheese", quantity: "100", unit: "g" }
            ],
            steps: [
                "Preheat oven to 375°F (190°C).",
                "Cook rice and mix with turkey and sauce.",
                "Stuff the mixture into halved bell peppers.",
                "Top with cheese and bake for 30 minutes."
            ],
            image: "https://example.com/stuffed-bell-peppers.jpg",
            dietary: ["Non-Vegetarian"]
        },
        {
            id: 28,
            name: "Banana Bread",
            category: "Dessert",
            cuisine: "American",
            ingredients: [
                { name: "Bananas", quantity: "3", unit: "medium" },
                { name: "Flour", quantity: "2", unit: "cups" },
                { name: "Sugar", quantity: "1", unit: "cup" },
                { name: "Eggs", quantity: "2", unit: "large" },
                { name: "Baking Soda", quantity: "1", unit: "tsp" }
            ],
            steps: [
                "Preheat oven to 350°F (175°C).",
                "Mash bananas and mix with sugar and eggs.",
                "Add flour and baking soda, then pour into a loaf pan.",
                "Bake for 60 minutes or until a toothpick comes out clean."
            ],
            image: "https://example.com/banana-bread.jpg",
            dietary: ["Vegetarian"]
        },
        {
            id: 29,
            name: "Pancakes",
            category: "Breakfast",
            cuisine: "American",
            ingredients: [
                { name: "Flour", quantity: "1", unit: "cup" },
                { name: "Milk", quantity: "1", unit: "cup" },
                { name: "Egg", quantity: "1", unit: "large" },
                { name: "Baking Powder", quantity: "2", unit: "tsp" },
                { name: "Sugar", quantity: "2", unit: "tbsp" }
            ],
            steps: [
                "Mix all ingredients until smooth.",
                "Heat a skillet and pour batter to form pancakes.",
                "Cook until bubbles form, then flip and cook until golden."
            ],
            image: "https://example.com/pancakes.jpg",
            dietary: ["Vegetarian"]
        },
        {
            id: 30,
            name: "Caesar Salad",
            category: "Appetizer",
            cuisine: "Italian",
            ingredients: [
                { name: "Romaine Lettuce", quantity: "1", unit: "head" },
                { name: "Croutons", quantity: "1", unit: "cup" },
                { name: "Parmesan Cheese", quantity: "50", unit: "g" },
                { name: "Caesar Dressing", quantity: "1/4", unit: "cup" }
            ],
            steps: [
                "Chop lettuce and place in a bowl.",
                "Add croutons and dressing, then toss.",
                "Top with grated Parmesan and serve."
            ],
            image: "https://example.com/caesar-salad.jpg",
            dietary: ["Vegetarian"]
        },
        {
            id: 31,
            name: "Baked Ziti",
            category: "Dinner",
            cuisine: "Italian",
            ingredients: [
                { name: "Ziti Pasta", quantity : "300", unit: "g" },
                { name: "Marinara Sauce", quantity: "2", unit: "cups" },
                { name: "Ricotta Cheese", quantity: "250", unit: "g" },
                { name: "Mozzarella Cheese", quantity: "200", unit: "g" },
                { name: "Parmesan Cheese", quantity: "50", unit: "g" }
            ],
            steps: [
                "Preheat oven to 375°F (190°C).",
                "Cook ziti according to package instructions.",
                "Mix cooked pasta with marinara and ricotta.",
                "Transfer to a baking dish, top with mozzarella and Parmesan.",
                "Bake for 25-30 minutes until cheese is bubbly."
            ],
            image: "https://example.com/baked-ziti.jpg",
            dietary: ["Vegetarian"]
        },
        {
            id: 32,
            name: "Eggplant Parmesan",
            category: "Dinner",
            cuisine: "Italian",
            ingredients: [
                { name: "Eggplant", quantity: "2", unit: "medium" },
                { name: "Marinara Sauce", quantity: "2", unit: "cups" },
                { name: "Mozzarella Cheese", quantity: "200", unit: "g" },
                { name: "Parmesan Cheese", quantity: "50", unit: "g" },
                { name: "Breadcrumbs", quantity: "1", unit: "cup" }
            ],
            steps: [
                "Preheat oven to 375°F (190°C).",
                "Slice eggplant and salt to remove moisture.",
                "Dip in breadcrumbs and bake until golden.",
                "Layer eggplant with marinara and cheeses in a baking dish.",
                "Bake for 30 minutes until cheese is melted."
            ],
            image: "https://example.com/eggplant-parmesan.jpg",
            dietary: ["Vegetarian"]
        },
        {
            id: 33,
            name: "Chili Con Carne",
            category: "Dinner",
            cuisine: "Mexican",
            ingredients: [
                { name: "Ground Beef", quantity: "500", unit: "g" },
                { name: "Kidney Beans", quantity: "1", unit: "can" },
                { name: "Tomatoes", quantity: "2", unit: "large" },
                { name: "Onion", quantity: "1", unit: "medium" },
                { name: "Chili Powder", quantity: "2", unit: "tbsp" }
            ],
            steps: [
                "Brown ground beef in a pot.",
                "Add chopped onion and cook until soft.",
                "Stir in beans, tomatoes, and chili powder.",
                "Simmer for 30 minutes and serve hot."
            ],
            image: "https://example.com/chili-con-carne.jpg",
            dietary: ["Non-Vegetarian"]
        },
        {
            id: 34,
            name: "Vegetable Curry",
            category: "Dinner",
            cuisine: "Indian",
            ingredients: [
                { name: "Mixed Vegetables", quantity: "2", unit: "cups" },
                { name: "Coconut Milk", quantity: "1", unit: "can" },
                { name: "Curry Powder", quantity: "2", unit: "tbsp" },
                { name: "Onion", quantity: "1", unit: "medium" },
                { name: "Garlic", quantity: "2", unit: "cloves" }
            ],
            steps: [
                "Sauté onion and garlic in a pot.",
                "Add mixed vegetables and curry powder.",
                "Pour in coconut milk and simmer until vegetables are tender.",
                "Serve with rice or naan."
            ],
            image: "https://example.com/vegetable-curry.jpg",
            dietary: ["Vegan", "Gluten-Free"]
        },
        {
            id: 35,
            name: "Pesto Pasta",
            category: "Dinner",
            cuisine: "Italian",
            ingredients: [
                { name: "Pasta", quantity: "200", unit: "g" },
                { name: "Pesto Sauce", quantity: "1/2", unit: "cup" },
                { name: "Parmesan Cheese", quantity: "50", unit: "g" },
                { name: "Cherry Tomatoes", quantity: "1", unit: "cup" },
                { name: "Olive Oil", quantity: "2", unit: "tbsp" }
            ],
            steps: [
                "Cook pasta according to package instructions.",
                "Toss pasta with pesto and olive oil.",
                "Add halved cherry tomatoes and top with Parmesan."
            ],
            image: "https://example.com/pesto-pasta.jpg",
            dietary: ["Vegetarian"]
        },
        {
            id: 36,
            name: "Mango Sticky Rice",
            category: "Dessert",
            cuisine: "Thai",
            ingredients: [
                { name: "Sticky Rice", quantity: "1", unit: "cup" },
                { name: "Coconut Milk", quantity: "1/2", unit: "cup" },
                { name: "Mango", quantity: "1", unit: "large" },
                { name: "Sugar", quantity: "2", unit: "tbsp" },
                { name: "Salt", quantity: "1/4", unit: "tsp" }
            ],
            steps: [
                "Soak sticky rice for 4 hours, then steam until cooked.",
                "Mix coconut milk with sugar and salt, then heat until dissolved.",
                "Serve sticky rice with sliced mango and drizzle with coconut sauce."
            ],
            image: "https://example.com/mango-sticky-rice.jpg",
            dietary: ["Vegan", "Gluten-Free"]
        },
        {
            id: 37,
            name: "Ratatouille",
            category: "Dinner",
            cuisine: "French",
            ingredients: [
                { name: "Zucchini", quantity: "1", unit: "medium" },
                { name: "Eggplant", quantity: "1", unit: "medium" },
                { name: "Bell Peppers", quantity: "1", unit: "medium" },
                { name: "Tomatoes", quantity: "2", unit: "large" },
                { name: "Olive Oil", quantity: "2", unit: "tbsp" }
            ],
            steps: [
                "Chop all vegetables into cubes.",
                "Sauté in olive oil until tender.",
                "Season with salt and herbs, then serve warm."
            ],
            image: "https://example.com/ratatouille.jpg",
            dietary: ["Vegan", "Gluten-Free"]
        },
        {
            id: 38,
            name: "Beef Stroganoff",
            category: "Dinner",
            cuisine: "Russian",
            ingredients: [
                { name: "Beef", quantity: "300", unit: "g" },
                { name: "Mushrooms", quantity: "200", unit: "g" },
                { name: "Onion", quantity: "1", unit: "medium" },
                { name: "Sour Cream", quantity: "1", unit: "cup" },
                { name: "Egg Noodles", quantity: "200", unit: "g" }
            ],
            steps: [
                "Cook egg noodles according to package instructions.",
                "Sauté onions and mushrooms, then add beef until browned.",
                "Stir in sour cream and serve over noodles."
            ],
            image: "https://example.com/beef-stroganoff.jpg",
            dietary: ["Non-Vegetarian"]
        },
        {
            id: 39,
            name: "Chickpea Salad",
            category: "Lunch",
            cuisine: "Mediterranean",
            ingredients: [
                { name: "Chickpeas", quantity: "1", unit: "can" },
                { name: "Cucumber", quantity: "1", unit: "medium" },
                { name: "Tomatoes", quantity: "2", unit: "large" },
                { name: "Red Onion", quantity: "1/4", unit: "medium" },
                { name: "Olive Oil", quantity: "2", unit: "tbsp" }
            ],
            steps: [
                "Rinse and drain chickpeas.",
                "Chop vegetables and mix with chickpeas.",
                "Drizzle with olive oil and season to taste."
            ],
            image: "https://example.com/chickpea-salad.jpg",
            dietary: ["Vegan", "Gluten-Free"]
        },
        {
            id: 40,
            name: "Pork Chops with Applesauce",
            category: "Dinner",
            cuisine: "American",
            ingredients: [
                { name: "Pork Chops", quantity: "2", unit: "pieces" },
                { name: "Applesauce", quantity: "1", unit: "cup" },
                { name: "Olive Oil", quantity: "2", unit: "tbsp" },
                { name: "Salt", quantity: "1", unit: "tsp" },
                { name: "Pepper", quantity: "1", unit: "tsp" }
            ],
            steps: [
                "Season pork chops with salt and pepper.",
                "Sear in olive oil until cooked through.",
                "Serve with applesauce on the side."
            ],
            image: "https://example.com/pork-chops.jpg",
            dietary : ["Non-Vegetarian"]
        },
        {
            id: 41,
            name: "Shrimp Tacos",
            category: "Dinner",
            cuisine: "Mexican",
            ingredients: [
                { name: "Shrimp", quantity: "200", unit: "g" },
                { name: "Taco Shells", quantity: "4", unit: "pieces" },
                { name: "Cabbage", quantity: "1/2", unit: "cup" },
                { name: "Lime", quantity: "1", unit: "whole" },
                { name: "Avocado", quantity: "1", unit: "whole" }
            ],
            steps: [
                "Sauté shrimp until pink and cooked through.",
                "Fill taco shells with shrimp and top with cabbage.",
                "Squeeze lime juice and add avocado slices before serving."
            ],
            image: "https://example.com/shrimp-tacos.jpg",
            dietary: ["Non-Vegetarian"]
        },
        {
            id: 42,
            name: "Vegetable Fried Rice",
            category: "Lunch",
            cuisine: "Asian",
            ingredients: [
                { name: "Rice", quantity: "2", unit: "cups" },
                { name: "Mixed Vegetables", quantity: "1", unit: "cup" },
                { name: "Soy Sauce", quantity: "2", unit: "tbsp" },
                { name: "Egg", quantity: "1", unit: "large" },
                { name: "Green Onions", quantity: "2", unit: "stalks" }
            ],
            steps: [
                "Cook rice and let it cool.",
                "Sauté vegetables and add rice.",
                "Push rice to the side, scramble the egg, then mix everything together.",
                "Add soy sauce and garnish with green onions."
            ],
            image: "https://example.com/vegetable-fried-rice.jpg",
            dietary: ["Vegetarian"]
        },
        {
            id: 43,
            name: "Coconut Curry Chicken",
            category: "Dinner",
            cuisine: "Thai",
            ingredients: [
                { name: "Chicken Breast", quantity: "300", unit: "g" },
                { name: "Coconut Milk", quantity: "1", unit: "can" },
                { name: "Curry Paste", quantity: "2", unit: "tbsp" },
                { name: "Bell Peppers", quantity: "1", unit: "medium" },
                { name: "Basil", quantity: "1", unit: "bunch" }
            ],
            steps: [
                "Sauté chicken until browned.",
                "Add curry paste and bell peppers, cooking until soft.",
                "Pour in coconut milk and simmer until chicken is cooked through.",
                "Garnish with fresh basil before serving."
            ],
            image: "https://example.com/coconut-curry-chicken.jpg",
            dietary: ["Non-Vegetarian"]
        },
        {
            id: 44,
            name: "Stuffed Zucchini",
            category: "Dinner",
            cuisine: "Mediterranean",
            ingredients: [
                { name: "Zucchini", quantity: "2", unit: "medium" },
                { name: "Ground Beef", quantity: "300", unit: "g" },
                { name: "Tomato Sauce", quantity: "1", unit: "cup" },
                { name: "Cheese", quantity: "100", unit: "g" },
                { name: "Italian Seasoning", quantity: "1", unit: "tbsp" }
            ],
            steps: [
                "Preheat oven to 375°F (190°C).",
                "Halve zucchini and scoop out the insides.",
                "Cook ground beef with tomato sauce and seasoning.",
                "Stuff zucchini with the mixture, top with cheese, and bake for 25 minutes."
            ],
            image: "https://example.com/stuffed-zucchini.jpg",
            dietary: ["Non-Vegetarian"]
        },
        {
            id: 45,
            name: "Peach Crisp",
            category: "Dessert",
            cuisine: "American",
            ingredients: [
                { name: "Peaches", quantity: "4", unit: "large" },
                { name: "Oats", quantity: "1", unit: "cup" },
                { name: "Brown Sugar", quantity: "1/2", unit: "cup" },
                { name: "Flour", quantity: "1/2", unit: "cup" },
                { name: "Butter", quantity: "1/4", unit: "cup" }
            ],
            steps: [
                "Preheat oven to 350°F (175°C).",
                "Slice peaches and place them in a baking dish.",
                "In a bowl, mix oats, brown sugar, flour, and melted butter until crumbly.",
                "Spread the mixture over the peaches and bake for 30-35 minutes until golden.",
                "Serve warm with ice cream or whipped cream."
            ],
            image: "https://example.com/peach-crisp.jpg",
            dietary: ["Vegetarian"]
        },
        {
            id: 46,
            name: "Lemon Bars",
            category: "Dessert",
            cuisine: "American",
            ingredients: [
                { name: "Flour", quantity: "1", unit: "cup" },
                { name: "Butter", quantity: "1/2", unit: "cup" },
                { name: "Sugar", quantity: "1", unit: "cup" },
                { name: "Eggs", quantity: "2", unit: "large" },
                { name: "Lemon Juice", quantity: "1/4", unit: "cup" }
            ],
            steps: [
                "Preheat oven to 350°F (175°C).",
                "Mix flour, butter, and half the sugar to form a crust.",
                "Press into a baking dish and bake for 15 minutes.",
                "Whisk eggs, remaining sugar, and lemon juice, then pour over the crust.",
                "Bake for an additional 20 minutes and cool before slicing."
            ],
            image: "https://example.com/lemon-bars.jpg",
            dietary: ["Vegetarian"]
        },
        {
            id: 47,
            name: "Chocolate Mousse",
            category: "Dessert",
            cuisine: "French",
            ingredients: [
                { name: "Dark Chocolate", quantity: "200", unit: "g" },
                { name: "Eggs", quantity: "3", unit: "large" },
                { name: "Sugar", quantity: "1/4", unit: "cup" },
                { name: "Heavy Cream", quantity: "1", unit: "cup" }
            ],
            steps: [
                "Melt chocolate and let it cool slightly.",
                "Whisk egg yolks with sugar until pale.",
                "Fold in melted chocolate and whipped cream.",
                "Chill for at least 2 hours before serving."
            ],
            image: "https://example.com/chocolate-mousse.jpg",
            dietary: ["Vegetarian"]
        },
        {
            id: 48,
            name: "Apple Pie",
            category: "Dessert",
            cuisine: "American",
            ingredients: [
                { name: "Apples", quantity: "6", unit: "large" },
                { name: "Sugar", quantity: "3/4", unit: "cup" },
                { name: "Flour", quantity: "2", unit: "tbsp" },
                { name: "Cinnamon", quantity: "1", unit: "tsp" },
                { name: "Pie Crust", quantity: "1", unit: "piece" }
            ],
            steps: [
                "Preheat oven to 425°F (220°C).",
                "Peel and slice apples, then mix with sugar, flour, and cinnamon.",
                "Place mixture in pie crust and cover with another crust.",
                "Cut slits in the top crust and bake for 45-50 minutes."
            ],
            image: "https://example.com/apple-pie.jpg",
            dietary: ["Vegetarian"]
        },
        {
            id: 49,
            name: "Tiramisu",
            category: "Dessert",
            cuisine: "Italian",
            ingredients: [
                { name: "Mascarpone Cheese", quantity: "500", unit: "g" },
                { name: "Coffee", quantity: "1", unit: "cup" },
                { name: "Ladyfingers", quantity: "24", unit: "pieces" },
                { name: "Cocoa Powder", quantity: "2", unit: "tbsp" },
                { name: "Sugar", quantity: "1/2", unit: "cup" }
            ],
            steps: [
                "Mix mascarpone with sugar until smooth.",
                "Dip ladyfingers in coffee and layer in a dish.",
                "Spread mascarpone mixture over layers and repeat.",
                "Chill for at least 4 hours and dust with cocoa before serving."
            ],
            image: "https://example.com/tiramisu.jpg",
            dietary: ["Vegetarian"]
        },
        {
            id: 50,
            name: "Pavlova",
            category: "Dessert",
            cuisine: "Australian",
            ingredients: [
                { name: "Egg Whites", quantity: "4", unit: "large" },
                { name: "Sugar", quantity: "1", unit: "cup" },
                { name: " Cornstarch", quantity: "1", unit: "tsp" },
                { name: "Vinegar", quantity: "1", unit: "tsp" },
                { name: "Whipped Cream", quantity: "1", unit: "cup" },
                { name: "Mixed Berries", quantity: "1", unit: "cup" }
            ],
            steps: [
                "Preheat oven to 250°F (120°C).",
                "Whip egg whites until soft peaks form, then gradually add sugar.",
                "Fold in cornstarch and vinegar.",
                "Spread meringue on a baking sheet and shape into a circle.",
                "Bake for 1 hour, then turn off the oven and let it cool.",
                "Top with whipped cream and berries before serving."
            ],
            image: "https://example.com/pavlova.jpg",
            dietary: ["Gluten-Free"]
        },
        {
            id: 51,
            name: "Cheesecake",
            category: "Dessert",
            cuisine: "American",
            ingredients: [
                { name: "Cream Cheese", quantity: "500", unit: "g" },
                { name: "Sugar", quantity: "1", unit: "cup" },
                { name: "Eggs", quantity: "3", unit: "large" },
                { name: "Graham Cracker Crust", quantity: "1", unit: "piece" },
                { name: "Vanilla Extract", quantity: "1", unit: "tsp" }
            ],
            steps: [
                "Preheat oven to 325°F (160°C).",
                "Beat cream cheese and sugar until smooth.",
                "Add eggs one at a time, mixing well after each addition.",
                "Stir in vanilla and pour into crust.",
                "Bake for 50-60 minutes until set, then cool and refrigerate."
            ],
            image: "https://example.com/cheesecake.jpg",
            dietary: ["Vegetarian"]
        },
        {
            id: 52,
            name: "Brownies",
            category: "Dessert",
            cuisine: "American",
            ingredients: [
                { name: "Butter", quantity: "1/2", unit: "cup" },
                { name: "Sugar", quantity: "1", unit: "cup" },
                { name: "Eggs", quantity: "2", unit: "large" },
                { name: "Cocoa Powder", quantity: "1/3", unit: "cup" },
                { name: "Flour", quantity: "1/2", unit: "cup" }
            ],
            steps: [
                "Preheat oven to 350°F (175°C).",
                "Melt butter and mix with sugar.",
                "Add eggs and cocoa, then stir in flour.",
                "Pour into a greased baking dish and bake for 20-25 minutes."
            ],
            image: "https://example.com/brownies.jpg",
            dietary: ["Vegetarian"]
        },
        {
            id: 53,
            name: "Fruit Salad",
            category: "Dessert",
            cuisine: "American",
            ingredients: [
                { name: "Mixed Fruits", quantity: "4", unit: "cups" },
                { name: "Honey", quantity: "2", unit: "tbsp" },
                { name: "Lime Juice", quantity: "1", unit: "tbsp" }
            ],
            steps: [
                "Chop mixed fruits into bite-sized pieces.",
                "Drizzle with honey and lime juice.",
                "Toss gently and serve chilled."
            ],
            image: "https://example.com/fruit-salad.jpg",
            dietary: ["Vegan", "Gluten-Free"]
        },
        {
            id: 54,
            name: "Peanut Butter Cookies",
            category: "Dessert",
            cuisine: "American",
            ingredients: [
                { name: "Peanut Butter", quantity: "1", unit: "cup" },
                { name: "Sugar", quantity: "1", unit: "cup" },
                { name: "Egg", quantity: "1", unit: "large" }
            ],
            steps: [
                "Preheat oven to 350°F (175°C).",
                "Mix peanut butter, sugar, and egg until smooth.",
                "Scoop onto a baking sheet and flatten with a fork.",
                "Bake for 10-12 minutes until golden."
            ],
            image: "https://example.com/peanut-butter-cookies.jpg",
            dietary: ["Vegetarian", "Gluten-Free"]
        }
];

// Get all recipes or filter by search, category, dietary preferences
app.get("/recipes", (req, res) => {
    const { search, category, dietary } = req.query;
    let filteredRecipes = recipes;

    if (search) {
        filteredRecipes = filteredRecipes.filter(r => r.name.toLowerCase().includes(search.toLowerCase()));
    }
    if (category) {
        filteredRecipes = filteredRecipes.filter(r => r.category.toLowerCase() === category.toLowerCase());
    }
    if (dietary) {
        filteredRecipes = filteredRecipes.filter(r => r.dietary.includes(dietary));
    }

    res.json(filteredRecipes);
});

// Start the server
const PORT = 5000;
app.listen(PORT, () => console.log(`Server running on http://localhost:${PORT}`));