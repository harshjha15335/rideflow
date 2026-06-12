# API Documentation

## Base URL
`http://localhost:8000`

## Endpoints

### 1. Route Search
**Endpoint**: `POST /routes/search`

**Request Body**:
```json
{
  "source": "Central Railway Station",
  "destination": "Tech Park",
  "preference": "balanced"
}
```
**Response**:
```json
{
  "preference": "balanced",
  "routes": [
    {
      "routeId": "RF-R1",
      "name": "Multi-Modal Green Link",
      "summary": "Walk → Bus → Metro → Auto",
      "totalTime": 54,
      "totalFare": 82,
      "transfers": 2,
      "walkingDistance": 650,
      "carbonScore": "Low",
      "safetyScore": "Medium",
      "reliability": "High",
      "tag": "Recommended",
      "score": 78,
      "mapPathPoints": [...]
    }
  ]
}
```

### 2. Route Details
**Endpoint**: `GET /routes/{route_id}`

**Response**:
```json
{
  "routeId": "RF-R1",
  "name": "Multi-Modal Green Link",
  "totalTime": 54,
  "totalFare": 82,
  "transfers": 2,
  "walkingDistance": 650,
  ...
}
```

### 3. Route Explanation
**Endpoint**: `GET /routes/{route_id}/explanation`

**Response**:
```json
{
  "routeId": "RF-R1",
  "explanation": "This route is recommended because it offers the best balance of time, cost, transfers, and walking distance."
}
```

### 4. Create Booking
**Endpoint**: `POST /bookings/create`

**Request Body**:
```json
{
  "routeId": "RF-R1",
  "userId": "demo-user"
}
```
**Response**:
```json
{
  "bookingId": "RF-BKG-XXXXXX",
  "legs": [
    { "mode": "Walk", "ticketId": "...", "fare": 0 },
    { "mode": "Bus", "ticketId": "...", "fare": 15 },
    ...
  ],
  "totalFare": 82,
  "status": "Pending Payment"
}
```

### 5. Mock Payment
**Endpoint**: `POST /payments/pay`

**Request Body**:
```json
{
  "bookingId": "RF-BKG-XXXXXX",
  "paymentMethod": "Mock NCMC Wallet"
}
```
**Response**:
```json
{
  "paymentStatus": "Success",
  "journeyPassId": "RF-PASS-XXXXXX",
  "qrCodeText": "RF-PASS-XXXXXX",
  "walletBalance": 418
}
```

### 6. Live Journey Updates
**Endpoint**: `GET /journey/{booking_id}/updates`

**Response**:
```json
{
  "bookingId": "RF-BKG-XXXXXX",
  "updates": [
    "Bus arriving in 4 minutes.",
    "Metro expected on Platform 2.",
    "Auto driver arriving at Gate 3.",
    "ETA updated by 5 minutes due to traffic."
  ]
}
```

### 7. Journey Passes
**Endpoint**: `GET /passes`

**Response**:
```json
[
  {
    "id": "pass-all-in-one",
    "name": "All-in-One Pass",
    "price": 999,
    ...
  }
]
```
