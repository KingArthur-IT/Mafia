
create Table users(
    id SERIAL PRIMARY KEY,
    nickname VARCHAR(20) NOT NULL,
    email VARCHAR(20) NOT NULL,
    email_notification BOOLEAN DEFAULT true,
    password VARCHAR(100) NOT NULL,
    gender VARCHAR(10),
    age VARCHAR(2),
    country VARCHAR(20),
    role VARCHAR(5) DEFAULT 'USER',
    account_type VARCHAR(10) DEFAULT 'standart',
    rating INT DEFAULT 0,
    all_games_count INT DEFAULT 0, 
    mafia_wins_count INT DEFAULT 0, 
    citizen_wins_count INT DEFAULT 0, 
    was_mafia_count INT DEFAULT 0, 
    was_sheriff_count INT DEFAULT 0, 
    was_doctor_count INT DEFAULT 0, 
    was_lover_count INT DEFAULT 0, 
    was_terrorist_count INT DEFAULT 0, 
    was_barmer_count INT DEFAULT 0, 
    was_bodyguard_count INT DEFAULT 0, 
    bring_friend_count INT DEFAULT 0, 
    bring_friend_score INT DEFAULT 0,
    created_at TIMESTAMP
);

CREATE TABLE notifications (
  id SERIAL PRIMARY KEY,
  user_id INT NOT NULL,
  title VARCHAR(50) NOT NULL,
  message VARCHAR(1000) NOT NULL,
  isRead BOOLEAN DEFAULT false,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (user_id) REFERENCES users (id)
);

CREATE TABLE rooms (
  id SERIAL PRIMARY KEY,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  name VARCHAR(20) NOT NULL,
  max_persons smallint NOT NULL,
  min_persons smallint NOT NULL,
  lover_max_count smallint NOT NULL,
  reporter_max_count smallint NOT NULL,
  barmen_max_count smallint NOT NULL,
  doctor_max_count smallint NOT NULL,
  bodyguard_max_count smallint NOT NULL,
  terrorist_max_count smallint NOT NULL,
  users JSONB DEFAULT '[]',
  chat JSONB DEFAULT '[]',
  status VARCHAR(20) DEFAULT 'collecting',
  game_stage smallint DEFAULT 0,
  game_is_timer_active BOOLEAN DEFAULT false,
  game_timer_counter smallint DEFAULT 0,
  game_chat_enable BOOLEAN DEFAULT true,
  game_mafia_in_chat BOOLEAN DEFAULT false,
  game_kills_candidates JSONB DEFAULT '[]',
  game_voted_users JSONB DEFAULT '[]',
  game_winner_team VARCHAR(20) DEFAULT ''
);