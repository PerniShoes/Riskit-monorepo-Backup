#include "StateEndpoint.hpp"
#include <ctime>
#include <cstdlib>
#include <nlohmann/json.hpp>
#include <iostream>

StateEndpoint::StateEndpoint()
    : EndpointBase("/api/state")
{
   
}

Response StateEndpoint::HGET()
{
    using ordered_json = nlohmann::ordered_json;

    ordered_json state;
    state["time"] = std::time(nullptr);

    state["economy"] = {{"income", 1200}, {"expenses", 800}};

    return {state.dump(4), "200 OK"}; 
}

Response StateEndpoint::HPOST()
{
    return {"Not implemented yet","StateEP"};
}
Response StateEndpoint::HPUT()
{
    return {"Not implemented yet","StateEP"};
}
Response StateEndpoint::HDELETE()
{
    return {"Not implemented yet","StateEP"};
}

