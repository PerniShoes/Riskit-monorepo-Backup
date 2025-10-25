#pragma once
#include "EndpointBase.hpp"

class PlayerEndpoint : public EndpointBase
{
public:
    PlayerEndpoint();

    Response HGET()override;
    Response HPOST()override;
    Response HPUT()override;
    Response HDELETE()override;

private:




};