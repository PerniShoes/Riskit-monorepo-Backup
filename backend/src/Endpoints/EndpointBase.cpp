#include "EndpointBase.hpp"
#include <vector>
#include <iostream>
#include <print>

EndpointBase::EndpointBase(const std::string& pathOfEndPoint)
    : m_PathOfEndPoint(pathOfEndPoint)
{

    // All avaialbe methods (not all implemented yet)
    AddMethod("GET",&EndpointBase::HGET);
    AddMethod("POST",&EndpointBase::HPOST);
    AddMethod("PUT",&EndpointBase::HPUT);
    AddMethod("DELETE",&EndpointBase::HDELETE);


}

// Doesn't handle white spaces or other weird input. Just check for exact match. Might need to rewrite for http
Response EndpointBase::HandleMethod(const Request& request)
{
    auto it = m_MethodMap.find(request.method);
    if (it != m_MethodMap.end()) 
    {
        m_Request = request;
        return it->second();

    }
    return Response{"Unknown method","at: EndpointBase::HandleMethod"};
}
bool EndpointBase::IsMatch(const std::string& path)
{
    auto reqParts = Split(path,'/');
    auto patternParts = Split(m_PathOfEndPoint,'/');

    size_t offsetPattern = (patternParts.size() > 0 && patternParts[0].empty()) ? 1 : 0;
    size_t offsetReq = (reqParts.size() > 0 && reqParts[0].empty()) ? 1 : 0;

    size_t iPattern = offsetPattern;
    size_t iReq = offsetReq;

    // Walk through both vectors, consuming parts as we go
    while (iPattern < patternParts.size() && iReq < reqParts.size())
    {
        const std::string& p = patternParts[iPattern];
        if (p.empty()) { ++iPattern; continue; }

        if (p[0] == ':')
        {
            // parameter (maybe optional)
            std::string name = p.substr(1);
            bool optional = false;
            if (!name.empty() && name.back() == '?')
            {
                optional = true;
                name.pop_back();
            }

            // If there's a request part available, treat it as the param value (consume)
            // If there's no request part and param is optional, skip the pattern part (don't consume req)
            if (iReq < reqParts.size())
            {
                ++iPattern; ++iReq;
            }
            else
            {
                if (optional)
                {
                    ++iPattern; // skip optional parameter
                    // iReq unchanged
                }
                else
                {
                    return false; // required param missing
                }
            }
        }
        else
        {
            // literal must match exactly and consume a request part
            if (reqParts[iReq] != p) return false;
            ++iPattern; ++iReq;
        }
    }

    // If there are leftover pattern parts, they must all be optional params or empty
    while (iPattern < patternParts.size())
    {
        const std::string& p = patternParts[iPattern];
        if (p.empty()) { ++iPattern; continue; }
        if (p[0] == ':')
        {
            std::string name = p.substr(1);
            if (!name.empty() && name.back() == '?') { ++iPattern; continue; }
        }
        // literal or required param remaining => no match
        return false;
    }

    // If there are leftover request parts (request longer than pattern) => no match
    if (iReq < reqParts.size()) return false;

    return true;
}

std::string EndpointBase::ExtractParam(const std::string& name)
{
    auto patternParts = Split(m_PathOfEndPoint,'/');
    auto reqParts = Split(m_Request.path,'/');

    size_t offsetPattern = (patternParts.size() > 0 && patternParts[0].empty()) ? 1 : 0;
    size_t offsetReq = (reqParts.size() > 0 && reqParts[0].empty()) ? 1 : 0;

    for (size_t i = 0; i + offsetPattern < patternParts.size(); ++i)
    {
        const std::string& p = patternParts[i + offsetPattern];
        if (p.empty() || p[0] != ':') continue;

        std::string paramName = p.substr(1);
        bool optional = false;

        if (!paramName.empty() && paramName.back() == '?')
        {
            optional = true;
            paramName.pop_back();
        }

        if (paramName == name)
        {
            size_t reqIndex = i + offsetReq;

            if (reqIndex < reqParts.size() && !reqParts[reqIndex].empty())
                return reqParts[reqIndex];   // normal value present
            else if (optional)
                return "-1";                 // optional param missing
            else
                return "-2";                 // required param missing
        }
    }

    return "-3"; // param not found at all
}


// Better name X
std::vector<std::string> EndpointBase::Split(const std::string& s,char delim)
{
    std::vector<std::string> parts;
    std::string temp;
    for (char c : s)
    {
        if (c == delim)
        {
            if (!temp.empty()) parts.push_back(temp);
            temp.clear();
        }
        else temp += c;
    }
    if (!temp.empty()) parts.push_back(temp);
    return parts;
};

void EndpointBase::AddMethod(const std::string& name,Response(EndpointBase::*func)())
{
    m_MethodMap[name] = [this,func]() { return (this->*func)(); };
}
void EndpointBase::SetSystemsManager(SystemsManagerDB* systemsManager)
{
    systemsPtr = systemsManager;
}


Response EndpointBase::HGET()
{
    return {"Current Endpoint doesn't support this","405 Method Not Allowed"};
}

Response EndpointBase::HPOST()
{
    return {"Current Endpoint doesn't support this","405 Method Not Allowed"};
}
Response EndpointBase::HPUT()
{
    return {"Current Endpoint doesn't support this","405 Method Not Allowed"};
}
Response EndpointBase::HDELETE()
{
    return {"Current Endpoint doesn't support this","405 Method Not Allowed"};
}


