-- ============================================================================
-- V001__init_schema.sql
-- Project: Day Night Cycle Dashboard
-- Target: Microsoft SQL Server (SSMS 22 / Azure SQL Database)
-- Compliance: SKILL_CUSTOM_1305 §6.4 & §7.2 (T-SQL, Parameterization, Auditing)
-- ============================================================================

SET NOCOUNT ON;
GO

-- 1. Create Preferences table
IF NOT EXISTS (SELECT * FROM sys.objects WHERE object_id = OBJECT_ID(N'[dbo].[preferences]') AND type in (N'U'))
BEGIN
    CREATE TABLE [dbo].[preferences] (
        [id] INT IDENTITY(1,1) NOT NULL,
        [user_id] NVARCHAR(64) NOT NULL CONSTRAINT [DF_preferences_user_id] DEFAULT ('default'),
        [timezone] NVARCHAR(64) NULL CONSTRAINT [DF_preferences_timezone] DEFAULT ('Asia/Ho_Chi_Minh'),
        [is12h] BIT NOT NULL CONSTRAINT [DF_preferences_is12h] DEFAULT (0),
        [show_fireflies] BIT NOT NULL CONSTRAINT [DF_preferences_show_fireflies] DEFAULT (1),
        [temp_unit] NVARCHAR(8) NOT NULL CONSTRAINT [DF_preferences_temp_unit] DEFAULT ('C'),
        [focus_mode] BIT NOT NULL CONSTRAINT [DF_preferences_focus_mode] DEFAULT (0),
        [theme] NVARCHAR(32) NOT NULL CONSTRAINT [DF_preferences_theme] DEFAULT ('night'),
        [language] NVARCHAR(16) NOT NULL CONSTRAINT [DF_preferences_language] DEFAULT ('en'),
        [pomo_work_min] INT NOT NULL CONSTRAINT [DF_preferences_pomo_work_min] DEFAULT (25),
        [pomo_break_min] INT NOT NULL CONSTRAINT [DF_preferences_pomo_break_min] DEFAULT (5),
        [lofi_track] NVARCHAR(255) NOT NULL CONSTRAINT [DF_preferences_lofi_track] DEFAULT ('assets/music/Window.mp3'),
        [lofi_volume] INT NOT NULL CONSTRAINT [DF_preferences_lofi_volume] DEFAULT (65),
        [created_at] DATETIMEOFFSET NOT NULL CONSTRAINT [DF_preferences_created_at] DEFAULT (SYSDATETIMEOFFSET()),
        [updated_at] DATETIMEOFFSET NOT NULL CONSTRAINT [DF_preferences_updated_at] DEFAULT (SYSDATETIMEOFFSET()),
        CONSTRAINT [PK_preferences] PRIMARY KEY CLUSTERED ([id] ASC),
        CONSTRAINT [UQ_preferences_user_id] UNIQUE NONCLUSTERED ([user_id] ASC)
    );
END
GO

-- 2. Create Todos table
IF NOT EXISTS (SELECT * FROM sys.objects WHERE object_id = OBJECT_ID(N'[dbo].[todos]') AND type in (N'U'))
BEGIN
    CREATE TABLE [dbo].[todos] (
        [id] INT IDENTITY(1,1) NOT NULL,
        [user_id] NVARCHAR(64) NOT NULL CONSTRAINT [DF_todos_user_id] DEFAULT ('default'),
        [text] NVARCHAR(255) NOT NULL,
        [tag] NVARCHAR(50) NULL,
        [subtitle] NVARCHAR(150) NULL,
        [category] NVARCHAR(30) NOT NULL CONSTRAINT [DF_todos_category] DEFAULT ('up_next'),
        [done] BIT NOT NULL CONSTRAINT [DF_todos_done] DEFAULT (0),
        [order_index] INT NOT NULL CONSTRAINT [DF_todos_order_index] DEFAULT (0),
        [created_at] DATETIMEOFFSET NOT NULL CONSTRAINT [DF_todos_created_at] DEFAULT (SYSDATETIMEOFFSET()),
        [updated_at] DATETIMEOFFSET NOT NULL CONSTRAINT [DF_todos_updated_at] DEFAULT (SYSDATETIMEOFFSET()),
        CONSTRAINT [PK_todos] PRIMARY KEY CLUSTERED ([id] ASC)
    );

    CREATE NONCLUSTERED INDEX [IX_todos_user_id_done] ON [dbo].[todos] ([user_id] ASC, [done] ASC)
    INCLUDE ([text], [tag], [subtitle], [category], [order_index]);
