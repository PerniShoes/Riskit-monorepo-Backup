#include "Player.hpp"
#include <vector>

// pragma once

class GameState
{

    // Have one GameState instance in main.cpp and then pass it by reference everywhere needed (main->server->endpoints)
    // Split into hpp and cpp files
    // Have classes/structs for player/map etc. be seperate files and just store them here
    // Include GameState in cpp files of those, store GameState& there (through constructor)
    // 
    // Have something like this:  PlayerFunctions Player{*this}; allowing for "namespace like" behaviour, not showing everything all the time
    // EndPoints will just have GameState included and stored and will be able to access shit like: m_State.PlayerF.Add(id);

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
    std::vector<Player> players;
    std::map<int,int> fieldOwner;

    // Expose namespaces-like access
    PlayerFunctions Player{*this};
    MapFunctions Map{*this};
};
