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
    
    void AddPlayer(const nlohmann::ordered_json& newPlayer);
    Player GetPlayerData(int id, bool lastPlayerAdded = false) const;
    const nlohmann::ordered_json GetPlayerJson(int id,bool lastPlayerAdded = false) const;
    int GetPlayerAmount()const;
    bool IsValidPlayerId(int id) const;

    Player FromJson(const nlohmann::ordered_json& jsonInput);


private:

    SystemsManagerDB& m_SystemsManager;
    std::vector<Player> m_Players;


};