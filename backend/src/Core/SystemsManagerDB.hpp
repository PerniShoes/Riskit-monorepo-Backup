#pragma once
#include <memory>

#include "MapManager.hpp"
#include "StateManager.hpp"
#include "PlayerManager.hpp"


class SystemsManagerDB final
{

public:

    // FIX, rule of 5/6 here and in all managers
    SystemsManagerDB();
    ~SystemsManagerDB();


    std::unique_ptr<MapManager> MapM;
    std::unique_ptr<PlayerManager> PlayerM;
    std::unique_ptr<StateManager> StateM;

private:

    void InitSystems();
    void Close();



};