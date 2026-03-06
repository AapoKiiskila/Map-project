import pathlib
import pydantic_settings

backend_directory = pathlib.Path(__file__).parent.parent.resolve()
env_path = backend_directory / ".env"

class Settings(pydantic_settings.BaseSettings):
  ALGORITHM: str
  ACCESS_TOKEN_EXPIRE_MINUTES: int
  DATABASE_URL: str
  SECRET_KEY: str
  TEST_DATABASE_URL: str

  model_config = pydantic_settings.SettingsConfigDict(env_file=env_path)

settings = Settings()
