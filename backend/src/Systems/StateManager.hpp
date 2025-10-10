#pragma once
#include <chrono>
#include <vector>


enum class GamePhase
{
    Setup,
    Reinforcement,
    Attack,
    Fortify,
    GameOver
};

class SystemsManagerDB;
class StateManager final
{

public:

    StateManager(SystemsManagerDB& systemsManager);
    ~StateManager();

    void InitialSetup();



    int GetPlayerId() const;
    int GetTurn() const;
    GamePhase GetPhase() const;
    int GetWinnerId() const;
    bool GetGameStarted() const; 

private:

    SystemsManagerDB& m_SystemsManager;

    // Some basics

    int m_CurrentTurn;
    int m_CurrentPlayerId;
    GamePhase m_CurrentPhase;
    bool m_GameStarted;
    bool m_GameOver;
    int m_WinnerId;

    // More advanced
    // std::chrono::system_clock::time_point lastActionTime;
    // std::vector<ActionLog> history;


};