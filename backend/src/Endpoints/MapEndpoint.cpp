#include "MapEndpoint.hpp"
#include <ctime>
#include <cstdlib>
#include <nlohmann/json.hpp>
#include <iostream>
#include <print>
#include "SystemsManagerDB.hpp"

MapEndpoint::MapEndpoint()
    : EndpointBase("/api/map/:id?")
{


}

Response MapEndpoint::HGET()
{
    using ordered_json = nlohmann::ordered_json;

    ordered_json state;
    state["time"] = std::time(nullptr);


    return {state.dump(4), "200 OK"};
}

Response MapEndpoint::HPOST()
{
    return {"Not implemented yet","StateEP"};
}
Response MapEndpoint::HPUT()
{
    return {"Not implemented yet","StateEP"};
}
Response MapEndpoint::HDELETE()
{
    return {"Not implemented yet","StateEP"};
}

