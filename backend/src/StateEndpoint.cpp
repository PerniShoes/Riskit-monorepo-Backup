#include "StateEndpoint.hpp"
#include <ctime>
#include <cstdlib>
#include <nlohmann/json.hpp>

StateEndpoint::StateEndpoint()
    : EndpointBase("GET","/api/state")
{
   
}

Response StateEndpoint::Handle()
{
    using ordered_json = nlohmann::ordered_json;

    ordered_json state;
    state["time"] = std::time(nullptr);

    // Players array
    for (int i = 1; i <= 3; ++i)
    {
        ordered_json player;
        player["id"] = i;
        player["name"] = "Player" + std::to_string(i);
        player["gold"] = 500 + (std::rand() % 2000);
        player["army"] = {
            {"infantry", 50 + (std::rand() % 300)},
            {"tanks", std::rand() % 20}
        };
        state["players"].push_back(player);
    }

    state["economy"] = {{"income", 1200}, {"expenses", 800}};

    return {state.dump(4), "200 OK"}; 
}
