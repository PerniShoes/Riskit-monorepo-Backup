#include <iostream>
#include <string>
#include <thread>
#include <ctime>
#include <cstdlib>
#include <memory>

#include "AllEndpoints.hpp"
#include "Server.hpp"
#include "SystemsManagerDB.hpp"

// CAUTION: Each SystemsManagerDB object has their own, seperate systems. 
// ALSO: Using multiple Managers was NOT tested (Will probably work)
SystemsManagerDB g_SystemsManger{};

int main()
{

    Server server(8081,&g_SystemsManger);

    server.RegisterEndpoint(std::make_unique<PlayerEndpoint>());
    server.RegisterEndpoint(std::make_unique<StateEndpoint>());
    server.RegisterEndpoint(std::make_unique<HealthEndpoint>());
    server.RegisterEndpoint(std::make_unique<RiskEndpoint>());

    server.Run();
}


// THING NOT IMPLEMENTED YET:
// 
// 
//        if (method == "POST")
//        {
//            if (path == "/api/health")
//            {
//                // TODO: implement POST health if needed
//            }
//        }
//
