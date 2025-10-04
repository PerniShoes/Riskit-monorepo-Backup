#include "MapManager.hpp"
#include "SystemsManagerDB.hpp"
#include <print>

MapManager::MapManager(SystemsManagerDB& systemsManager)
    :m_SystemsManager{systemsManager}
    ,m_FieldsAmount{69}
{




}

MapManager::~MapManager()
{


}

int MapManager::GetFieldsAmount()const
{
    return m_FieldsAmount;
}

void MapManager::ParsePrintPlayers(int playerCount)
{
    std::println("PLayers count in map:{}",playerCount);
}