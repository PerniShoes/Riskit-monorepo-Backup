#pragma once
#include "ServerTestFixture.hpp"   

TEST_F(ServerTestFixture,POST_MapEndpoint_ValidData)
{
    auto* ep = GetEndpoint<MapEndpoint>();
    ASSERT_NE(ep,nullptr);


    nlohmann::ordered_json map;
    map["territories"] = {
        { {"id", "1"}, {"name", "Alaska"}, {"armies", 5}, {"ownerId", 1} },
        { {"id", "2"}, {"name", "Northwest Territory"}, {"armies", 3}, {"ownerId", 2} },
        { {"id", "3"}, {"name", "Ukraine"}, {"armies", 4}, {"ownerId", 1} },
        { {"id", "4"}, {"name", "Afghanistan"}, {"armies", 2}, {"ownerId", 2} },
        { {"id", "5"}, {"name", "Egypt"}, {"armies", 6}, {"ownerId", 3} },
        { {"id", "6"}, {"name", "East Africa"}, {"armies", 3}, {"ownerId", 3} }
    };

    Request req{"POST", "/api/map", map.dump()};
    Response resp = ep->HandleMethod(req);

    auto jsonResp = resp.body;
    PrintResp(jsonResp);
    auto jsonResp = resp.body;


}