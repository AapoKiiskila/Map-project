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
