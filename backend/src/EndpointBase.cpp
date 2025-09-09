#include "EndpointBase.hpp"
#include <vector>

EndpointBase::EndpointBase(const std::string& method,const std::string& pathPattern)
    : m_Method(method),m_PathPattern(pathPattern)
{

}

bool EndpointBase::IsMatch(const Request& req) 
{
    if (req.method != m_Method) return false;

    // Split path by '/'
    auto reqParts = Split(req.path,'/');
    auto patternParts = Split(m_PathPattern,'/');

    if (reqParts.size() != patternParts.size()) return false;

    // Check each part
    for (size_t i = 0; i < reqParts.size(); ++i)
    {
        if (!patternParts[i].empty() && patternParts[i][0] == ':') continue;
        if (reqParts[i] != patternParts[i]) return false;
    }
    return true;
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

