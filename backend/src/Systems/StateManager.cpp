#include "StateManager.hpp"
#include "SystemsManagerDB.hpp"

StateManager::StateManager(SystemsManagerDB& systemsManager)
    :m_SystemsManager{systemsManager}
    ,m_CurrentTurn{0}
    ,m_CurrentPlayerId{-1}
    ,m_CurrentPhase{GamePhase::Setup}
    ,m_GameStarted{false}
    ,m_GameOver{false}
    ,m_WinnerId{-1}
{

    InitialSetup();

}

StateManager::~StateManager()
{

    
}


void StateManager::InitialSetup()
{
    using enum GamePhase;
    m_PhaseString.insert({Undefined, "Undefined"});
    m_PhaseString.insert({Setup, "Setup"});
    m_PhaseString.insert({Reinforcement, "Reinforcement"});
    m_PhaseString.insert({Attack, "Attack"});
    m_PhaseString.insert({Fortify, "Fortify"});
    m_PhaseString.insert({GameOver, "GameOver"});

}

int StateManager::GetPlayerId() const
{
    return m_CurrentPlayerId;
}
int StateManager::GetTurn() const
{
    return m_CurrentTurn;
}
GamePhase StateManager::GetPhase() const
{
    return m_CurrentPhase;
}
int StateManager::GetWinnerId() const
{
    return m_WinnerId;
}
bool StateManager::GetGameStarted() const
{
    return m_GameStarted;
}

void StateManager::LoadFromJson(const nlohmann::ordered_json& jsonInput)
{

    m_CurrentTurn = jsonInput.value("turn",-1);
    std::string temp = jsonInput.value("phase","Undefined");
    m_CurrentPhase = m_PhaseString.right.at(temp);
    m_CurrentPlayerId = jsonInput.value("currentPlayerId",-1);
    
}

nlohmann::ordered_json StateManager::StateToJson()
{
    if (m_PhaseString.left.find(m_CurrentPhase) == m_PhaseString.left.end())
    {
        m_CurrentPhase = GamePhase::Undefined;
    }
    nlohmann::ordered_json state = nlohmann::ordered_json{
      {"turn",  m_CurrentTurn},
      {"phase", m_PhaseString.left.at(m_CurrentPhase)},
      {"currentPlayerId", m_CurrentPlayerId},
    };

    // Don't allow 0 id
    for (int index{1}; index <= m_SystemsManager.PlayerM->GetPlayerAmount(); ++index)
    {
        state["players"].push_back(m_SystemsManager.PlayerM->GetPlayerJson(index,false));
    }

    return state;
};

