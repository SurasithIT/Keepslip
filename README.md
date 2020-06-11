# KeepSlip-Frontend

Using NextJS (Server Side Rendering ReactJS)

# KeepSlip-Backend

KeepSlip Backend has 7 services

- User service: manage customer, store users and user's receipt connect with the KeepSlip database.
- ReceiptFromStore service: manage receipt from other stores connect with Store database.
- SmartContract service: manage receipt data connect with Smart Contract in Kovan network (using ether js),
- TheRevenueDepartment service: Retrieve store data from The Revenue Department by using the VAT service open API.
- Authentication service: manage user authentication and verify user authorization with the client.

**All services, MySQL Database and NGINX using Docker to run**

## Running

```
docker-compose up
```

## Deployment

This Backend is deploy on Google Cloud Platform

- MySQL is create on Google Cloud SQL
- Node app is Deploy and run on Google Cloud Run
