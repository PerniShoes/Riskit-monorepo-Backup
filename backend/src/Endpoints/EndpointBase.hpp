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

    void SetSystemsManager(SystemsManagerDB* systemsManager) override;

    bool IsMatch(const std::string& path) override;
    std::vector<std::string> Split(const std::string& s,char delim);
    std::string ExtractParam(const std::string& name);

    Response HandleMethod(const Request& request)override;

    virtual Response HGET();
    virtual Response HPOST();
    virtual Response HPUT();
    virtual Response HDELETE();

protected:

    void AddMethod(const std::string& name,Response(EndpointBase::* func)());

    Request m_Request;
    std::string m_PathOfEndPoint;
    std::map<std::string,std::function<Response()>> m_MethodMap;
    SystemsManagerDB* systemsPtr=nullptr; // Without m_ for convenience

};