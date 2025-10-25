#pragma once
#include <chrono>
#include <vector>
#include <nlohmann/json.hpp>
#include <map>
#include <string>
#include <boost/bimap.hpp>

enum class GamePhase
{
    Undefined = 0,
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

    nlohmann::ordered_json HandleAttack(const nlohmann::ordered_json& jsonInput);

    void LoadFromJson(const nlohmann::ordered_json& jsonInput);
    nlohmann::ordered_json StateToJson();

private:

    SystemsManagerDB& m_SystemsManager;

    // Some basics

    int m_CurrentTurn;
    int m_CurrentPlayerId;
    GamePhase m_CurrentPhase;
    bool m_GameStarted;
    bool m_GameOver;
    int m_WinnerId;
    boost::bimap<GamePhase,std::string> m_PhaseString;

    // More advanced
    // std::chrono::system_clock::time_point lastActionTime;
    // std::vector<ActionLog> history;

};