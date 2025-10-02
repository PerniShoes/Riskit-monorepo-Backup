#include "Server.hpp"

#include <iostream>
#include <print>
#include <cstring>
#include <cstdlib>

#if defined(_WIN32)
#include <winsock2.h>
#include <ws2tcpip.h>
#pragma comment(lib, "Ws2_32.lib")
#else
#include <netinet/in.h>
#include <sys/socket.h>
#include <sys/types.h>
#include <unistd.h>
#include <arpa/inet.h>
#endif

Server::Server(uint16_t port,SystemsManagerDB* systemsManager)
    : m_Port(port)
    ,m_SystemsManagerPtr(systemsManager)
{
    PlatformStartup();
    if (m_SystemsManagerPtr == nullptr)
    {
        std::println("Crash and die, systemsManager is nullptr in Server");
    }
}

Server::~Server()
{
    if (m_ServerFD >= 0)
    {
        PlatformClose(m_ServerFD);
    }
    PlatformCleanup();
}

int Server::AcceptClient()
{
    struct sockaddr_in client_addr{};
    socklen_t client_len = sizeof(client_addr);
    return int(accept(m_ServerFD,reinterpret_cast<struct sockaddr*>(&client_addr),&client_len));
}
std::string Server::ReadLine(int client_fd)
{
    std::string line;
    char c;
    while (true)
    {
        int n = recv(client_fd,&c,1,0);
        if (n <= 0) break;
        if (c == '\r') continue;
        if (c == '\n') break;
        line.push_back(c);
    }
    return line;
}
std::pair<std::string,std::string> Server::ReadRequestLine(int client_fd)
{
    std::string line = ReadLine(client_fd);
    auto first_space = line.find(' ');
    if (first_space == std::string::npos) return {"",""};
    auto second_space = line.find(' ',first_space + 1);
    std::string method = line.substr(0,first_space);
    std::string path = (second_space == std::string::npos) ? line.substr(first_space + 1)
        : line.substr(first_space + 1,second_space - first_space - 1);
    return {method, path};
}
void Server::SendResponse(int client_fd,const Response& resp)
{
    std::string data;
    data += "HTTP/1.1 " + resp.status + "\r\n";
    data += "Content-Type: application/json\r\n";
    data += "Content-Length: " + std::to_string(resp.body.size()) + "\r\n";
    data += "Connection: close\r\n\r\n";
    data += resp.body;

    send(client_fd,data.c_str(),static_cast<int>(data.size()),0);
}

void Server::RegisterEndpoint(std::unique_ptr<IEndpoint> endpoint)
{
    if (m_SystemsManagerPtr == nullptr)
    {
        std::println("Crash and die, systemsManager is nullptr in Server during Endpoint registration");
    }
    endpoint->SetSystemsManager(m_SystemsManagerPtr);
    m_Endpoints.push_back(std::move(endpoint));
}

void Server::Run()
{
    // Create socket
    m_ServerFD = int(socket(AF_INET,SOCK_STREAM,0));
    if (m_ServerFD < 0)
    {
        std::cerr << "Socket creation failed\n";
        return;
    }

    // Linux vs Win
    int opt = 1;
    #if defined(_WIN32)
        setsockopt(m_ServerFD,SOL_SOCKET,SO_REUSEADDR,
            reinterpret_cast<const char*>(&opt),sizeof(opt));
    #else
        setsockopt(m_ServerFD,SOL_SOCKET,SO_REUSEADDR,
            &opt,sizeof(opt));
    #endif

    // Bind
    struct sockaddr_in addr{};
    addr.sin_family = AF_INET;
    addr.sin_addr.s_addr = INADDR_ANY;
    addr.sin_port = htons(m_Port);

    if (bind(m_ServerFD,reinterpret_cast<struct sockaddr*>(&addr),sizeof(addr)) < 0)
    {
        std::cerr << "Bind failed\n";
        return;
    }

    if (listen(m_ServerFD,10) < 0)
    {
        std::cerr << "Listen failed\n";
        return;
    }

    std::cout << "Server listening on port " << m_Port << "\n";

    // Main loop
    while (true)
    {
        int client_fd = AcceptClient();
        if (client_fd < 0)
        {
            std::cerr << "Accept failed\n";
            continue;
        }

        auto [method,path] = ReadRequestLine(client_fd);
        Request req{method, path,{}};

        Response resp{"", "404 Not Found"};
        for (auto& ep : m_Endpoints)
        {
            if (ep->IsMatch(path))
            {
                resp = ep->HandleMethod(req);
                break;
            }
        }

        SendResponse(client_fd,resp);
        PlatformCleanup();
        PlatformClose(client_fd);
    }
}

void Server::PlatformStartup()
{
#if defined(_WIN32)
    WSADATA wsaData;
    if (WSAStartup(MAKEWORD(2,2),&wsaData))
    {
        std::cerr << "WSAStartup failed\n";
        std::exit(1);
    }
#endif
}
void Server::PlatformCleanup()
{
#if defined(_WIN32)
    WSACleanup();
#endif
}
int Server::PlatformClose(int fd)
{
#if defined(_WIN32)
    return closesocket(fd);
#else
    return close(fd);
#endif
}
