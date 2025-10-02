#pragma once
#include <string>
#include <map>

struct Player
{
    int id;
    std::string name;
    std::string color;
    int gold;
    std::map<std::string,int> army; // {"infantry": 100, "tanks": 5}

    // FIX
    // add things like income 
    
    //void setArmyUnit(const std::string& unit,int count)
    //{
    //    army[unit] = count;
    //}


};
