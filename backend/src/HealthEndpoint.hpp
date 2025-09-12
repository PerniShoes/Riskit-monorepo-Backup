#pragma once
#include "EndpointBase.hpp"

class HealthEndpoint : public EndpointBase
{
public:
    HealthEndpoint();

    Response HGET()override;
    Response HPOST()override;
    Response HPUT()override;
    Response HDELETE()override;


private:


};