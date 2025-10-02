#include "PlayerManager.hpp"
#include <iostream>
#include <print>
#include "SystemsManagerDB.hpp"


PlayerManager::PlayerManager(SystemsManagerDB& systemsManager)
    :m_SystemsManager{systemsManager}
{


}

PlayerManager::~PlayerManager()
{


}

void PlayerManager::AddPlayer(Player newPlayer)
{
    m_Players.push_back(newPlayer);
    

}
int PlayerManager::GetPlayerAmount()const
{
    return int(m_Players.size());
}
