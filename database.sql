CREATE TABLE "tasks" (
	"id" SERIAL PRIMARY KEY,
	"name" VARCHAR (100) NOT NULL,
	"complete" BOOLEAN DEFAULT FALSE,
	"completed date" date,
    "priority" BOOLEAN DEFAULT FALSE
);

INSERT INTO "tasks" 
	("name", "complete", "completed date", "priority") 
VALUES 
	('Feed dogs', 'false', NULL, 'true'),
    ('Laundry', 'false', NULL, 'false'),
    ('Take out garbage', 'false', NULL, 'true'),
    ('Call mom', 'false', NULL, 'false'),
    ('Hang holiday decorations', 'false', NULL, 'false'),
    ('Fill car tank with gas', 'false', NULL, 'false'),
    ('Buy garbage can liners', 'false', NULL, 'false'),
    ('Change bed sheets', 'false', NULL, 'false'),
    ('Order more dog food', 'false', NULL, 'false');


SELECT * FROM "tasks";