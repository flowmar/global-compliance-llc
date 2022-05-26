CREATE DATABASE IF NOT EXISTS `global_compliance`;

USE `global_compliance`;

CREATE TABLE IF NOT EXISTS `Employers`(
  EmployerID INTEGER PRIMARY KEY AUTO_INCREMENT NOT NULL,
  EmployerName VARCHAR(40) NOT NULL
);

CREATE TABLE IF NOT EXISTS `Agents`(
  AgentID INTEGER PRIMARY KEY AUTO_INCREMENT NOT NULL,
  AgentName VARCHAR(40) NOT NULL
);

CREATE TABLE IF NOT EXISTS `Mariners` (
  MarinerID INTEGER PRIMARY KEY AUTO_INCREMENT NOT NULL,
  LastName VARCHAR(255) NOT NULL,
  FirstName VARCHAR(255),
  MiddleName VARCHAR(255),
  StreetAddress VARCHAR(255),
  PhoneNumber VARCHAR(16),
  Email VARCHAR(255),
  EmployerID INTEGER,
  VesselName VARCHAR(255),
  PassportNumber VARCHAR(20),
  Citizenship VARCHAR(30),
  BirthCity VARCHAR(40),
  BirthState VARCHAR(30),
  BirthCountry VARCHAR(30),
  BirthDate Date,
  ProcessingAgent INTEGER NOT NULL,
  Note TEXT DEFAULT NULL,
  FOREIGN KEY (ProcessingAgent) REFERENCES Agents(AgentID),
  FOREIGN KEY (EmployerID) REFERENCES Employers(EmployerID)
);

CREATE TABLE IF NOT EXISTS `Applications` (
  ApplicationID INTEGER PRIMARY KEY AUTO_INCREMENT NOT NULL,
  GovernmentPending BOOLEAN,
  GCPending BOOLEAN,
  ProcessingAgentID INTEGER,
  MarinerID INTEGER,
  ApplicationDocument BLOB DEFAULT NULL,
  FOREIGN KEY (ProcessingAgentID) REFERENCES Agents(AgentID),
  FOREIGN KEY (MarinerID) REFERENCES Mariners(MarinerID)
);

CREATE TABLE IF NOT EXISTS `Countries`(
  CountryID INTEGER PRIMARY KEY AUTO_INCREMENT NOT NULL,
  CountryName VARCHAR(60) NOT NULL
);

CREATE TABLE IF NOT EXISTS `Licenses`(
  LicenseID INTEGER PRIMARY KEY AUTO_INCREMENT NOT NULL,
  LicenseName VARCHAR(40) NOT NULL,
  CountryID INTEGER NOT NULL,
  MarinerID INTEGER NOT NULL,
  FOREIGN KEY (CountryID) REFERENCES Countries(CountryID),
  FOREIGN KEY (MarinerID) REFERENCES Mariners(MarinerID)
);

CREATE TABLE IF NOT EXISTS `Activities`(
  ActivityID INTEGER PRIMARY KEY AUTO_INCREMENT NOT NULL,
  ActivityNote VARCHAR(255) NOT NULL,
  ActivityDate DATE NOT NULL,
  AgentID INTEGER NOT NULL,
  FOREIGN KEY (AgentID) REFERENCES Agents(AgentID)
);

CREATE TABLE IF NOT EXISTS `Rigs`(
  RigID INTEGER PRIMARY KEY AUTO_INCREMENT NOT NULL,
  RigName VARCHAR(40) NOT NULL,
  EmployerID INTEGER NOT NULL,
  FOREIGN KEY (EmployerID) REFERENCES Employers(EmployerID)
);

