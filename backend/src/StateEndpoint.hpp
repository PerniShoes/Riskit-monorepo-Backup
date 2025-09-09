#pragma once
#include "EndpointBase.hpp"

class StateEndpoint : public EndpointBase
{
public:

    StateEndpoint();

    Response Handle() override;


private:

};
