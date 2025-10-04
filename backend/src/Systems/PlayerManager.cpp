#include "PlayerManager.hpp"
#include <iostream>
#include <print>
#include "SystemsManagerDB.hpp"
#include "Player.hpp"

PlayerManager::PlayerManager(SystemsManagerDB& systemsManager)
    :m_SystemsManager{systemsManager}
{


}

PlayerManager::~PlayerManager()
{


}

void PlayerManager::AddPlayer(const nlohmann::json& newPlayer)
{

    m_Players.push_back(FromJson(newPlayer));
    
}
int PlayerManager::GetPlayerAmount()const
{
    return int(m_Players.size());
}
Player PlayerManager::GetPlayerData(int id, bool lastPlayerAdded) const
{
    if (lastPlayerAdded)
    {
        return m_Players.back();
    }

    return m_Players[id];
}
const nlohmann::json  PlayerManager::GetPlayerJson(int id,bool lastPlayerAdded) const
{
    if (lastPlayerAdded)
    {
        return m_Players.back().ToJson();
    }

    return m_Players[id].ToJson();
}

Player PlayerManager::FromJson(const nlohmann::json& jsonInput)
{
    Player p;

    // Simple fields
    p.id = jsonInput.at("id").get<int>();
    p.name = jsonInput.at("name").get<std::string>();
    p.color = jsonInput.at("color").get<std::string>();
    p.gold = jsonInput.at("gold").get<int>();

    // Army: map<string,int>
    if (jsonInput.contains("army") && jsonInput["army"].is_object())
    {
        for (auto& [unit,count] : jsonInput["army"].items())
        {
            p.army[unit] = count.get<int>();
        }
    }

    p.territoriesCount = jsonInput.value("territoriesCount",0); // default to 0 if missing

    if (jsonInput.contains("continentsControlled") && jsonInput["continentsControlled"].is_array())
    {
        p.continentsControlled = jsonInput["continentsControlled"].get<std::vector<std::string>>();
    }
    return p;
}
