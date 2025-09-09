#include "PlayerEndpoint.hpp"
#include <nlohmann/json.hpp>

PlayerEndpoint::PlayerEndpoint()
   :EndpointBase("GET","/api/player/:id")
{


}

Response PlayerEndpoint::Handle() 
{
    using ordered_json = nlohmann::ordered_json;

    // Extract "id" directly from the stored matched path and pattern
    std::string idStr = ExtractParam("id");
    int id = 0;
    try { id = std::stoi(idStr); }
    catch (...) { id = 0; }

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


std::string PlayerEndpoint::ExtractParam(const std::string& name) 
{
    auto pathParts = Split(m_Method,'/');
    auto patternParts = Split(m_PathPattern,'/');

    for (size_t i = 0; i < patternParts.size(); ++i)
    {
        if (patternParts[i] == ":" + name)
            return pathParts[i];
    }

    return "";
}