END
GO

-- 3. Stored Procedure: Upsert Preferences (Parameterized)
CREATE OR ALTER PROCEDURE [dbo].[sp_UpsertPreferences]
    @user_id NVARCHAR(64),
    @timezone NVARCHAR(64) = NULL,
    @is12h BIT = NULL,
    @show_fireflies BIT = NULL,
    @temp_unit NVARCHAR(8) = NULL,
    @focus_mode BIT = NULL,
    @theme NVARCHAR(32) = NULL,
    @language NVARCHAR(16) = NULL,
    @pomo_work_min INT = NULL,
    @pomo_break_min INT = NULL,
    @lofi_track NVARCHAR(255) = NULL,
    @lofi_volume INT = NULL
AS
BEGIN
    SET NOCOUNT ON;
    
    IF NOT EXISTS (SELECT 1 FROM [dbo].[preferences] WHERE [user_id] = @user_id)
    BEGIN
        INSERT INTO [dbo].[preferences] (
            [user_id], [timezone], [is12h], [show_fireflies], [temp_unit],
            [focus_mode], [theme], [pomo_work_min], [pomo_break_min],
            [lofi_track], [lofi_volume]
        ) VALUES (
            @user_id,
            COALESCE(@timezone, 'Asia/Ho_Chi_Minh'),
            COALESCE(@is12h, 0),
            COALESCE(@show_fireflies, 1),
            COALESCE(@temp_unit, 'C'),
            COALESCE(@focus_mode, 0),
            COALESCE(@theme, 'night'),
            COALESCE(@language, 'en'),
            COALESCE(@pomo_work_min, 25),
            COALESCE(@pomo_break_min, 5),
            COALESCE(@lofi_track, 'assets/music/Window.mp3'),
            COALESCE(@lofi_volume, 65)
        );
    END
    ELSE
    BEGIN
        UPDATE [dbo].[preferences]
        SET
            [timezone] = COALESCE(@timezone, [timezone]),
            [is12h] = COALESCE(@is12h, [is12h]),
            [show_fireflies] = COALESCE(@show_fireflies, [show_fireflies]),
            [temp_unit] = COALESCE(@temp_unit, [temp_unit]),
            [focus_mode] = COALESCE(@focus_mode, [focus_mode]),
            [theme] = COALESCE(@theme, [theme]),
            [language] = COALESCE(@language, [language]),
            [pomo_work_min] = COALESCE(@pomo_work_min, [pomo_work_min]),
            [pomo_break_min] = COALESCE(@pomo_break_min, [pomo_break_min]),
            [lofi_track] = COALESCE(@lofi_track, [lofi_track]),
            [lofi_volume] = COALESCE(@lofi_volume, [lofi_volume]),
            [updated_at] = SYSDATETIMEOFFSET()
        WHERE [user_id] = @user_id;
    END

    SELECT * FROM [dbo].[preferences] WHERE [user_id] = @user_id;
END
GO

-- 4. Rollback Script (Commented out for safety)
/*
DROP PROCEDURE IF EXISTS [dbo].[sp_UpsertPreferences];
DROP TABLE IF EXISTS [dbo].[todos];
DROP TABLE IF EXISTS [dbo].[preferences];
*/
