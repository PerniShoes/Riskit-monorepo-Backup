#pragma once
#include <string>
#include <vector>
#include <unordered_map>
#include <unordered_set>
#include <random>
#include <map>
#include <nlohmann/json.hpp>

struct AttackResult
{
    std::string result{};
    int attackingArmiesLeft{};
    int defendingArmiesLeft{};

    nlohmann::ordered_json Json()
    {
        nlohmann::ordered_json temp;
        temp["result"] = result;
        temp["attackingArmiesLeft"] = attackingArmiesLeft;
        temp["defendingArmiesLeft"] = defendingArmiesLeft;
        return temp;
    }
};

struct Territory
{
    int id{-1};
    std::string name;
    int ownerId{-1};
    int armies{0};
    std::vector<int> neighbors; 
    std::string continent;
    std::string region;     

    // Buildings not supported yet
    // Name and Level/amount
    std::map<std::string,int> buildings;

};

struct Continent
{
    std::string name;
    std::vector<int> territoryIds; // Using names not id
    int bonusArmies{0};
};

struct Region
{
    std::string name;
    std::vector<int> territoryIds; // Using names not id
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
    Territory* GetTerritory(std::string name);
    std::map<std::string,Territory> GetAllTerritories() const;
    AttackResult TryAttack(std::string attackerName,std::string defenderName, int attackingArmies);


    // Continent
    void AddContinent(const Continent& continent);
    const std::unordered_map<std::string,Continent>& GetAllContinents() const;
    //bool IsContinentControlled(int playerId,const std::string& continent) const;

    // Region 
    void AddRegion(const Region& region);
    const std::unordered_map<std::string,Region>& GetAllRegions() const;
    //bool IsRegionControlled(int playerId,const std::string& region) const;

    bool AreNeighbors(std::string territoryA,std::string territoryB) const;
    int CalculateBonusForPlayer(int playerId) const;

    // Buildings
    void UpgradeBuilding(int territoryId, std::string buildingType);
    int GetBuildingLevel(int territoryId);

    Territory TerritoryFromJson(const nlohmann::ordered_json& jsonInput);
    //Region RegionFromJson(const nlohmann::ordered_json& jsonInput);
    //Continent ContinetnFromJson(const nlohmann::ordered_json& jsonInput);

    nlohmann::ordered_json TerritoryToJson(Territory target);
    //nlohmann::ordered_json RegionToJson();
    //nlohmann::ordered_json ContinetnToJson();



    void LoadFromJson(const nlohmann::ordered_json& jsonInput);
    nlohmann::ordered_json MapToJson();

private:

    SystemsManagerDB& m_SystemsManager;

    std::map<std::string,Territory> m_Territories;
    std::unordered_map<std::string,Continent> m_Continents;
    std::unordered_map<std::string,Region> m_Regions;
};
