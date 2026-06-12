# Data Model

## Core Entities

### Location

Represents major journey endpoints.

Fields:

* locationId
* name
* type
* latitude
* longitude

Example:

* Central Railway Station
* Tech Park
* Airport Road

---

### Stop

Represents intermediate transport stops.

Fields:

* stopId
* name
* type

Examples:

* Metro Central
* Bus Stop A
* Platform 2

---

### Transport Leg

Represents one segment of travel.

Fields:

* legId
* from
* to
* mode
* routeName
* duration
* fare
* distance
* walkingDistance
* reliabilityScore
* carbonScore
* safetyScore

---

### Route

Represents a complete journey.

Fields:

* routeId
* legs[]
* totalTime
* totalFare
* transfers
* walkingDistance
* reliability
* carbonScore
* safetyScore
* score

---

### Booking

Fields:

* bookingId
* routeId
* ticketIds[]
* totalFare
* status

---

### Payment

Fields:

* paymentId
* bookingId
* amount
* paymentStatus

---

### Journey Pass

Fields:

* journeyPassId
* bookingId
* qrCodeText
* routeSummary

---

### Live Update

Fields:

* updateId
* bookingId
* message
* timestamp
