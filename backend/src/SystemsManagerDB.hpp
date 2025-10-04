#pragma once
#include <memory>

#include "MapManager.hpp"
#include "StateManager.hpp"
#include "PlayerManager.hpp"


class SystemsManagerDB final
{

public:

    SystemsManagerDB();
    ~SystemsManagerDB();


    std::unique_ptr<MapManager> MapM;
    std::unique_ptr<PlayerManager> PlayerM;
    std::unique_ptr<StateManager> StateM;

private:

    void InitSystems();
    void Close();



};