#include "PlayerEndpoint.hpp"
#include <nlohmann/json.hpp>
#include <iostream>
#include <print>
#include "SystemsManagerDB.hpp"

PlayerEndpoint::PlayerEndpoint()
    :EndpointBase("/api/player/:id?")
{
    // :EndpointBase("/api/player/:id?")
    // :EndpointBase("/api/player")
}

Response PlayerEndpoint::HGET()
{
    using ordered_json = nlohmann::ordered_json;

     std::string idStr = ExtractParam("id");
    int id = 0;
    try { id = std::stoi(idStr); }
    catch (...) { id = 0; }


    if (id < 0)
    {
        ordered_json responseJson;
        responseJson["id"] = id; 
        switch (id)
        {
        case -1:
            responseJson["Error"] = "Did you call /api/player GET??? (no id)";
            break;
        case -2:
            responseJson["Error"] = "Didn't find the required param (id)";
            break;
        case -3:
            responseJson["Error"] = "Didn't find any param";
            break;
        default:
            responseJson["Error"] = "ID issue. Is it bellow 0?";
            break;
        }
        return Response{responseJson.dump(), "200 OK"};
    }

    // FIX (hardcoded id)
    if (id >= 1 && id <= systemsPtr->PlayerM->GetPlayerAmount())
    {
        ordered_json player;
        player = systemsPtr->PlayerM->GetPlayerJson(id,false);

        return Response{player.dump(4), "200 OK"};
    }
    else
    {
        ordered_json err = {{"error", "player_not_found"}, {"id", id}};
        return {err.dump(4), "404 Not Found"};
    } 
}

Response PlayerEndpoint::HPOST()
{
    systemsPtr->PlayerM->AddPlayer(m_Request.json());
   
    return Response{systemsPtr->PlayerM->GetPlayerJson(0,true).dump(),"201 Created"};
}
Response PlayerEndpoint::HPUT()
{
    return {"Not implemented yet","PlayerEP"};
}
Response PlayerEndpoint::HDELETE()
{
    return {"Not implemented yet","PlayerEP"};
}


