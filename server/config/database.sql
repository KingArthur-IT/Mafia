
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