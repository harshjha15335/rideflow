# MVP vs Future Scope

## Real in MVP
The following features are fully implemented and functional in the current MVP:
* **Frontend UI**: Complete user flow from search to tracking.
* **Backend API**: Fully functional endpoints for route search, ranking, booking, and payment.
* **Routing Engine**: Rule-based scoring and preference-based ranking (Fastest, Cheapest, etc.).
* **Static Data**: Predefined locations and route legs providing a consistent demo experience.
* **Mock Flows**: Simulated booking IDs, payment success states, and a generated Journey Pass.
* **Simulation**: Timer-based live journey updates.

## Simulated / Mock in MVP
To deliver the MVP within time constraints, the following are simulated:
* **Real-time vehicle tracking**: Updates are loaded from a static JSON file rather than a live GPS feed.
* **NCMC / UPI Payment**: The payment process is a mock transaction that deducts from a simulated wallet.
* **Actual Ticket Booking**: Booking IDs are randomly generated and not linked to actual transport authority systems.
* **Carbon/Safety Data**: These scores are predefined in the data files rather than calculated from real-time environmental or crime data APIs.

## Future Scope
The following enhancements are planned for the production version:
* **Real-Time Integration**: Integration with GTFS-Realtime feeds for live bus and metro tracking.
* **Official Payment Gateway**: Integration with NCMC and UPI for actual monetary transactions.
* **Ride-Hailing APIs**: Direct integration with Ola, Uber, and Rapido for automated last-mile booking.
* **Dynamic Routing**: Implementation of a full Dijkstra/A* algorithm on a real-world map instead of predefined routes.
* **Predictive Analysis**: AI models to predict delays based on historical traffic data.
* **Multi-city Expansion**: Expanding the dataset to cover multiple urban centers.
* **Full Accessibility Filters**: Adding routes specifically optimized for wheelchairs or strollers.
