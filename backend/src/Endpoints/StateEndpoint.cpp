#include "StateEndpoint.hpp"
#include <ctime>
#include <cstdlib>
#include <nlohmann/json.hpp>
#include <iostream>
#include <print>
#include "SystemsManagerDB.hpp"

StateEndpoint::StateEndpoint()
    : EndpointBase("/api/state")
{

 
}

Response StateEndpoint::HGET()
{
    using ordered_json = nlohmann::ordered_json;

    ordered_json state;
    state["time"] = std::time(nullptr);
    state["players"] = ordered_json::array();

    // Don't allow 0 id
    for (int index{1}; index <= systemsPtr->PlayerM->GetPlayerAmount(); ++index)
    {
        state["players"].push_back(systemsPtr->PlayerM->GetPlayerJson(index,false));
    }
    state["economy"] = {{"income", 1200}, {"expenses", 800},{"Why are we still here", 800}, {"just to suffer", 800}};
    /*for (int i = 1; i <= 6; i++)
    {
        ordered_json player;
        player["id"] = i;
        player["name"] = "";
        player["color"] ="";
        player["gold"] = 700 + i * 100;
        player["army"] = {{"infantry", 100 * i}, {"tanks", 5 * i}};
        state["players"].push_back(player);
    }*/
   
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

