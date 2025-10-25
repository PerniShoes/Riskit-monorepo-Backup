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
    return Response{"Won't be used","42069"};
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

