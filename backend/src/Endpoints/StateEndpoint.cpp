#include "StateEndpoint.hpp"
#include <ctime>
#include <cstdlib>
#include <nlohmann/json.hpp>
#include <iostream>
#include <print>

StateEndpoint::StateEndpoint()
    : EndpointBase("/api/state")
{

 
}

Response StateEndpoint::HGET()
{
    using ordered_json = nlohmann::ordered_json;

    ordered_json state;
    state["time"] = std::time(nullptr);
    
    // Add players array as expected by frontend
    state["players"] = ordered_json::array();
    
    // Test values
    std::vector<std::string> colors = {"#ff4444", "#44ff44", "#4444ff","#44f4ff","#f444ff","#f44fff"};
    std::vector<std::string> names = {"Czerwony", "Zielony", "Niebieski","Niski","Neski","Jabadabadu"};
    
    for(int i = 1; i <= 6; i++) {
        ordered_json player;
        player["id"] = i;
        player["name"] = names[i-1];
        player["color"] = colors[i-1];
        player["gold"] = 700 + i * 100;
        player["army"] = {{"infantry", 100 * i}, {"tanks", 5 * i}};
        state["players"].push_back(player);
    }

    // Didn't work
    // Might need valid information, instead of just name

    
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

