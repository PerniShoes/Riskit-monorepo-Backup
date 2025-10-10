#include "MapManager.hpp"
#include "SystemsManagerDB.hpp"
#include <print>
#include <algorithm>

MapManager::MapManager(SystemsManagerDB& systemsManager)
    : m_SystemsManager(systemsManager)
{

}

MapManager::~MapManager()
{

}



void MapManager::AddTerritory(const Territory& territory)
{
    m_Territories[territory.id] = territory;
}

Territory* MapManager::GetTerritory(int id)
{
    auto it = m_Territories.find(id);
    if (it != m_Territories.end())
        return &it->second;
    return nullptr;
}

std::unordered_map<int,Territory>& MapManager::GetAllTerritories() const
{
    return const_cast<std::unordered_map<int,Territory>&>(m_Territories);
}

void MapManager::AddContinent(const Continent& continent)
{
    m_Continents[continent.name] = continent;
}

const std::unordered_map<std::string,Continent>& MapManager::GetAllContinents() const
{
    return m_Continents;
}

bool MapManager::IsContinentControlled(int playerId,const std::string& continent) const
{
    auto it = m_Continents.find(continent);
    if (it == m_Continents.end()) return false;

    const Continent& c = it->second;
    for (int tid : c.territoryIds)
    {
        auto tIt = m_Territories.find(tid);
        if (tIt == m_Territories.end() || tIt->second.ownerId != playerId)
            return false;
    }
    return true;
}
void MapManager::AddRegion(const Region& region)
{
    m_Regions[region.name] = region;
}
const std::unordered_map<std::string,Region>& MapManager::GetAllRegions() const
{
    return m_Regions;
}
bool MapManager::IsRegionControlled(int playerId,const std::string& region) const
{
    auto it = m_Regions.find(region);
    if (it == m_Regions.end()) return false;

    const Region& r = it->second;
    for (int tid : r.territoryIds)
    {
        auto tIt = m_Territories.find(tid);
        if (tIt == m_Territories.end() || tIt->second.ownerId != playerId)
            return false;
    }
    return true;
}
bool MapManager::AreNeighbors(int territoryA,int territoryB) const
{
    auto it = m_Territories.find(territoryA);
    if (it == m_Territories.end()) return false;
    return it->second.neighbors.count(territoryB) > 0;
}

int MapManager::CalculateBonusForPlayer(int playerId) const
{
    int bonus = 0;

    // Continents
    for (const auto& [name,continent] : m_Continents)
    {
        if (IsContinentControlled(playerId,name))
            bonus += continent.bonusArmies;
    }

    // Regions
    for (const auto& [name,region] : m_Regions)
    {
        if (IsRegionControlled(playerId,name))
            bonus += region.bonusArmies;
    }
    return bonus;
}

void MapManager::UpgradeBuilding(int territoryId,std::string buildingType)
{
    Territory* t = GetTerritory(territoryId);
    if (!t) return;

    t->buildings[buildingType] += 1;
}
int MapManager::GetBuildingLevel(int territoryId) const
{
    auto it = m_Territories.find(territoryId);
    if (it == m_Territories.end()) return 0;

    auto bIt = it->second.buildings.find("Fort");
    if (bIt == it->second.buildings.end()) return 0;

    return bIt->second;
}
