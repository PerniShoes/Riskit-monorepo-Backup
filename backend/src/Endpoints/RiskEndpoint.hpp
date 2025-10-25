#pragma once
#include "EndpointBase.hpp"

class RiskEndpoint : public EndpointBase
{
public:
    RiskEndpoint();

    Response HGET()override;
    Response HPOST()override;
    Response HPUT()override;
    Response HDELETE()override;

private:


};