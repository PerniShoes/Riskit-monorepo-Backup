#include <algorithm>
#include <cerrno>
#include <cstring>
#include <iostream>
#include <string>

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

static void platform_startup()
{
#if defined(_WIN32)
    WSADATA d;
    if (WSAStartup(MAKEWORD(2, 2), &d)) {
        std::cerr << "WSAStartup failed\n";
        std::exit(1);
    }
#endif
}


static int platform_close(int fd)
{
#if defined(_WIN32)
    return closesocket(fd);
#else
    return close(fd);
#endif
}

int start_server(uint16_t port)
{
    platform_startup();

    int server_fd = int(socket(AF_INET, SOCK_STREAM, 0));
    if (server_fd < 0) {
        char errBuf[256];
        strerror_s(errBuf,sizeof(errBuf),errno);
        std::cerr << "socket failed: " << errBuf << "\n";
        return -1;
    }

    int opt = 1;
    setsockopt(server_fd, SOL_SOCKET, SO_REUSEADDR, (const char *)&opt, sizeof(opt));

    struct sockaddr_in address;
    address.sin_family = AF_INET;
    address.sin_addr.s_addr = INADDR_ANY;
    address.sin_port = htons(port);

    if (bind(server_fd, (struct sockaddr *)&address, sizeof(address)) < 0) {
        char errBuf[256];
        strerror_s(errBuf,sizeof(errBuf),errno);
        std::cerr << "socket failed: " << errBuf << "\n";
        platform_close(server_fd);
        return -1;
    }

    if (listen(server_fd, 10) < 0) {
        char errBuf[256];
        strerror_s(errBuf,sizeof(errBuf),errno);
        std::cerr << "socket failed: " << errBuf << "\n";
        platform_close(server_fd);
        return -1;
    }

    std::cout << "C++ backend listening on port " << port << "\n";
    return server_fd;
}

std::string read_line(int fd)
{
    std::string line;
    char c;
    while (true) {
        int n = recv(fd, &c, 1, 0);
        if (n <= 0) break;
        if (c == '\r') continue;
        if (c == '\n') break;
        line.push_back(c);
    }
    return line;
}

std::string http_response(const std::string &body, const std::string &status = "200 OK")
{
    std::string resp;
    resp += "HTTP/1.1 " + status + "\r\n";
    resp += "Content-Type: application/json\r\n";
    resp += "Content-Length: " + std::to_string(body.size()) + "\r\n";
    resp += "Connection: close\r\n";
    resp += "\r\n";
    resp += body;
    return resp;
}
