#pragma once
//#include "SystemsManagerDB.hpp"

class SystemsManagerDB;

class MapManager final
{

public:

    MapManager(SystemsManagerDB& systemsManager);
    ~MapManager();

    int GetFieldsAmount()const;
    int m_FieldsAmount;

private:

    SystemsManagerDB& m_SystemsManager;

};