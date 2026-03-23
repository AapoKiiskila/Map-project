def test_fetch_all_posts(client, insert_database_data):
  response = client.get(
    url="/posts", 
    params={
      "latitude": 64.75417579363601,
      "longitude": 26.429547067869983
    }
  )

  every_fetched_post_id = []

  for post in response.json():
    every_fetched_post_id.append(post["id"])

  assert response.status_code == 200
  assert len(response.json()) == 4
  assert 1 in every_fetched_post_id
  assert 2 in every_fetched_post_id
  assert 3 not in every_fetched_post_id
  assert 4 in every_fetched_post_id
  assert 5 in every_fetched_post_id

def test_fetch_user_posts(client, insert_database_data):
  response = client.get(url="/posts/my-posts")

  every_fetched_post_id = []

  for post in response.json():
    every_fetched_post_id.append(post["id"])

  assert response.status_code == 200
  assert len(response.json()) == 2
  assert 1 in every_fetched_post_id
  assert 2 in every_fetched_post_id
  assert 3 not in every_fetched_post_id
  assert 4 not in every_fetched_post_id
  assert 5 not in every_fetched_post_id

def test_create_new_post(client, insert_database_data):
  response = client.post(
    url="/posts/create-post",
    json={
      "title": "Test",
      "details": "Test test test test test test.",
      "type": "item",
      "latitude": 65.67871878251934,
      "longitude": 25.487784029247916,
      "user_id": 1
    }
  )

  assert response.status_code == 201
  assert response.json() == {"message": "Post created successfully"}
  