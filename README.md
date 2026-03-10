# Map project
A mobile application that allows users to report lost items and missing pets.

## Features
- Create reports for lost items and missing pets
- Add the location of your report to a map
- View nearby reports on the map
- Send real-time notifications to other users

## Run locally

### 1. Clone the repository

### 2. Create a virtual environment
Open a terminal in the `backend` directory and run:
```
python -m venv .venv
```

### 3. Activate the virtual environment
Run this in the `backend` directory:
```
.venv\Scripts\Activate.ps1
```

### 4. Install dependencies
Install backend dependencies by running this in the `backend` directory:
```
pip install -r requirements.txt
```
Open a new terminal in the `map-app` directory and run:
```
npm install
```

### 5. Create a MySQL database schema
Optionally create a second database schema for testing purposes

### 6. Create .env files
Create a .env file to `backend` directory<br/>
Example:
```
ALGORITHM="HS256"
ACCESS_TOKEN_EXPIRE_MINUTES = 30
DATABASE_URL="mysql+pymysql://User:password123@localhost:3306/app"
SECRET_KEY = "hyzXziZ52OHAzzsU0YWwAVjAlNGKqoUKsjnmiKMAmfYaUlwpJEauOq4BUOpprgJtRlCU2ccAXtovNKbaFdobP5"
TEST_DATABASE_URL="mysql+pymysql://User:password123@localhost:3306/test"
```
Create a .env file to `map-app` directory<br/>
Example:
```
EXPO_PUBLIC_URL=http://192.168.1.102:8000
EXPO_PUBLIC_WS=ws://192.168.1.102:8000
```

### 7. Run the application
Run this in the `backend` directory:
```
fastapi dev .\src\main.py --host 192.168.1.102
```
Run this in the `map-app` directory:
```
npx expo start
```
