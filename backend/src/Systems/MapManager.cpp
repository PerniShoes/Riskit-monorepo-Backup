#include "MapManager.hpp"
#include "SystemsManagerDB.hpp"

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
