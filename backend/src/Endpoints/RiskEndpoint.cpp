#include "RiskEndpoint.hpp"
#include <ctime>
#include <cstdlib>
#include <nlohmann/json.hpp>

RiskEndpoint::RiskEndpoint()
    : EndpointBase("/api/risk")
{

}

Response RiskEndpoint::HGET()
{
    return Response{"Won't be used","42069"};
}

Response RiskEndpoint::HPOST()
{
    return {"Not implemented yet","RiskEP"};
}
Response RiskEndpoint::HPUT()
{
    return {"Not implemented yet","RiskEP"};
}
Response RiskEndpoint::HDELETE()
{
    return {"Not implemented yet","RiskEP"};
}

