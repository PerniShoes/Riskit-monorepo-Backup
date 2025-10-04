#pragma once

class SystemsManagerDB;

class MapManager final
{

public:

    MapManager(SystemsManagerDB& systemsManager);
    ~MapManager();

    int GetFieldsAmount()const;
    void ParsePrintPlayers(int playerCount);

private:

    SystemsManagerDB& m_SystemsManager;
    int m_FieldsAmount;

};