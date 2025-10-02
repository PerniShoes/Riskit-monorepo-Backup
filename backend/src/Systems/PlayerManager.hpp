#pragma once
//#include "SystemsManagerDB.hpp"
#include <vector>
#include "Player.hpp"

class SystemsManagerDB;

class PlayerManager final
{

public:

    PlayerManager(SystemsManagerDB& systemsManager);
    ~PlayerManager();
    
    void AddPlayer(Player newPlayer);
    int GetPlayerAmount()const;


private:

    SystemsManagerDB& m_SystemsManager;
    std::vector<Player> m_Players;


};