#pragma once

class SystemsManagerDB;
class StateManager final
{

public:

    StateManager(SystemsManagerDB& systemsManager);
    ~StateManager();

private:

    SystemsManagerDB& m_SystemsManager;

};