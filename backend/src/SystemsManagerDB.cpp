#include "SystemsManagerDB.hpp"

#include <iostream>
#include <print>

SystemsManagerDB::SystemsManagerDB()

{
    InitSystems();
     


}

SystemsManagerDB::~SystemsManagerDB()
{
    Close();

}

void SystemsManagerDB::InitSystems()
{
    MapM = std::make_unique<MapManager>(*this);
    PlayerM = std::make_unique<PlayerManager>(*this);
    StateM = std::make_unique<StateManager>(*this);
    


}
void SystemsManagerDB::Close()
{

}

void SystemsManagerDB::TestGround()
{
 

    PlayerM->AddPlayer({});

  

    std::println("{}",PlayerM->GetPlayerAmount());
}