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