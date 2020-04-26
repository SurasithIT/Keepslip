# KeepSlip-Backend
KeepSlip Project backend dev all services

KeepSlip Project has 7 services
- Customer service: manage customer users connect with the KeepSlip database.
- Receipt service: manage receipt id connect with the KeepSlip database.
- Store service: manage store user connect with the KeepSlip database.
- ReceiptFromStore service: manage receipt from other stores connect with Store database.
- SmartContract service: manage receipt data connect with Smart Contract in Kovan network (using ether js),
- TheRevenueDepartment service: Retrieve store data from The Revenue Department by using the VAT service open API.
- Authentication service: manage user authentication and verify user authorization with the client. 

**All services, Database and Reverse proxy using Docker to run**
## Running
```
docker-compose up
```
