
import os
import praw
from dotenv import load_dotenv

# Carga las variables de entorno desde un archivo .env
load_dotenv()

print("Intentando autenticar con Reddit...")

# Verifica que las variables de entorno se hayan cargado
client_id = os.environ.get("REDDIT_CLIENT_ID")
client_secret = os.environ.get("REDDIT_CLIENT_SECRET")
username = os.environ.get("REDDIT_USERNAME")
password = os.environ.get("REDDIT_PASSWORD")

if not all([client_id, client_secret, username, password]):
    print("❌ ERROR: Una o más variables de entorno de Reddit no se encontraron.")
    print("Asegúrate de que tu archivo .env está en el directorio raíz del proyecto y contiene todas las claves necesarias.")
else:
    try:
        reddit = praw.Reddit(
            client_id=client_id,
            client_secret=client_secret,
            username=username,
            password=password,
            user_agent="Auth Test Script v1.0 by EstudiaYa"
        )

        # El método user.me() fuerza la autenticación
        authenticated_user = reddit.user.me()
        print(f"✅ Autenticación exitosa como el usuario: {authenticated_user}")
        print("¡Tus credenciales son correctas!")

    except Exception as e:
        print(f"❌ La autenticación falló: {e}")
        print("\n---")
        print("🔴 POSIBLES CAUSAS:")
        print("1.  **Credenciales Incorrectas**: Verifica que los valores en tu archivo .env son exactos.")
        print("2.  **Autenticación de Dos Factores (2FA)**: Si tienes 2FA activado en tu cuenta de Reddit, no puedes usar tu contraseña normal. Debes usar un 'app password'.")
        print("3.  **Tipo de App de Reddit**: Asegúrate de que tu app en Reddit sea de tipo 'script'.")
        print("---\n")
