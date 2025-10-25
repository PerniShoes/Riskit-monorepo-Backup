#pragma once
#include <string>
#include <nlohmann/json.hpp>
#include "SystemsManagerDB.hpp"

struct Request
{
    std::string method;
    std::string path;
    std::string body;

    nlohmann::ordered_json json() const
    {
        if (body.empty())
        {
            return nlohmann::ordered_json::object();
        }

        try
        {
            return nlohmann::ordered_json::parse(body);
        }
        catch (const nlohmann::ordered_json::parse_error&)
        {
            return nlohmann::ordered_json::object(); // Fallback
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
