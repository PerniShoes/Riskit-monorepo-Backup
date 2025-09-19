#include "HealthEndpoint.hpp"
#include <ctime>
#include <cstdlib>
#include <nlohmann/json.hpp>

HealthEndpoint::HealthEndpoint()
    : EndpointBase("/api/health")
{

}

Response HealthEndpoint::HGET()
{
    using ordered_json = nlohmann::ordered_json;

    ordered_json health;

    health["health"] = {{"status", "ok"}, {"service", "cpp_backend"}};

    return {health.dump(4), "200 OK"};
}

Response HealthEndpoint::HPOST()
{
    return {"Not implemented yet","HealthEP"};
}
Response HealthEndpoint::HPUT()
{
    return {"Not implemented yet","HealthEP"};
}
Response HealthEndpoint::HDELETE()
{
    return {"Not implemented yet","HealthEP"};
}

