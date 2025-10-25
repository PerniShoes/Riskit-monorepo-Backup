# Dockerfile dla backend C++ z debuggerem
FROM ubuntu:22.04

# Zainstaluj podstawowe narzędzia i debugger
RUN apt-get update && apt-get install -y \
    build-essential \
    cmake \
    ninja-build \
    gdb \
    valgrind \
    strace \
    curl \
    pkg-config \
    nlohmann-json3-dev \
    && rm -rf /var/lib/apt/lists/*

# Ustaw katalog roboczy
WORKDIR /app

# Skopiuj pliki źródłowe
COPY src/ ./src/
COPY CMakeLists.txt ./

# Zbuduj aplikację w trybie Debug z symbolami debugowania
RUN mkdir build && cd build && \
    cmake -G Ninja -DCMAKE_BUILD_TYPE=Debug -DCMAKE_CXX_FLAGS="-g -O0" .. && \
    cmake --build .

# Expose port
EXPOSE 8081

# Komenda uruchomienia (można nadpisać w docker-compose)
CMD ["./build/riskit_server"]

# Alternatywnie można uruchomić z debuggerem:
# CMD ["gdb", "--batch", "--ex", "run", "--ex", "bt", "--args", "./build/riskit_server"]