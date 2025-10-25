#pragma once
#include "ServerTestFixture.hpp"   

TEST_F(ServerTestFixture,POST_StateEndpoint_ValidData)
{
    auto* ep = GetEndpoint<StateEndpoint>();
    ASSERT_NE(ep,nullptr);


    nlohmann::ordered_json state;
    state["turn"] = 0;
    state["currentPlayerId"] = 1;
    state["phase"] = "Setup";
    
    Request req{"POST", "/api/state", state.dump()};
    Response resp = ep->HandleMethod(req);

    auto jsonResp = nlohmann::ordered_json::parse(resp.body);
    //PrintResp(jsonResp);
    EXPECT_EQ(jsonResp["turn"],0);
    EXPECT_EQ(jsonResp["phase"],"Setup");
    EXPECT_EQ(jsonResp["currentPlayerId"],1);
    // Also returns players

}