-- ============================================================================
-- Migration: V001__init_birthday_schema.sql
-- Target Database: Microsoft SQL Server 2022 (SSMS 22) / Azure SQL / SQLite
-- Description: Schema for Birthday Wishes Wall, Personalized Greeting Cards, and Audit Logs
-- Security Standard: SKILL_CUSTOM_1305 §7.2 (Data Protection, Audit Trail, Least Privilege)
-- ============================================================================

-- 1. Create Birthday Greetings / Shared Cards Table
IF NOT EXISTS (SELECT * FROM sys.tables WHERE name = 'BirthdayCards' AND type = 'U')
BEGIN
    CREATE TABLE BirthdayCards (
        CardId NVARCHAR(64) NOT NULL PRIMARY KEY,
        RecipientName NVARCHAR(100) NOT NULL,
        SenderName NVARCHAR(100) NOT NULL,
        Age INT NULL CHECK (Age >= 0 AND Age <= 150),
        WishMessage NVARCHAR(MAX) NOT NULL,
        ThemeColor NVARCHAR(32) NOT NULL DEFAULT 'rose',
        CandleCount INT NOT NULL DEFAULT 5 CHECK (CandleCount >= 1 AND CandleCount <= 20),
        IsPublic BIT NOT NULL DEFAULT 1,
        ViewCount INT NOT NULL DEFAULT 0,
        CreatedAt DATETIMEOFFSET NOT NULL DEFAULT SYSDATETIMEOFFSET(),
        ExpiresAt DATETIMEOFFSET NULL
    );

    CREATE NONCLUSTERED INDEX IX_BirthdayCards_CreatedAt 
    ON BirthdayCards (CreatedAt DESC);
END;
GO

-- 2. Create Birthday Guestbook / Wishes Wall Table
IF NOT EXISTS (SELECT * FROM sys.tables WHERE name = 'GuestbookWishes' AND type = 'U')
BEGIN
    CREATE TABLE GuestbookWishes (
        WishId BIGINT IDENTITY(1,1) NOT NULL PRIMARY KEY,
        CardId NVARCHAR(64) NULL FOREIGN KEY REFERENCES BirthdayCards(CardId) ON DELETE SET NULL,
        AuthorName NVARCHAR(100) NOT NULL,
        AuthorEmoji NVARCHAR(16) NOT NULL DEFAULT N'🎂',
        MessageText NVARCHAR(1000) NOT NULL,
        ThemeColor NVARCHAR(32) NOT NULL DEFAULT 'violet',
        LikeCount INT NOT NULL DEFAULT 0,
        IsApproved BIT NOT NULL DEFAULT 1,
        ClientIpHash NVARCHAR(64) NULL, -- SHA-256 hashed IP for rate limiting without PII leak
        CreatedAt DATETIMEOFFSET NOT NULL DEFAULT SYSDATETIMEOFFSET()
    );

    CREATE NONCLUSTERED INDEX IX_GuestbookWishes_CreatedAt 
    ON GuestbookWishes (CreatedAt DESC);
END;
GO

-- 3. Security Audit Log Table
IF NOT EXISTS (SELECT * FROM sys.tables WHERE name = 'BirthdayAuditLogs' AND type = 'U')
BEGIN
    CREATE TABLE BirthdayAuditLogs (
        LogId BIGINT IDENTITY(1,1) NOT NULL PRIMARY KEY,
        Action NVARCHAR(64) NOT NULL,
        TargetEntity NVARCHAR(64) NOT NULL,
        EntityId NVARCHAR(64) NULL,
        StatusCode INT NOT NULL,
        Details NVARCHAR(500) NULL,
        CreatedAt DATETIMEOFFSET NOT NULL DEFAULT SYSDATETIMEOFFSET()
    );

    CREATE NONCLUSTERED INDEX IX_BirthdayAuditLogs_CreatedAt 
    ON BirthdayAuditLogs (CreatedAt DESC);
END;
GO
