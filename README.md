
# OTP-based Authentication API

This Node.js application provides OTP-based authentication using email. It consists of three APIs: Register, sendOtp and verifyEmail.


### Generate OTP

Important Conditions

1. OTP once used cannot be reused.
2. OTP is valid for 5 minutes only.
3. 5 consecutive wrong OTP attempts will block the user account for 1 hour.
4. There should be a minimum 1-minute gap between two generate OTP requests.


Technologies Used

1. Node.js
2. Express.js
3. MongoDB (as the database for storing user information and OTP details)
4. Nodemailer (for sending emails)
5. JWT (for generating and verifying JWT tokens)

# Prerequisites
1. Node.js 
2. MongoDB 

# Getting Started
Clone the repository.
Install the dependencies:
npm install

Configure the environment variables (.env file):
- `USER_EMAIL`: Email ID for Nodemailer mails.
- `Nodemailer_PASSWORD`: Password for Nodemailer APP.
- `DB_USER`: User ID for MongoDB.
- `DB_PASSWORD`: Password for the MongoDB Cluster.


Start the server:
npm start
The server should now be running on http://localhost:8000

API Usage:

1. Register a User:
Send a POST request to /api/register with the following JSON body:

json
{
  "name": "John Doe",
  "email": "user@example.com"
}


2. Generate OTP(Works only if a user is registered):
Send a GET request to /api/login/sendotp with the following JSON body:

json
{
  "email": "user@example.com"
}

Login
Send a POST request to /api/login/verifyemail with the following JSON body:

json
{
  "email": "user@example.com",
  "otp": "123456"
}

Replace http://localhost:3000 with the actual URL where your application is deployed.

## Curl Requests:
1. Register : curl -X POST -H "Content-Type: application/json" -d '{"name":"John Doe","email":"user@example.com"}' https://relieved-tutu-ant.cyclic.app/api/register
2. Send OTP: curl -X GET -H "Content-Type: application/json" -d '{"email":"user@example.com"}' https://relieved-tutu-ant.cyclic.app/api/login/sendotp
3. VerifyEmail: curl -X POST -H "Content-Type: application/json" -d '{"otp":"123456","email":"user@example.com"}' https://relieved-tutu-ant.cyclic.app/api/login/verifyemail




### Developed By: Victor Mitra(victor.mitra15@gmail.com)
