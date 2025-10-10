cmake_minimum_required(VERSION 3.15)
project(riskit_backend VERSION 0.1.0 LANGUAGES CXX)

# Option toggle so tests run fine localy, but in wsl make commands turn it off 
option(BUILD_TESTS "Build test executable with GoogleTest" ON)


set(CMAKE_CXX_STANDARD 23)
set(CMAKE_CXX_STANDARD_REQUIRED ON)

# Shared sources
set(COMMON_SOURCES
    src/Endpoints/EndpointBase.cpp 
    src/Endpoints/PlayerEndpoint.cpp 
    src/Core/Server.cpp 
    src/Endpoints/StateEndpoint.cpp 
    src/Endpoints/HealthEndpoint.cpp 
    src/Endpoints/RiskEndpoint.cpp
    src/Helpers/Player.hpp
    src/Core/SystemsManagerDB.cpp
    src/Systems/StateManager.cpp
    src/Systems/PlayerManager.cpp
    src/Systems/MapManager.cpp

)

# Shared include directories 
set(COMMON_INCLUDES
    ${CMAKE_SOURCE_DIR}/src/Endpoints
    ${CMAKE_SOURCE_DIR}/src/Helpers
    ${CMAKE_SOURCE_DIR}/src
    ${CMAKE_SOURCE_DIR}/src/Systems
    ${CMAKE_SOURCE_DIR}/src/Core
)

# Production executable 
add_executable(riskit_server
    src/main.cpp         
    ${COMMON_SOURCES}    
  "src/Endpoints/MapEndpoint.cpp")
target_include_directories(riskit_server PRIVATE 
    ${COMMON_INCLUDES}

)
# Prod libs
find_package(nlohmann_json REQUIRED)
target_link_libraries(riskit_server PRIVATE nlohmann_json::nlohmann_json)
#

if(BUILD_TESTS)
# Test executable
add_executable(riskit_tests
    src/TestFiles/test_main.cpp 
    src/TestFiles/ServerTestFixture.hpp
    src/TestFiles/PlayerEndpointTests.cpp
    ${COMMON_SOURCES}   
    
 "src/TestFiles/PlayerEndpointTests.cpp"  "src/Endpoints/MapEndpoint.cpp")

target_include_directories(riskit_tests PRIVATE
    ${COMMON_INCLUDES}
    ${CMAKE_SOURCE_DIR}/src/TestFiles
)
# Test libs
find_package(GTest REQUIRED)
target_link_libraries(riskit_tests PRIVATE GTest::gtest GTest::gtest_main)

find_package(nlohmann_json REQUIRED)
target_link_libraries(riskit_tests PRIVATE nlohmann_json::nlohmann_json)
#
endif()

# ---------------------------
# Compiler warnings
# ---------------------------
if (MSVC)
  target_compile_options(riskit_server PRIVATE /W4 /permissive-)
else()
  target_compile_options(riskit_server PRIVATE -Wall -Wextra -Wpedantic)
endif()

# Link Winsock on Windows
if (WIN32)
  target_link_libraries(riskit_server PRIVATE Ws2_32)
endif()
