# RiskIT Monorepo

Struktura:

- backend/ -> C++ (CMake)
- frontend/ -> React + TypeScript (Vite)

Prerequisites:

- Node.js + npm
- CMake
- Kompilator C++ (Visual Studio Build Tools / MSVC lub clang/gcc)

Instrukcje:

- Frontend (dev):

  - cd frontend
  - npm run dev

- Frontend + mock backend (dev with proxy):

  - cd frontend
  - npm run dev:mock
  - otworzy Vite i uruchomi prosty mock backend na http://localhost:8080

- Backend (cmake):
  - cmake -S backend -B backend/build
  - cmake --build backend/build --config Release
