#pragma once
#include "EndpointBase.hpp"

class MapEndpoint : public EndpointBase
{
public:
    MapEndpoint();

    Response HGET()override;
    Response HPOST()override;
    Response HPUT()override;
    Response HDELETE()override;

private:


};
