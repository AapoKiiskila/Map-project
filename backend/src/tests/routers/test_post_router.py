import src.models

def test_fetch_all_posts(client, db):
  user_1 = src.models.User(
    username = "JohnDoe",
    email = "john.doe@gmail.com",
    hashed_password = "cgtrenuotjko74m27g04786snmvtso5"
  )

  user_2 = src.models.User(
    username = "JaneDoe",
    email = "Jane.Doe@gmail.com",
    hashed_password = "pgtrenuotjko74m27g04786snmvtso5"
  )

  user_1_post_1 = src.models.Post(
    title="Post 1",
    details="Details for post 1",
    type="item",
    latitude=64.67871878251934,
    longitude=24.487784029247916,
    user_id=1
  )

  user_1_post_2 = src.models.Post(
    title="Post 2",
    details="Details for post 2",
    type="item",
    latitude=65.01954070192464,
    longitude=24.74075615288547,
    user_id=1
  )

  user_2_post_1 = src.models.Post(
    title="Post 3",
    details="Details for post 3",
    type="pet",
    latitude=37.49841673428113,
    longitude=14.034985088768552,
    user_id=2
  )

  user_2_post_2 = src.models.Post(
    title="Post 4",
    details="Details for post 4",
    type="item",
    latitude=64.25925591807349,
    longitude=24.840556404570567,
    user_id=2
  )

  user_2_post_3 = src.models.Post(
    title="Post 5",
    details="Details for post 5",
    type="pet",
    latitude=64.22333041783455,
    longitude=27.742000280039008,
    user_id=2
  )

  db.add_all([
    user_1,
    user_2,
    user_1_post_1,
    user_1_post_2,
    user_2_post_1,
    user_2_post_2,
    user_2_post_3
])
  db.commit()

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
