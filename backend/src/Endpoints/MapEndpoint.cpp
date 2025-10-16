#include "MapEndpoint.hpp"
#include <ctime>
#include <cstdlib>
#include <nlohmann/json.hpp>
#include <iostream>
#include <print>
#include "SystemsManagerDB.hpp"

MapEndpoint::MapEndpoint()
    : EndpointBase("/api/map/:id?")
{


}

Response MapEndpoint::HGET()
{
    using ordered_json = nlohmann::ordered_json;

    std::string idStr = ExtractParam("id");
    int id = 0;
    try { id = std::stoi(idStr); }
    catch (...) { id = 0; }


    if (id < -1)
    {
        ordered_json responseJson;
        responseJson["id"] = id;
        switch (id)
        {
        case -2:
            responseJson["Error"] = "Didn't find the required param (id)";
            break;
        case -3:
            responseJson["Error"] = "Didn't find any param";
            break;
        default:
            responseJson["Error"] = "ID issue. Is it bellow 0?";
            break;
        }
        return Response{responseJson.dump(), "200 OK"};
    }

    // GET without id
    if (id == -1)
    {
        ordered_json map;
        map = systemsPtr->MapM->MapToJson();

        return Response{map.dump(4),"200 OK"};
    }

    // Make it possible to read a certain territory
    // 
    // ???multiple optionals to be able to access by territory or continent or region???

    ordered_json err = {{"error", "map functionality missing, or error"}, {"id", id}};
    return {err.dump(4), "404 Not Found"};

}

Response MapEndpoint::HPOST()
{
    systemsPtr->MapM->LoadFromJson(m_Request.json());

    nlohmann::ordered_json resp;
    resp["Message"] = "Map load worked";

    return Response{resp.dump(4),"200 OK"};
}
Response MapEndpoint::HPUT()
{

    return Response{"Not implemented yet","MapEP"};
}
Response MapEndpoint::HDELETE()
{
    return {"Not implemented yet","MapEP"};
}

