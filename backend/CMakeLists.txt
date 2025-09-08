cmake_minimum_required(VERSION 3.15)
project(riskit_backend VERSION 0.1.0 LANGUAGES CXX)

set(CMAKE_CXX_STANDARD 17)
set(CMAKE_CXX_STANDARD_REQUIRED ON)

add_executable(riskit_server src/main.cpp)

# compiler warnings
if (MSVC)
  target_compile_options(riskit_server PRIVATE /W4 /permissive-)
else()
  target_compile_options(riskit_server PRIVATE -Wall -Wextra -Wpedantic)
endif()

# Link Winsock on Windows
if (WIN32)
  target_link_libraries(riskit_server PRIVATE Ws2_32)
endif()
