#pragma once
#include "AllEndpoints.hpp"
#include "Server.hpp"
#include "SystemsManagerDB.hpp"
#include "nlohmann/json.hpp"
#include "gtest/gtest.h"

class ServerTestFixture : public ::testing::Test
{
protected:
    SystemsManagerDB db{};
    Server server{8081, &db};
    std::vector<IEndpoint*> endpoints;

    // Pointers to endpoints for easy access in tests

    void SetUp() override
    {
        
        // Register all endpoints
        server.RegisterEndpoint(std::make_unique<PlayerEndpoint>());
        server.RegisterEndpoint(std::make_unique<StateEndpoint>());
        endpoints = server.GetEndpoints();
    }

    void TearDown() override
    {
        // Optional
    }

    // Helper to get endpoint by type
    template<typename T>
    T* GetEndpoint()
    {
        for (auto ep : endpoints)
        {
            if (auto casted = dynamic_cast<T*>(ep))
                return casted;
        }
        return nullptr;  // No match
    }

    // Helper to reduce repetetivnes 
    template<typename T>
    nlohmann::json HandleRequest(const Request& req)
    {
        T* ep = GetEndpoint<T>();
        EXPECT_NE(ep,nullptr) << "Endpoint not found";
        if (!ep) return {};  // prevents returning void to json
        Response resp = ep->HandleMethod(req);
        return nlohmann::json::parse(resp.body);
    }

    void AddPlayer(PlayerEndpoint* ep,int id,const std::string& name)
    {
        Request req{"POST", "/api/player",
            R"({"id":)" + std::to_string(id) + R"(,"name":")" + name + R"(","color":"red","gold":100,"army":{"infantry":50,"tanks":5}})"};
        ep->HandleMethod(req);
    }
};

#include <print>
inline void PrintResp(const nlohmann::json& jsonResp)
{
    std::println("JsonResp:\n {}",jsonResp.dump(4));
}