#include "Player.hpp"
#include <vector>

// pragma once

class GameState
{

    // Have one GameState instance in main.cpp and then pass it by reference everywhere needed (main->server->endpoints)
    // Split into hpp and cpp files
    // Have classes/structs for player/map etc. be seperate files and just store them here
    // Just have PlayerManager class, MapManager class and so on. They will store all the data related to them and manipulate it
    // 
    // GameState will be a "SystemsManager" Pretty much.  In endpoint you could just call appropriate methods, e.g.: In playerEndPoint when some
    // player gets something, you could do: m_State.Players.UpdateIncome(id, amount); This seems best (no exposing everything, soooome more typing
    // but allows GameState to stay clean and neat 
    // 
    // 
    // 
    // Include GameState in cpp files of managers, store GameState& there (through constructor)
    // 

    // https://chatgpt.com/c/68dbf04c-f694-832a-bc87-b44273a26635 maybe some insight here (prolly not needed)


public:
    struct PlayerFunctions
    {
    private:
        GameState& state;

    public:
        PlayerFunctions(GameState& s) : state(s) {}

        void move(int playerId,int fieldId)
        {
            state.Map.captureField(playerId,fieldId);
        }

        Player& get(int playerId)
        {
            return state.players[playerId];
        }
    };



    struct MapFunctions
    {
    private:
        GameState& state;

    public:
        MapFunctions(GameState& s) : state(s) {}

        void captureField(int playerId,int fieldId)
        {
            state.fieldOwner[fieldId] = playerId;
            
        }

        int getOwner(int fieldId) const
        {
            auto it = state.fieldOwner.find(fieldId);
            return it != state.fieldOwner.end() ? it->second : -1;
        }
    };

    // Actual game data
    // WILL NOT BE HERE 
    std::vector<Player> players;
    std::map<int,int> fieldOwner;

    // Expose namespaces-like access
    PlayerFunctions Player{*this}; // Managers
    MapFunctions Map{*this};
};
