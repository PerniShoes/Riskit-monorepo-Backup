#pragma once
#include <string>
#include <nlohmann/json.hpp>
#include "SystemsManagerDB.hpp"

struct Request
{
    std::string method;
    std::string path;
    std::string body;

    nlohmann::json json() const
    {
        if (body.empty())
        {
            return nlohmann::json::object();
        }
        else
        {
            return nlohmann::json::parse(body);
        }
    }
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
    virtual void SetSystemsManager(SystemsManagerDB* systemsManager) = 0;

    virtual std::string ExtractParam(const std::string& name) = 0;
};
