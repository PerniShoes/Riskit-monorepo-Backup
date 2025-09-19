#pragma once
#include "IEndpoint.hpp"
#include <vector>
#include <map>
#include <functional>

class EndpointBase : public IEndpoint
{
public:

    EndpointBase(const std::string& pathOfEndPoint);
    virtual ~EndpointBase() = default;


    bool IsMatch(const std::string& path) override;
    std::vector<std::string> Split(const std::string& s,char delim);
    std::string ExtractParam(const std::string& name);

    Response HandleMethod(const Request& request)override;

    virtual Response HGET() = 0;
    virtual Response HPOST() = 0;
    virtual Response HPUT() = 0;
    virtual Response HDELETE() = 0;

protected:

    void AddMethod(const std::string& name,Response(EndpointBase::* func)());

    std::string m_RequestPath; // For passing parameters, like id
    std::string m_PathOfEndPoint;
    std::map<std::string,std::function<Response()>> m_MethodMap;


};