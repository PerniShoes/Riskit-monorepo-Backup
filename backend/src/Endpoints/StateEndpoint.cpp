#include "StateEndpoint.hpp"
#include <ctime>
#include <cstdlib>
#include <nlohmann/json.hpp>
#include <iostream>
#include <print>
#include "SystemsManagerDB.hpp"

StateEndpoint::StateEndpoint()
    : EndpointBase("/api/state/:phase?")
{

 
}

Response StateEndpoint::HGET()
{
    // Get the whole GameState
    using ordered_json = nlohmann::ordered_json;

    ordered_json state = systemsPtr->StateM->StateToJson();

    return {state.dump(4), "200 OK"}; 
}

Response StateEndpoint::HPOST()
{
    // Override whole GameState (on initialization)
    systemsPtr->StateM->LoadFromJson(m_Request.json());


    return Response{systemsPtr->StateM->StateToJson().dump(4) ,"200 OK"};
}
Response StateEndpoint::HPUT()
{
    // New activity (like draft, attack, fortify...)

    using ordered_json = nlohmann::ordered_json;

    std::string phaseStr = ExtractParam("phase");
  
    ordered_json responseJson;
    responseJson["phase"] = phaseStr;
    // Errors
    if (phaseStr == "-1")
    {
        responseJson["Error"] = "Didn't find a optional param";
    }
    else if (phaseStr == "-2")
    {
        responseJson["Error"] = "Didn't find the required param (id)";
    } 
    else if (phaseStr == "-3")
    {
        responseJson["Error"] = "Didn't find any param";
    }
    //
    // Found phase param
    else if (phaseStr == "draft")
    {
        responseJson["Draft_Results"] = "Not implemented yet";
    }
    else if (phaseStr == "attack")
    {
        responseJson["Attack_Results"] = systemsPtr->StateM->HandleAttack(m_Request.json());
    }
    else if (phaseStr == "fortify")
    {
        responseJson["Fortify_Results"] = "Not implemented yet";
    }
    else 
    {
        responseJson["Error"] = "Param found, but no matching phase found";
    }
    //
    return Response{responseJson.dump(4), "200 OK"};
}
Response StateEndpoint::HDELETE()
{
    return {"Not implemented yet","StateEP"};
}

