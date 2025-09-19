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
    virtual bool IsMatch(const std::string& path) = 0;
    virtual Response HandleMethod(const Request& request) = 0;

    virtual std::string ExtractParam(const std::string& name) = 0;
};
