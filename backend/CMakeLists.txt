cmake_minimum_required(VERSION 3.15)
project(riskit_backend VERSION 0.1.0 LANGUAGES CXX)

set(CMAKE_CXX_STANDARD 17)
set(CMAKE_CXX_STANDARD_REQUIRED ON)

# Add your executable
add_executable(riskit_server 
    src/main.cpp 
    src/Endpoints/EndpointBase.cpp 
    src/Endpoints/PlayerEndpoint.cpp 
    src/Server.cpp 
    src/Endpoints/StateEndpoint.cpp 
    src/Endpoints/HealthEndpoint.cpp 
    src/Endpoints/RiskEndpoint.cpp
)

# Add include directories
target_include_directories(riskit_server
    PRIVATE
#        ${CMAKE_SOURCE_DIR}/include
        ${CMAKE_SOURCE_DIR}/src/Endpoints
)

# ---------------------------
# Add this block for nlohmann/json
# ---------------------------
find_package(nlohmann_json REQUIRED)
target_link_libraries(riskit_server PRIVATE nlohmann_json::nlohmann_json)

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
