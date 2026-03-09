import src.models

def test_create_new_user(client):
  response = client.post(
    "/users",
    json={
      "username": "TestUser",
      "email": "test.user@gmail.com",
      "plain_password": "Secret123"
    }
  )

  assert response.status_code == 201
  assert response.json() == {"message": "A new account has been successfully created"}

def test_get_user_info(client, db):
  user = src.models.User(
    username = "TestUser",
    email = "test.user@gmail.com",
    hashed_password = "cgtrenuotjko74m27g04786snmvtso5"
  )

  db.add(user)
  db.commit()

  response = client.get("/users")

  assert response.status_code == 200
  assert response.json() == {
    "id": 1,
    "username": "TestUser",
    "email": "test.user@gmail.com"
  }

def test_change_new_username(client, db):
  user = src.models.User(
    username = "TestUser",
    email = "test.user@gmail.com",
    hashed_password = "cgtrenuotjko74m27g04786snmvtso5"
  )

  db.add(user)
  db.commit()

  response = client.put("/users/update-username", json={"username": "UpdatedUser"})

  assert response.status_code == 200
  assert response.json() == {"message": "Username has been changed", "username": "UpdatedUser"}

def test_change_new_email(client, db):
  user = src.models.User(
    username = "TestUser",
    email = "test.user@gmail.com",
    hashed_password = "cgtrenuotjko74m27g04786snmvtso5"
  )

  db.add(user)
  db.commit()

  response = client.put("/users/update-email", json={"email": "user.test@gmail.com"})

  assert response.status_code == 200
  assert response.json() == {"message": "Email address has been changed", "email": "user.test@gmail.com"}

def test_change_new_password(client, db):
  user = src.models.User(
    username = "TestUser",
    email = "test.user@gmail.com",
    hashed_password = "cgtrenuotjko74m27g04786snmvtso5"
  )

  db.add(user)
  db.commit()

  response = client.put("/users/update-password", json={"password": "Secret456"})

  assert response.status_code == 200
  assert response.json() == {"message": "Password has been changed"}
