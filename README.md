
markymark-KVWN-news

hosted version: https://markymark-kvwn-news.onrender.com/


Summary: 

This repo is a backend service built to provide access to various endpoints for managing articles, comments, users, and topics. Designed to support a news platform, it offers functionalities for querying, retrieving, posting, updating, and deleteing data.


Getting Started:

To get a copy of the project up and running on your local machine, follow these steps:

-Prerequisites
Make sure you have the following software installed:

Node.js (minimum version: 14.x)
PostgreSQL (minimum version: 10.x)

1. Fork and clone this repo.

2. run: npm install.
   
3. In order to have access to the necessary environment variables, you will need to create a .env.test file and a .env.development file then update these in accordance with the correct database name for each. There is a .env-example file which can be used as a templete for these. Database names can be found in /db/setup.sql. Make sure env files are gitignored.

4. run: npm run setup-dbs.

5. run: npm run seed.

6. Good to go!

(to execute tests and ensure functionality of the api, use: npm run test)


Key Components:

Express.js Backend: The project utilizes Express.js, a popular Node.js framework, to create a RESTful API.

Database Setup: PostgreSQL is used as the database management system. The schema includes tables for articles, comments, users, and topics.

Controllers: Controllers handle incoming requests, calling appropriate functions from the models and sending responses back to the client.

Models: Models interact directly with the database, executing queries and returning data to the controllers.

Error Handling: Middleware is implemented for error handling, ensuring appropriate responses are sent back to the client in case of errors.

Seeding Data: The project includes scripts for seeding the database with initial data, including articles, comments, users, and topics.

Environment Configuration: Configuration files manage environment variables for different environments, ensuring flexibility and security.

Testing: Jest is used for testing, ensuring the reliability and functionality of the API endpoints.


Technologies Used:

Node.js
Express.js
PostgreSQL
Jest
Supertest
dotenv
husky


Conclusion:

Provides a robust backend solution for managing news-related data, offering a range of functionalities to support various client applications. With its modular architecture, error handling, and comprehensive testing, it ensures reliability and scalability for future development and expansion.












