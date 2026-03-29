def test_create_new_sighting(client, insert_database_data):
  with client.websocket_connect("/ws/2") as websocket:
    response = client.post(
      url="/sightings/create-sighting",
      json={
        "description": "Test",
        "user_id": 1,
        "post_id": 3,
      }
    )

    data = websocket.receive_text()

    assert response.status_code == 201
    assert response.json() == {"message": "Sighting created successfully"}
    assert data == "3"

def test_get_my_received_sightings(client, insert_database_data):
  response = client.get(url="/sightings/received-sightings")

  every_fetched_sighting_id = []

  for sighting in response.json():
    every_fetched_sighting_id.append(sighting["id"])
  
  assert response.status_code == 200
  assert len(response.json()) == 2
  assert 1 not in every_fetched_sighting_id
  assert 2 not in every_fetched_sighting_id
  assert 3 in every_fetched_sighting_id
  assert 4 in every_fetched_sighting_id

def test_get_my_unread_sightings(client, insert_database_data):
  response = client.get(url="/sightings/received-sightings/unread")
  
  assert response.status_code == 200
  assert response.json() == {"count": 2}

def test_get_my_created_sightings(client, insert_database_data):
  response = client.get(url="/sightings/created-sightings")

  every_fetched_sighting_id = []

  for sighting in response.json():
    every_fetched_sighting_id.append(sighting["id"])
  
  assert response.status_code == 200
  assert len(response.json()) == 2
  assert 1 in every_fetched_sighting_id
  assert 2 in every_fetched_sighting_id
  assert 3 not in every_fetched_sighting_id
  assert 4 not in every_fetched_sighting_id

def test_mark_sighting_as_read(client, insert_database_data):
  with client.websocket_connect("/ws/1") as websocket:
    response = client.put(
      url="/sightings/3",
      json={"is_read": 1}
    )

    data = websocket.receive_text()

    assert response.status_code == 200
    assert data == "1"

def test_delete_one_sighting(client, insert_database_data):
  with client.websocket_connect("/ws/2") as websocket:
    response = client.delete(url="/sightings/1")

    data = websocket.receive_text()

    assert response.status_code == 200
    assert data == "1"
