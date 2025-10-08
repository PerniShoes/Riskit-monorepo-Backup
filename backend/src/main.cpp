#include <iostream>
#include <string>
#include <thread>
#include <ctime>
#include <cstdlib>
#include <memory>

#include "AllEndpoints.hpp"
#include "Server.hpp"
#include "SystemsManagerDB.hpp"

int main()
{
    SystemsManagerDB systemsManger{};
    Server server(8081,&systemsManger);

    server.RegisterEndpoint(std::make_unique<PlayerEndpoint>());
    server.RegisterEndpoint(std::make_unique<StateEndpoint>());
    server.RegisterEndpoint(std::make_unique<HealthEndpoint>());
    server.RegisterEndpoint(std::make_unique<RiskEndpoint>());

    server.Run();
    return 0;
}
