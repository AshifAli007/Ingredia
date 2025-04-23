Custom Recipe Recommender Web App – Software Engineering Group Project

Web App Name: Ingredia (Based on Ingredient)

This is a web application developed as part of a software engineering group project. The app recommends personalized recipes based on user-inputted ingredients, dietary preferences, and cuisine types. It was built using large language models (LLMs) throughout the software development process, including requirements engineering, architecture design, and code generation.

## How to Run Ingredia Locally

Follow these steps to set up and run the Ingredia web app on your local machine:

### Prerequisites
1. Ensure you have the following installed:
   - [Node.js](https://nodejs.org/) (version 16 or higher)
   - [npm](https://www.npmjs.com/) (comes with Node.js)
   - A modern web browser (e.g., Chrome, Firefox)

2. Clone this repository to your local machine:
   ```bash
   git clone https://github.com/your-repo/ingredia.git
   cd ingredia
   ```

### Starting the App Locally

3. Install the required dependencies:
   ```bash
   npm install
   ```

4. Obtain an API key from Spoonacular:
   - Visit the [Spoonacular API website](https://spoonacular.com/food-api).
   - Sign up for a free account or log in if you already have one.
   - Navigate to the API section and generate your API key.
   - Copy the API key.

5. Create a `.env` file in the root directory of the project and add the following lines:
   ```env
   REACT_APP_CLERK_PUBLISHABLE_KEY=pk_test_cHJvcGVyLXBpcGVmaXNoLTIwLmNsZXJrLmFjY291bnRzLmRldiQ
   REACT_APP_SPOONACULAR_API_KEY=dda4f0b377a04cec9f8471c5ec912e4d
   ```

6. Start the development server:
   ```bash
   npm start
   ```

7. Open your web browser and navigate to `http://localhost:3000` to access the app.

