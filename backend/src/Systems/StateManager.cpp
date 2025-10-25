#include "StateManager.hpp"
#include "SystemsManagerDB.hpp"
#include "JsonHelpers.hpp"

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
    using namespace JsonHelp;
    using namespace std;

    m_CurrentTurn = SafeGet<int>(jsonInput,"turn",-1);
    std::string temp = SafeGet<string>(jsonInput,"phase","Undefined");
    m_CurrentPhase = m_PhaseString.right.at(temp);
    m_CurrentPlayerId = SafeGet<int>(jsonInput,"currentPlayerId",-1);
    
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

nlohmann::ordered_json StateManager::HandleAttack(const nlohmann::ordered_json& jsonInput)
{
    nlohmann::ordered_json attackResults;

    if (jsonInput.contains("attacks") && jsonInput["attacks"].is_array())
    {
        for (auto& attackObject : jsonInput["attacks"])
        {
            // Calculate outcome
            AttackResult temp =
            m_SystemsManager.MapM->TryAttack(attackObject.value("from","Empty")
                ,attackObject.value("to","Empty")
                ,attackObject.value("armies",0));

            // Store new armies/owners
            Territory* attackingTerritory = m_SystemsManager.MapM->GetTerritory(attackObject.at("from"));
            Territory* defendingTerritory = m_SystemsManager.MapM->GetTerritory(attackObject.at("to"));
            if (temp.result == "Attacker nullptr" || temp.result == "Defender nullptr")
            {
               
            }
            else if (temp.result == "Can't attack")
            {

            }
            else if (temp.result == "Success")
            {
                attackingTerritory->armies -= attackObject.at("armies").get<int>();
                defendingTerritory->armies = temp.attackingArmiesLeft;
                defendingTerritory->ownerId = attackingTerritory->ownerId;

            }
            else if (temp.result == "Fail")
            {
                attackingTerritory->armies -= attackObject.at("armies").get<int>() + temp.attackingArmiesLeft;
                defendingTerritory->armies = temp.defendingArmiesLeft;
            }

            // Add to return
            attackResults["Results"].push_back(temp.Json());
        }
    }
    else
    {
        attackResults["Error"] = "JsonInput didn't have  attacks  or  attacks  wasn't an array";
        return attackResults;
    }

    return attackResults;
}