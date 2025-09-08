#include <iostream>
#include <string>
#include <thread>

extern int start_server(uint16_t port);
extern std::string read_line(int fd);
extern std::string http_response(const std::string &body, const std::string &status);
extern int platform_close(int fd);

int main()
{
    const uint16_t port = 8081; // C++ backend runs on 8081 to avoid clashing with mock
    int server_fd = start_server(port);
    if (server_fd < 0) return 1;

    while (true) {
        struct sockaddr_in client_addr;
        socklen_t client_len = sizeof(client_addr);
        int client = accept(server_fd, (struct sockaddr *)&client_addr, &client_len);
        if (client < 0) {
            std::cerr << "accept failed\n";
            break;
        }

        // Read request line
        std::string request_line = read_line(client);
        // Very small parser: GET /api/health or GET /api/risk
        if (request_line.rfind("GET ", 0) == 0) {
            auto path_end = request_line.find(' ', 4);
            std::string path = request_line.substr(4, path_end - 4);

            if (path == "/api/health") {
                std::string body = "{\"status\":\"ok\",\"service\":\"cpp_backend\"}";
                std::string resp = http_response(body, "200 OK");
                send(client, resp.c_str(), (int)resp.size(), 0);
            } else if (path == "/api/risk") {
                std::string body = "{\"risk\":\"cpp_mock\",\"probability\":0.73}";
                std::string resp = http_response(body, "200 OK");
                send(client, resp.c_str(), (int)resp.size(), 0);
            } else {
                std::string body = "{\"error\":\"not_found\"}";
                std::string resp = http_response(body, "404 Not Found");
                send(client, resp.c_str(), (int)resp.size(), 0);
            }
        }

        platform_close(client);
    }

    return 0;
}
