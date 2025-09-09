#pragma once
#include "IEndPoint.hpp"

class EndpointBase : public IEndpoint
{
public:

    EndpointBase(const std::string& method,const std::string& pathPattern);

    bool IsMatch(const Request& req) override;
    std::vector<std::string> Split(const std::string& s,char delim);

protected:

    std::string m_Method;
    std::string m_PathPattern;

};