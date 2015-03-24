SET NOCOUNT ON
GO

USE master
GO

if exists (select * from sysdatabases where name='arcadegameproject')
ALTER DATABASE [classicalmusic] SET  SINGLE_USER WITH ROLLBACK IMMEDIATE
GO

if exists (select * from sysdatabases where name='arcadegameproject')
		drop database classicalmusic
GO
DECLARE @device_directory NVARCHAR(520)
SELECT @device_directory = SUBSTRING(filename, 1, CHARINDEX(N'master.mdf', LOWER(filename)) - 1)
FROM master.dbo.sysaltfiles WHERE dbid = 1 AND fileid = 1

EXECUTE (N'CREATE DATABASE arcadegameproject
  ON PRIMARY (NAME = N''classicalmusic'', FILENAME = N''' + @device_directory + N'arcadegameproject.mdf'')
  LOG ON (NAME = N''arcadegameproject_log'',  FILENAME = N''' + @device_directory + N'arcadegameproject.ldf'')')
GO
use carcadegameproject;
CREATE TABLE Users

(
	Userid int NOT NULL IDENTITY(1,1),
	Username varchar(max) NOT NULL,
	email varchar(50) NOT NULL,	
	UserPassword varchar(max) not null,
	PRIMARY KEY (Userid)
);
CREATE TABLE gameScore


(
Scoreid int NOT NULL IDENTITY(1,1),
	useid int NOT NULL,
	Score int NOT NULL,
	PRIMARY KEY (Scoreid),
	FOREIGN KEY (useid) REFERENCES Users(Username) on DELETE SET DEFAULT ON Update Cascade,
);