# RiskIT Monorepo

Struktura:
- backend/  -> C++ (CMake)
- frontend/ -> React + TypeScript (Vite)

Prerequisites:
- Node.js + npm
- CMake
- Kompilator C++ (Visual Studio Build Tools / MSVC lub clang/gcc)

Instrukcje:
- Frontend: cd frontend; npm run dev
- Backend (cmake): cmake -S backend -B backend/build; cmake --build backend/build --config Release
