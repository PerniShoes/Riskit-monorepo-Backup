#pragma once
#include <string>
#include <map>
#include <nlohmann/json.hpp>

struct Player
{
    int id{-1};
    std::string name{"None"};
    std::string color{"None"};
    int gold{-1};

    // army as a map of unit -> count
    std::map<std::string,int> army;

    int territoriesCount{-1};
    std::vector<std::string> continentsControlled;

    const nlohmann::json ToJson() const
    {
        nlohmann::json jsonPlayer = nlohmann::json{
        {"id", id},
        {"name", name},
        {"color", color},
        {"gold", gold},
        {"army", army},
        {"territoriesCount", territoriesCount},
        {"continentsControlled", continentsControlled}
        };

        return jsonPlayer;
    }

};