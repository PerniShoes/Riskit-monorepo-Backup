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
    if (id > int(m_Territories.size()))
    {
        return nullptr;
    }
    return &m_Territories[id-1];
}

std::vector<Territory> MapManager::GetAllTerritories() const
{
    return m_Territories;
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
        if (m_Territories[tid].ownerId != playerId)
        {
            return false;
        }
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
        if (m_Territories[tid].ownerId != playerId)
        {
            return false;
        }
    }
    return true;
}
bool MapManager::AreNeighbors(int territoryA,int territoryB) const
{
    
    // Not done yet
    // return it->second.neighbors.count(territoryB) > 0;
    return false;
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
int MapManager::GetBuildingLevel(int territoryId) 
{
  

    // Buildings not supported yet
   // return m_Territories[territoryId].buildings["name"];
    return -1;
}

void MapManager::LoadFromJson(const nlohmann::ordered_json& jsonInput)
{

    m_Territories;
    if (jsonInput.contains("territories") && jsonInput["territories"].is_array())
    {
        for (auto& territority : jsonInput["territories"])
        {
            m_Territories.push_back(TerritoryFromJson(territority));
        }
    }

 
    
   // m_Continents;


 /*   m_Regions;
    if (jsonInput.contains("continentsControlled") && jsonInput["continentsControlled"].is_array())
    {
        p.continentsControlled = jsonInput["continentsControlled"].get<std::vector<std::string>>();
    }*/


}

Territory MapManager::TerritoryFromJson(const nlohmann::ordered_json& jsonInput)
{

    Territory temp;
    temp.id = jsonInput.value("id",-1);                 // -1 missing ID
    temp.name = jsonInput.value("name","Unknown");
    temp.ownerId = jsonInput.value("ownerId",-1);
    temp.armies = jsonInput.value("armies",-1);
    temp.continent = jsonInput.value("continent","Unknown");
    temp.region = jsonInput.value("region","Unknown");

    if (jsonInput.contains("neighbors") && jsonInput["neighbors"].is_array())
    {
        for (auto& neighborsId : jsonInput["neighbors"])
        {
            temp.neighbors.push_back(neighborsId.get<int>());
        }
    }

    return temp;
}

nlohmann::ordered_json MapManager::TerritoryToJson(Territory target)
{
    nlohmann::ordered_json temp;

    temp["id"] = target.id;
    temp["name"] = target.name;
    temp["ownerId"] = target.ownerId;
    temp["armies"] = target.armies;
    temp["continent"] = target.continent;
    temp["region"] = target.region;
    temp["neighbors"] = target.neighbors;

    return temp;

}
nlohmann::ordered_json MapManager::MapToJson()
{

    nlohmann::ordered_json temp;

    for (auto& territory : m_Territories)
    {
        temp["territories"].push_back(TerritoryToJson(territory));
    }

    //temp["name"] = m_Continents;
    //temp["ownerId"] = m_Regions;
 
    return temp;

}