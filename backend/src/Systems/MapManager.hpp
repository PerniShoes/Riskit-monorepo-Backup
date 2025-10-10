#pragma once
#include <string>
#include <vector>
#include <unordered_map>
#include <unordered_set>
#include <random>
#include <map>

struct Territory
{
    int id{-1};
    std::string name;
    int ownerId{-1};
    int armies{0};
    std::unordered_set<int> neighbors; 
    std::string continent;
    std::string region;     

    // Name and Level/amount
    std::map<std::string,int> buildings;

};

struct Continent
{
    std::string name;
    std::vector<int> territoryIds;
    int bonusArmies{0};
};

struct Region
{
    std::string name;
    std::vector<int> territoryIds;
    int bonusArmies{0};
};

class SystemsManagerDB;
class MapManager
{
public:

    MapManager(SystemsManagerDB& systemsManager);
    ~MapManager();

    // Territory
    void AddTerritory(const Territory& territory);
    Territory* GetTerritory(int id);
    std::unordered_map<int,Territory>& GetAllTerritories() const;

    // Continent
    void AddContinent(const Continent& continent);
    const std::unordered_map<std::string,Continent>& GetAllContinents() const;
    bool IsContinentControlled(int playerId,const std::string& continent) const;

    // Region 
    void AddRegion(const Region& region);
    const std::unordered_map<std::string,Region>& GetAllRegions() const;
    bool IsRegionControlled(int playerId,const std::string& region) const;

    bool AreNeighbors(int territoryA,int territoryB) const;
    int CalculateBonusForPlayer(int playerId) const;

    // Buildings
    void UpgradeBuilding(int territoryId, std::string buildingType);
    int GetBuildingLevel(int territoryId) const;

private:

    SystemsManagerDB& m_SystemsManager;

    std::unordered_map<int,Territory> m_Territories;
    std::unordered_map<std::string,Continent> m_Continents;
    std::unordered_map<std::string,Region> m_Regions;
};
