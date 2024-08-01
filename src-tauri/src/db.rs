// Handling database connections and migrations

use sqlx::sqlite::{SqliteQueryResult, SqlitePool, SqlitePoolOptions};
use sqlx::migrate::MigrateDatabase;

/// A monitoring session which is stored in the database
pub struct Session {
    id: i32,
    session_type: String,
    use_type: String,
    start_time: String,
    end_time: String,
}

pub async fn connect() -> Result<SqlitePool, sqlx::Error> {
    let pool = SqlitePoolOptions::new()
        .max_connections(5)
        .connect("sqlite:data.db").await?;
    Ok(pool)
}

pub async fn add_session(pool: &SqlitePool, session: Session) -> Result<SqliteQueryResult, sqlx::Error> {
    let result = sqlx::query("INSERT INTO sessions (session_type, use_type, start_time, end_time) VALUES (?, ?, ?, ?)")
        .bind(session.session_type)
        .bind(session.use_type)
        .bind(session.start_time)
        .bind(session.end_time)
        .execute(pool)
        .await?;
    Ok(result)
}