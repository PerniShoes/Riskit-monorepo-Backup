#pragma once
#include "IEndPoint.hpp"
#include <vector>
#include <memory>

class Server
{

public:
    Server(uint16_t port);
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
    std::pair<std::string,std::string> ReadRequestLine(int client_fd);    

    void PlatformStartup();
    void PlatformCleanup();
    int PlatformClose(int fd);

};
