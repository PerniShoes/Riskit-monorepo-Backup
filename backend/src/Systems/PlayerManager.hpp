#pragma once
#include <vector>
#include <nlohmann/json.hpp>

class SystemsManagerDB;
struct Player;

class PlayerManager final
{

public:

    PlayerManager(SystemsManagerDB& systemsManager);
    ~PlayerManager();
    
    void AddPlayer(const nlohmann::json& newPlayer);
    Player GetPlayerData(int id, bool lastPlayerAdded = false) const;
    const nlohmann::json GetPlayerJson(int id,bool lastPlayerAdded = false) const;
    int GetPlayerAmount()const;

    Player FromJson(const nlohmann::json& jsonInput);


private:

    SystemsManagerDB& m_SystemsManager;
    std::vector<Player> m_Players;


};