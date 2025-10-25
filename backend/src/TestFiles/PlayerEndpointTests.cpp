#pragma once
#include "ServerTestFixture.hpp"   

TEST_F(ServerTestFixture,GET_LastPlayer_NoID)
{
    auto* ep = GetEndpoint<PlayerEndpoint>();
    ASSERT_NE(ep,nullptr);

    AddPlayer(ep,1,"Alice");
    AddPlayer(ep,2,"Bob");

    Request req{"GET", "/api/player", ""}; // No id
    Response resp = ep->HandleMethod(req);

    auto jsonResp = nlohmann::ordered_json::parse(resp.body);
    EXPECT_TRUE(jsonResp.contains("Error"));
    EXPECT_EQ(jsonResp["Error"],"Did you call /api/player GET??? (no id)");
    EXPECT_EQ(resp.status,"200 OK");
}

TEST_F(ServerTestFixture,GET_PlayerByID_Exists)
{
    auto* ep = GetEndpoint<PlayerEndpoint>();
    ASSERT_NE(ep,nullptr);

    AddPlayer(ep,1,"Alice");
    AddPlayer(ep,2,"Bob");

    Request req{"GET", "/api/player/1", ""};
    Response resp = ep->HandleMethod(req);

    auto jsonResp = nlohmann::ordered_json::parse(resp.body);
    // PrintResp(jsonResp);
    EXPECT_EQ(jsonResp["id"],1);
    EXPECT_EQ(jsonResp["name"],"Alice");
}

TEST_F(ServerTestFixture,GET_PlayerByID_NotExists)
{
    auto* ep = GetEndpoint<PlayerEndpoint>();
    ASSERT_NE(ep,nullptr);

    AddPlayer(ep,1,"Alice");

    Request req{"GET", "/api/player/999", ""}; // non-existent id
    Response resp = ep->HandleMethod(req);

    EXPECT_EQ(resp.status,"404 Not Found"); 
}