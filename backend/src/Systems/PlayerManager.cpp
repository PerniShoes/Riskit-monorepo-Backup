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

void PlayerManager::AddPlayer(const nlohmann::ordered_json& newPlayer)
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

    return m_Players[id-1]; // (Since it's 0-indexed)(0 id is not passable)
}
const nlohmann::ordered_json  PlayerManager::GetPlayerJson(int id,bool lastPlayerAdded) const
{
    if (lastPlayerAdded)
    {
        return m_Players.back().ToJson();
    }
    return m_Players[id-1].ToJson();  // (Since it's 0-indexed)(0 id is not passable)
}

Player PlayerManager::FromJson(const nlohmann::ordered_json& jsonInput)
{
    Player p;

    p.id = jsonInput.value("id",-1);                 // -1 missing ID
    p.name = jsonInput.value("name","Unknown");
    p.color = jsonInput.value("color","#000000");
    p.gold = jsonInput.value("gold",0);

    // Army: map<string,int>
    if (jsonInput.contains("army") && jsonInput["army"].is_object())
    {
        for (auto& [unit,count] : jsonInput["army"].items())
        {
            p.army[unit] = count.get<int>();
        }
    }

    p.territoriesCount = jsonInput.value("territoriesCount",0); // default to 0

    if (jsonInput.contains("continentsControlled") && jsonInput["continentsControlled"].is_array())
    {
        p.continentsControlled = jsonInput["continentsControlled"].get<std::vector<std::string>>();
    }

    return p;
}
bool PlayerManager::IsValidPlayerId(int id) const
{
    for (const auto& player : m_Players)
    {
        if (player.id == id) return true;
    }
    return false;
}
