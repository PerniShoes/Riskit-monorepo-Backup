#include <iostream>
#include <string>
#include <thread>
#include <ctime>
#include <cstdlib>
#include <memory>

// Probabbly group endpoints somehow to avoid having 500000000 includes. Maybe Umbrella header
#include "StateEndpoint.hpp"
#include "PlayerEndpoint.hpp"
#include "Server.hpp"


int main()
{
    Server server(8081);

    server.RegisterEndpoint(std::make_unique<PlayerEndpoint>());
    server.RegisterEndpoint(std::make_unique<StateEndpoint>());

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
//        if (method == "GET")
//        {
//
//            // TO DO:
//            // IMPLEMENT OTHER ENDPOINTS
//            
//
//            //if (path == "/api/health")
//            //{
//            //    ordered_json resp_json = {{"status", "ok"}, {"service", "cpp_backend"}};
//            //    std::string resp = http_response(resp_json.dump(4),"200 OK");
//            //    send(client,resp.c_str(),static_cast<int>(resp.size()),0);
//            //}
//            //else if (path == "/api/risk")
//            //{
//            //    double p = 0.25 + (std::rand() % 751) / 4000.0;
//            //    ordered_json resp_json = {{"risk", "sector_threat"}, {"probability", p}};
//            //    std::string resp = http_response(resp_json.dump(4),"200 OK");
//            //    send(client,resp.c_str(),static_cast<int>(resp.size()),0);
//            //}


