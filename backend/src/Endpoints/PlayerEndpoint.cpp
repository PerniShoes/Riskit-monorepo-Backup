#include "PlayerEndpoint.hpp"
#include <nlohmann/json.hpp>
#include <iostream>
#include <print>
#include "SystemsManagerDB.hpp"

PlayerEndpoint::PlayerEndpoint()
   :EndpointBase("/api/player/:id")
{


}

Response PlayerEndpoint::HGET()
{
    using ordered_json = nlohmann::ordered_json;

    // Extract "id" from the path
    std::string idStr = ExtractParam("id");
    int id = 0;
    try { id = std::stoi(idStr); }
    catch (...) { id = 0; }

    Player test{}; // TEST
    systemsPtr->PlayerM->AddPlayer(test);
    
    // FIX (hardcoded id)
    if (id >= 1 && id <= 3)
    {
        ordered_json player;
        player["id"] = id;
        player["name"] = "Player" + std::to_string(id);
        player["gold"] = 700 + id * 100;
        player["army"] = {{"infantry", 100 * id}, {"tanks", 5 * id}};

        return {player.dump(4), "200 OK"};
    }
    else
    {
        ordered_json err = {{"error", "player_not_found"}};
        return {err.dump(4), "404 Not Found"};
    } 
}

Response PlayerEndpoint::HPOST()
{




    return {"Not implemented yet","PlayerEP"};
}
Response PlayerEndpoint::HPUT()
{
    return {"Not implemented yet","PlayerEP"};
}
Response PlayerEndpoint::HDELETE()
{
    return {"Not implemented yet","PlayerEP"};
}


