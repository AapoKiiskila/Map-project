import src.models

def test_create_new_user(client):
  response = client.post(
    url="/users",
    json={
      "username": "JohnDoe",
      "email": "john.doe@gmail.com",
      "plain_password": "Secret123"
    }
  )

  assert response.status_code == 201
  assert response.json() == {"message": "A new account has been successfully created"}

def test_get_user_info(client, db):
  user = src.models.User(
    username = "JohnDoe",
    email = "john.doe@gmail.com",
    hashed_password = "cgtrenuotjko74m27g04786snmvtso5"
  )

  db.add(user)
  db.commit()

  response = client.get(url="/users")

  assert response.status_code == 200
  assert response.json() == {
    "id": 1,
    "username": "JohnDoe",
    "email": "john.doe@gmail.com"
  }

def test_change_new_username(client, db):
  user = src.models.User(
    username = "JohnDoe",
    email = "test.user@gmail.com",
    hashed_password = "cgtrenuotjko74m27g04786snmvtso5"
  )

  db.add(user)
  db.commit()

  response = client.put(url="/users/update-username", json={"username": "JohnDoe123"})

  assert response.status_code == 200
  assert response.json() == {"message": "Username has been changed", "username": "JohnDoe123"}

def test_change_new_email(client, db):
  user = src.models.User(
    username = "JohnDoe",
    email = "john.doe@gmail.com",
    hashed_password = "cgtrenuotjko74m27g04786snmvtso5"
  )

  db.add(user)
  db.commit()

  response = client.put(url="/users/update-email", json={"email": "john.doe123@gmail.com"})

  assert response.status_code == 200
  assert response.json() == {"message": "Email address has been changed", "email": "john.doe123@gmail.com"}

def test_change_new_password(client, db):
  user = src.models.User(
    username = "JohnDoe",
    email = "john.doe@gmail.com",
    hashed_password = "cgtrenuotjko74m27g04786snmvtso5"
  )

  db.add(user)
  db.commit()

  response = client.put(url="/users/update-password", json={"password": "Secret456"})

  assert response.status_code == 200
  assert response.json() == {"message": "Password has been changed"}
