CREATE TABLE users (
    id            INT NOT NULL AUTO_INCREMENT
    ,role         ENUM('client', 'doctor', 'laboratory') NOT NULL
    ,name         VARCHAR(255) NOT NULL
    ,phash        VARCHAR(255) NOT NULL
    ,email        VARCHAR(255) NOT NULL
    ,PRIMARY KEY  (`id`)
) ENGINE=InnoDB CHARSET=utf8;

CREATE TABLE reports (
    id              INT NOT NULL AUTO_INCREMENT
    ,type           ENUM('blood', 'DNA') NOT NULL
    ,user_id        INT NOT NULL
    ,lab_id         INT NOT NULL
    ,fname          VARCHAR(255) NOT NULL
    ,valid          BOOLEAN NOT NULL DEFAULT false
    ,dt             DATETIME DEFAULT CURRENT_TIMESTAMP
    ,PRIMARY KEY    (`id`)
    ,KEY user_id    (`user_id`)
    ,KEY lab_id     (`lab_id`)
) ENGINE=InnoDB CHARSET=utf8;
