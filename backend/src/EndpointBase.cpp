#include "EndpointBase.hpp"
#include <vector>


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
        m_RequestPath = request.path;
        return it->second();
    }
    return {"Unknown method","at: EndpointBase::HandleMethod"};
}

bool EndpointBase::IsMatch(const std::string& path) 
{
    // Split paths by '/'
    auto reqParts = Split(path,'/');
    auto patternParts = Split(m_PathOfEndPoint,'/');

    if (reqParts.size() != patternParts.size()) return false;

    // Compare each part
    for (size_t i = 0; i < reqParts.size(); ++i)
    {
        // Skip pattern parameters like ":id"
        if (!patternParts[i].empty() && patternParts[i][0] == ':') continue;

        if (reqParts[i] != patternParts[i]) return false;
    }

    return true;
}

std::string EndpointBase::ExtractParam(const std::string& name)
{
    // Split pattern and request path by '/'
    auto patternParts = Split(m_PathOfEndPoint,'/');
    auto reqParts = Split(m_RequestPath,'/');

    if (patternParts.size() != reqParts.size())
    {
        return "Request path doesn't match";
    }

    // Look for the target parameter in the pattern
    for (size_t i = 0; i < patternParts.size(); ++i)
    {
        if (!patternParts[i].empty() && patternParts[i][0] == ':')
        {
            std::string paramName = patternParts[i].substr(1); // remove ':'
            if (paramName == name)
            {
                return reqParts[i]; 
            }
        }
    }

    return "Parameter not found";
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

void EndpointBase::AddMethod(const std::string& name,Response(EndpointBase::* func)())
{
    m_MethodMap[name] = [this,func]() { return (this->*func)(); };
}