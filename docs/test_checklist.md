# Test Checklist: RideFlow MVP

This checklist ensures that all core features of the RideFlow MVP are functioning correctly before final submission.

## 1. Documentation & Design
- [x] Problem understanding note completed (`problem_understanding.md`)
- [x] Architecture diagram completed (`architecture.png`)
- [x] API documentation completed (`api_documentation.md`)
- [x] Data model explained (`data_model.md`)
- [x] Demo script prepared (`demo_flow.md`)
- [x] MVP vs Future Scope documented (`mvp_vs_future_scope.md`)

## 2. Backend API Verification
- [x] `/locations` returns all predefined locations.
- [x] `/routes/search` returns at least 3 ranked route options.
- [x] Preference filters (Fastest, Cheapest, etc.) correctly change the route ranking.
- [x] `/routes/{id}` returns the correct full route timeline.
- [x] `/routes/{id}/explanation` returns the rule-based recommendation text.
- [x] `/bookings/create` generates a mock booking with unique ticket IDs.
- [x] `/payments/pay` successfully simulates a wallet transaction and returns a Journey Pass.
- [x] `/journey/{id}/updates` returns simulated live status updates.

## 3. Frontend User Flow
- [x] **Home Screen**: Source/Destination input and search button work.
- [x] **Route Options**: Route cards display time, fare, and carbon/safety scores.
- [x] **Route Details**: Timeline shows step-by-step instructions.
- [x] **Booking Summary**: Shows the fare breakdown and mock ticket IDs.
- [x] **Payment**: Mock wallet payment screen processes payment successfully.
- [x] **Journey Pass**: Unified pass is generated with a QR placeholder.
- [x] **Live Tracking**: Real-time progress simulation with ETA updates is visible.

## 4. End-to-End Demo Journey
- [x] **Full Flow Test**: Search $\rightarrow$ Compare $\rightarrow$ Select $\rightarrow$ Understand $\rightarrow$ Book $\rightarrow$ Pay $\rightarrow$ Track.
- [x] **Data Consistency**: All labels, fares, and IDs are consistent across the flow.
- [x] **Stability**: No crashes occur when switching between screens or starting the simulation.
