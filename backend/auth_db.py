import os
import psycopg2
from psycopg2.extras import RealDictCursor


def get_connection():
    database_url = os.environ.get("DATABASE_URL")

    if not database_url:
        raise RuntimeError("DATABASE_URL is not configured.")

    return psycopg2.connect(database_url)


def init_auth_db():
    conn = get_connection()

    try:
        with conn.cursor() as cur:
            cur.execute("""
                CREATE EXTENSION IF NOT EXISTS pgcrypto;

                CREATE TABLE IF NOT EXISTS users (
                    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
                    email VARCHAR(255) UNIQUE NOT NULL,
                    password_hash TEXT NOT NULL,
                    full_name VARCHAR(255) NOT NULL,
                    user_type VARCHAR(100) DEFAULT 'Patient',
                    phone_number VARCHAR(50),
                    city VARCHAR(100),
                    state VARCHAR(100),
                    created_at TIMESTAMPTZ DEFAULT NOW()
                );

                CREATE TABLE IF NOT EXISTS password_reset_tokens (
                    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
                    user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
                    token_hash TEXT NOT NULL,
                    expires_at TIMESTAMPTZ NOT NULL,
                    used BOOLEAN DEFAULT FALSE,
                    created_at TIMESTAMPTZ DEFAULT NOW()
                );

                CREATE INDEX IF NOT EXISTS idx_users_email
                ON users(email);

                CREATE INDEX IF NOT EXISTS idx_reset_tokens_hash
                ON password_reset_tokens(token_hash);
            """)

        conn.commit()

    finally:
        conn.close()


def find_user_by_email(email):
    conn = get_connection()

    try:
        with conn.cursor(cursor_factory=RealDictCursor) as cur:
            cur.execute(
                """
                SELECT *
                FROM users
                WHERE LOWER(email) = LOWER(%s)
                """,
                (email.strip(),)
            )

            return cur.fetchone()

    finally:
        conn.close()


def create_user(
    email,
    password_hash,
    full_name,
    user_type="Patient",
    phone_number=None,
    city=None,
    state=None
):
    conn = get_connection()

    try:
        with conn.cursor(cursor_factory=RealDictCursor) as cur:
            cur.execute(
                """
                INSERT INTO users
                (
                    email,
                    password_hash,
                    full_name,
                    user_type,
                    phone_number,
                    city,
                    state
                )
                VALUES (%s, %s, %s, %s, %s, %s, %s)
                RETURNING
                    id,
                    email,
                    full_name,
                    user_type,
                    phone_number,
                    city,
                    state,
                    created_at
                """,
                (
                    email.strip().lower(),
                    password_hash,
                    full_name.strip(),
                    user_type,
                    phone_number,
                    city,
                    state,
                )
            )

            user = cur.fetchone()

        conn.commit()
        return user

    finally:
        conn.close()


def update_password(user_id, password_hash):
    conn = get_connection()

    try:
        with conn.cursor() as cur:
            cur.execute(
                """
                UPDATE users
                SET password_hash = %s
                WHERE id = %s
                """,
                (password_hash, user_id)
            )

        conn.commit()

    finally:
        conn.close()


def create_reset_token(user_id, token_hash, expires_at):
    conn = get_connection()

    try:
        with conn.cursor() as cur:
            cur.execute(
                """
                UPDATE password_reset_tokens
                SET used = TRUE
                WHERE user_id = %s
                  AND used = FALSE
                """,
                (user_id,)
            )

            cur.execute(
                """
                INSERT INTO password_reset_tokens
                (
                    user_id,
                    token_hash,
                    expires_at
                )
                VALUES (%s, %s, %s)
                """,
                (user_id, token_hash, expires_at)
            )

        conn.commit()

    finally:
        conn.close()


def get_reset_token(token_hash):
    conn = get_connection()

    try:
        with conn.cursor(cursor_factory=RealDictCursor) as cur:
            cur.execute(
                """
                SELECT *
                FROM password_reset_tokens
                WHERE token_hash = %s
                  AND used = FALSE
                  AND expires_at > NOW()
                LIMIT 1
                """,
                (token_hash,)
            )

            return cur.fetchone()

    finally:
        conn.close()


def mark_reset_token_used(token_id):
    conn = get_connection()

    try:
        with conn.cursor() as cur:
            cur.execute(
                """
                UPDATE password_reset_tokens
                SET used = TRUE
                WHERE id = %s
                """,
                (token_id,)
            )

        conn.commit()

    finally:
        conn.close()