#pragma once
#include "EndpointBase.hpp"

class StateEndpoint : public EndpointBase
{
public:
    StateEndpoint();
     
    Response HGET()override;
    Response HPOST()override;
    Response HPUT()override;
    Response HDELETE()override;

private:


};
