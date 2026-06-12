def calculate_score(route):
    """
    Higher score = better route
    """

    time_score = max(0, 100 - route["totalTime"])
    fare_score = max(0, 100 - route["totalFare"])

    reliability_bonus = {
        "High": 20,
        "Medium": 10,
        "Low": 0
    }

    safety_bonus = {
        "High": 15,
        "Medium": 8,
        "Low": 0
    }

    score = (
        0.4 * time_score +
        0.3 * fare_score +
        reliability_bonus.get(route["reliability"], 0) +
        safety_bonus.get(route["safetyScore"], 0)
    )

    return round(score, 2)


def rank_routes(routes, preference="recommended"):

    if preference == "fastest":
        return sorted(routes, key=lambda x: x["totalTime"])

    if preference == "cheapest":
        return sorted(routes, key=lambda x: x["totalFare"])

    if preference == "safest":
        return sorted(
            routes,
            key=lambda x: {"High": 3, "Medium": 2, "Low": 1}[x["safetyScore"]],
            reverse=True
        )

    if preference == "greenest":
        return sorted(
            routes,
            key=lambda x: {"Low": 3, "Medium": 2, "High": 1}[x["carbonScore"]],
            reverse=True
        )

    return sorted(routes, key=lambda x: x["score"], reverse=True)