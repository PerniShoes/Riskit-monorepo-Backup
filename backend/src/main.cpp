#include <iostream>
#include <string>
#include <thread>
#include <sstream>
#include <ctime>
#include <cstdlib>
#include "http_server.cpp"

extern int start_server(uint16_t port);
extern std::string read_line(int fd);
extern std::string http_response(const std::string &body, const std::string &status);
extern int platform_close(int fd);

int main()
{
    const uint16_t port = 8081; // C++ backend runs on 8081 to avoid clashing with mock
    int server_fd = start_server(port);
    if (server_fd < 0) return 1;

    // simple RNG for demo risk values
    std::srand((unsigned)std::time(nullptr));

    while (true) {
        struct sockaddr_in client_addr;
        socklen_t client_len = sizeof(client_addr);
        int client = int(accept(server_fd, (struct sockaddr *)&client_addr, &client_len));
        if (client < 0) {
            std::cerr << "accept failed\n";
            break;
        }

        // Read raw request line for debugging
        std::string raw_line = read_line(client);
        auto first_space = raw_line.find(' ');
        std::string method = "";
        std::string path = "";
        if (first_space != std::string::npos) {
            auto second_space = raw_line.find(' ', first_space+1);
            method = raw_line.substr(0, first_space);
            if (second_space == std::string::npos) path = raw_line.substr(first_space+1);
            else path = raw_line.substr(first_space+1, second_space-first_space-1);
        }
        std::cerr << "Raw request line: '" << raw_line << "' -> method='" << method << "' path='" << path << "'\n";

        if (method == "GET") {
            if (path == "/api/health") {
                std::string body = "{\"status\":\"ok\",\"service\":\"cpp_backend\"}";
                std::string resp = http_response(body, "200 OK");
                send(client, resp.c_str(), (int)resp.size(), 0);
            } else if (path == "/api/risk") {
                // simple derived risk value from aggregated economy
                double p = 0.25 + (std::rand() % 751) / 4000.0; // 0.25 - ~0.9375
                std::string body = "{\"risk\":\"sector_threat\",\"probability\":" + std::to_string(p) + "}";
                std::string resp = http_response(body, "200 OK");
                send(client, resp.c_str(), (int)resp.size(), 0);
            } else if (path == "/api/state") {
                // produce a demo game state with players, resources, armies
                std::ostringstream ss;
                ss << "{\"time\": " << std::time(nullptr) << ", \"players\": [";
                for (int i = 1; i <= 3; ++i) {
                    int gold = 500 + (std::rand() % 2000);
                    int infantry = 50 + (std::rand() % 300);
                    int tanks = std::rand() % 20;
                    ss << "{\"id\": " << i << ", \"name\": \"Player" << i << "\", \"gold\": " << gold << ", \"army\": {\"infantry\": " << infantry << ", \"tanks\": " << tanks << "}}";
                    if (i < 3) ss << ",";
                }
                ss << "], \"economy\": {\"income\": 1200, \"expenses\": 800} }";
                std::string body = ss.str();
                std::string resp = http_response(body, "200 OK");
                send(client, resp.c_str(), (int)resp.size(), 0);
            } else if (path.rfind("/api/player/", 0) == 0) {
                // extract id after /api/player/
                std::string idStr = path.substr(std::string("/api/player/").size());
                int id = 0;
                try { id = std::stoi(idStr); } catch(...) { id = 0; }
                if (id >= 1 && id <= 3) {
                    int gold = 700 + id * 100;
                    int infantry = 100 * id;
                    int tanks = 5 * id;
                    std::ostringstream ss;
                    ss << "{\"id\": " << id << ", \"name\": \"Player" << id << "\", \"gold\": " << gold << ", \"army\": {\"infantry\": " << infantry << ", \"tanks\": " << tanks << "}}";
                    std::string resp = http_response(ss.str(), "200 OK");
                    send(client, resp.c_str(), (int)resp.size(), 0);
                } else {
                    std::string body = "{\"error\":\"player_not_found\"}";
                    std::string resp = http_response(body, "404 Not Found");
                    send(client, resp.c_str(), (int)resp.size(), 0);
                }
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
