#pragma once
#include "EndpointBase.hpp"

class PlayerEndpoint : public EndpointBase
{
public:
    PlayerEndpoint();

    Response Handle() override;

private:
    std::string ExtractParam(const std::string& name);


};