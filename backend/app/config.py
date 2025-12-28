import pathlib
from pydantic_settings import BaseSettings, SettingsConfigDict

backend_directory = pathlib.Path(__file__).parent.parent.resolve()
env_path = backend_directory / ".env"

class Settings(BaseSettings):
  DATABASE_URL: str

  model_config = SettingsConfigDict(env_file=env_path)

settings = Settings()
