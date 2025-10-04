#pragma once
#include "IEndpoint.hpp"
#include <vector>
#include <memory>
#include "SystemsManagerDB.hpp"

class Server final
{

public:
    Server(uint16_t port,SystemsManagerDB* systemsManager);
    Server(const Server& other) = delete;
    Server& operator=(const Server& other) = delete;
    Server(Server&& other) = delete;
    Server& operator=(Server&& other) = delete;
    ~Server();

    void Run();
    void RegisterEndpoint(std::unique_ptr<IEndpoint> endPoint);


private:
    uint16_t m_Port;
    std::vector<std::unique_ptr<IEndpoint>> m_Endpoints;

    int m_ServerFD{-1};
    int AcceptClient();

    void SendResponse(int client_fd,const Response& resp);
    std::string ReadLine(int client_fd);
    std::tuple<std::string,std::string,std::string> ReadRequestLine(int client_fd);

    void PlatformStartup();
    void PlatformCleanup();
    int PlatformClose(int fd);
    SystemsManagerDB* m_SystemsManagerPtr = nullptr;

};
