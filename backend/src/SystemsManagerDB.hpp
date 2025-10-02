#pragma once
#include "Player.hpp"
#include <memory>

#include "MapManager.hpp"
#include "StateManager.hpp"
#include "PlayerManager.hpp"

//class PlayerManager;
//class MapManager;
//class StateManager;

class SystemsManagerDB final
{

public:

    SystemsManagerDB();
    ~SystemsManagerDB();

    void TestGround();
  
    std::unique_ptr<MapManager> MapM;
    std::unique_ptr<PlayerManager> PlayerM;
    std::unique_ptr<StateManager> StateM;

private:

    void InitSystems();
    void Close();



};