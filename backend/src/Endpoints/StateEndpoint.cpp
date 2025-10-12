#include "StateEndpoint.hpp"
#include <ctime>
#include <cstdlib>
#include <nlohmann/json.hpp>
#include <iostream>
#include <print>
#include "SystemsManagerDB.hpp"

StateEndpoint::StateEndpoint()
    : EndpointBase("/api/state")
{

 
}

Response StateEndpoint::HGET()
{
    using ordered_json = nlohmann::ordered_json;

    ordered_json state = systemsPtr->StateM->StateToJson();

    return {state.dump(4), "200 OK"}; 
}

Response StateEndpoint::HPOST()
{
    systemsPtr->StateM->LoadFromJson(m_Request.json());


    return Response{systemsPtr->StateM->StateToJson().dump(4) ,"200 OK"};
}
Response StateEndpoint::HPUT()
{
    return {"Not implemented yet","StateEP"};
}
Response StateEndpoint::HDELETE()
{
    return {"Not implemented yet","StateEP"};
}

