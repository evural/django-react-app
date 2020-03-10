from .base import *  # noqa

# ersan
# Allow requests from the frontend
CORS_ORIGIN_WHITELIST = (
        'http://localhost:3000',
)

# ersan
# Allow cookies in cross-site HTTP requests
CORS_ALLOW_CREDENTIALS = True
CSRF_TRUSTED_ORIGINS = [
        'http://localhost:3000',
]

# ersan
JWT_AUTH = {
    'JWT_RESPONSE_PAYLOAD_HANDLER': 'urbanlib.utils.my_jwt_response_handler',
    'JWT_PAYLOAD_GET_USER_ID_HANDLER': 'rest_framework_jwt.utils.jwt_get_user_id_from_payload_handler',
    'JWT_AUTH_COOKIE': 'urbanlib_token',
    #'JWT_SECRET_KEY': 'This is a very long and secure secret key',
    #'JWT_GET_USER_SECRET_KEY': None,
    #'JWT_ALGORITHM': 'HS256',
    #'JWT_VERIFY': True,
    #'JWT_VERIFY_EXPIRATION': True,
    'JWT_EXPIRATION_DELTA': datetime.timedelta(minutes=300),
    #'JWT_ISSUER': None,

    #'JWT_ALLOW_REFRESH': True,
    #'JWT_REFRESH_EXPIRATION_DELTA': datetime.timedelta(minutes=20),
}

# ersan
# This should already be True by default
SESSION_COOKIE_HTTPONLY = True
# Default is lax which prevents Django's session cookie being sent cross domain
SESSION_COOKIE_SAMESITE = None
