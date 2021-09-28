<div align="center">
  
  <img src="https://user-images.githubusercontent.com/38811310/135116066-974e5815-dfd7-47c0-a96c-c15edae38d69.JPG" />

</div>

  <h1>MeToo - a few clicks is all it takes</h1>
  <p>A simulated marketplace for Ottawa-based sellers and buyers</p>

# Table of Contents 

1. [Overview](#1-overview)
2. [Database](#2-database)
    - 2.1 [ER Diagram](#21-er-diagram)
    - 2.2 [Database Design](#22-database-design)
      - 2.2.1 [Products vs Reviews vs Orders](#221-products-vs-reviews-vs-orders)
      - 2.2.2 [Product ID vs Product](#222-product-id-vs-products)
3. [Express API](#3-express-api)
    - 3.1 [Architecture Diagram](#31-architecture-diagram)
    - 3.2 [API Design](#32-api-design)
    
# 1. Overview

- NodeJS and ExpressJS:
  - Our frontend is primarily Javascript-based and as a result, I chose to use NodeJS as our backend framework so that I and future developers can seamlessly work full stack
- MongoDB and Mongoose:
  - In another context we may have chosen a SQL database but we are currently looking for speed of development and so we went with NoSQL. As we are opting for speed of development we opted to couple Mongoose with MongoDB. Another option we considered was Firebase / Firestore but chose MongoDB because it would be more high-performant as we scale. 

# 2. Database

## 2.1. ER Diagram
![image](https://user-images.githubusercontent.com/38811310/135113523-2156ec2a-aeca-408d-9dc7-8b155db41f58.png)

## 2.2. Database Design

#### 2.2.1. Products vs Reviews vs Orders:  
  - I had originally nested reviews under products because all functionality was associated with one another but realized that it may be harder to decouple logic later down the road if I follow this design. 
  - For example, if i nested orders under products i would have to loop through each product to retrieve all the orders in our backend
#### 2.2.2. Product ID vs Products 
  - I also wanted to point your attention to the orders table where you can see we are only
storing product IDs instead of the entire product object. With this design I wanted to reduce duplication in our database, and so by only storing the ID we wouldn’t have to replicate data by storing the entire product as well.
  - That being said, there are some tradeoffs with this approach because if we had nested the entire product then we would be able to access the product objects right away whereas currently I have to make an API call for every product that is stored

# 3. Express API 

## 3.1. Architecture Diagram
![image](https://user-images.githubusercontent.com/38811310/135114362-cae13937-fdba-4991-97ba-6bba73158860.png)

## 3.2. API Design 
  - Instead of having everything in 1 giant API file I decoupled the backend logic so that there is a clear separation of concerns. 

#### Routes: 
You can see that all HTTP requests are directed first to Routes, which contain the base object URLs such as /Products , /Reviews , /Orders

#### Controllers: 
Afterwards, they are brought to the controllers which connect the specific HTTP URL to the business logic and services

#### Services: 
The services hold all the actual functionality and business logic of the backend. In the future, we would implement a database access layer so the logic is further decoupled. For now the services directly communicate with the database.
