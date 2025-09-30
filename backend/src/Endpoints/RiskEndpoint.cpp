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
    using ordered_json = nlohmann::ordered_json;
    ordered_json risk;

    double p = 0.25 + (std::rand() % 751) / 400.0;
    risk["risk"] = {{"risk", "sector_threat"}, {"probability", p}};

    return {risk.dump(4), "200 OK"};
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

