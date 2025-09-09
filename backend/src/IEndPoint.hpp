#pragma once
#include <string>
#include <nlohmann/json.hpp>

struct Request
{
    std::string method;
    std::string path;
};

struct Response
{
    std::string body;
    std::string status;
};

class IEndpoint
{
public:
    virtual ~IEndpoint() = default;
    virtual bool IsMatch(const Request& req) = 0;
    virtual Response Handle() = 0;
};
