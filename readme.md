# Goal
Build a browser extension that acts as a Shopping Assistant. The extension will help users shop smarter by providing real-time price comparisons, coupon suggestions, shared carts, and collaborative shopping features. The app will use Next.js for the frontend, Tailwind CSS for styling, Django for the backend, and Stagehand for real-time collaboration.

## Current Stage
**Building Mode:** The app is not yet ready for deployment. Focus on development, testing, and scalability.

## Key Features to Build
### Real-Time Price Comparison
- Fetch and compare prices for the same product across multiple e-commerce platforms.
- Display the best deals to the user in real-time.

### Coupon and Discount Finder
- Automatically find and apply valid coupons or discounts at checkout.
- Notify users of available deals.

### Shared Carts
- Allow users to create shared carts with friends or family.
- Sync cart items in real-time across different websites using Stagehand.

### Collaborative Shopping
- Enable users to shop together in real-time, discussing products and making decisions collaboratively.
- Add a chat feature powered by Stagehand.

### Wishlist and Price Tracking
- Let users save items to a wishlist and track price changes over time.
- Notify users when prices drop.

## Tech Stack
### Frontend
- [Next.js](https://nextjs.org/docs): For building the extension’s UI.
- [Tailwind CSS](https://tailwindcss.com/docs): For styling the UI.
- [Stagehand SDK](https://docs.stagehand.io): For real-time collaboration and data sync.

### Backend
- [Django](https://docs.djangoproject.com): For handling business logic, APIs, and database management.
- [Django REST Framework (DRF)](https://www.django-rest-framework.org/): For building APIs.
- [Stagehand SDK](https://docs.stagehand.io): For real-time updates and collaboration.

### Database
- [PostgreSQL](https://www.postgresql.org/docs/): For storing user data, product details, and shared carts.

### Real-Time Collaboration
- [Stagehand](https://docs.stagehand.io): For real-time data sync, shared carts, and collaborative features.

### APIs
- Use APIs like Rakuten, Honey, or custom scrapers for price comparison and coupon finding.

## AI Guidance for Step-by-Step Execution
To guide AI effectively in building this project without hallucinations, follow these best practices:

1. **Structured Task Breakdown:**  
   - Break down each major step into smaller, actionable tasks.
   - Example:  
     - Install Node.js and Next.js.  
     - Run `npx create-next-app@latest shopping-assistant`.  
     - Set up Tailwind CSS configuration.

2. **Stepwise Execution:**  
   - Complete one step at a time before moving to the next.

3. **Clear References to Documentation:**  
   - Include documentation URLs alongside instructions to ensure AI uses verified sources.

4. **Explicit Commands and Code Snippets:**  
   - Example:  
     ```bash
     npm install tailwindcss postcss autoprefixer
     npx tailwindcss init -p
     ```

5. **Validation Steps:**  
   - Example: “Run `npm run dev` and ensure the server is running without errors.”

6. **Modular Execution Approach:**  
   - Develop components separately and integrate them later.

7. **Error Handling Instructions:**  
   - Example: Check `.env` file for database credentials.

8. **Test-Driven Development (TDD):**  
   - Implement unit tests before adding features.

9. **Track Progress and Iterate:**  
   - Review completed steps before moving forward.

10. **Avoiding Assumptions:**  
   - Define requirements clearly and explicitly.

## Steps to Build
### 1. Set Up the Project
#### Frontend (Next.js + Tailwind CSS)
- Create a new Next.js app.
- Install Tailwind CSS and configure it.
- Build the popup UI for the extension.

#### Backend (Django)
- Create a new Django project and app.
- Set up PostgreSQL as the database.
- Define models for products, shared carts, and users.

#### Browser Extension Setup
- Create a `manifest.json` file to define the extension’s metadata and permissions.
- Add content and background scripts to interact with web pages and handle communication with the backend.

### 2. Build Core Features
#### Real-Time Price Comparison
- Use APIs or web scraping to fetch prices from multiple websites.
- Display the best deals in the popup UI.

#### Coupon and Discount Finder
- Integrate with coupon APIs like Honey or Rakuten.
- Automatically apply coupons at checkout.

#### Shared Carts
- Use Stagehand to create and sync shared carts in real-time.
- Allow users to add or remove items from the cart.

#### Collaborative Shopping
- Add a real-time chat feature using Stagehand.
- Show active users and their actions (e.g., adding items to the cart).

...

