#include <iostream>
#include <string>
#include <thread>
#include <ctime>
#include <cstdlib>
#include <memory>

#include "AllEndpoints.hpp"
#include "Server.hpp"


int main()
{
    Server server(8081);

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
