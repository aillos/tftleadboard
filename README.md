# [TFT Leaderboard](https://tft.aillos.no)

This repository is for the web application or website; TFT Leaderboard.
The website is for me and my friends to track our Teamfight Tactics progress and compare our rank to eachother.
The data is being fetched from the Riot Games API and stored in an SQL Database using Azure. I am using Azure Web App Hosting and Github Pages to run and deploy my application.

## Languages:
- [Java](https://www.java.com/en/)
- [HTML5](https://developer.mozilla.org/en-US/docs/Glossary/HTML5)
- [CSS](https://developer.mozilla.org/en-US/docs/Web/CSS)
- [Javascript](https://developer.mozilla.org/en-US/docs/Web/JavaScript)
- With use of [Maven](https://maven.apache.org/)

## Built with:
- [Spring Boot](https://spring.io/)
- [Azure SQL Database](https://azure.microsoft.com/en-us/products/azure-sql/)
- [Azure Web Hosting](https://azure.microsoft.com/en-us/products/app-service/web/)
- [AWS Secrets](https://aws.amazon.com/secrets-manager/)
- [Github Pages](https://pages.github.com)

## Automation code for the database:
<details>
  <summary>Update ranks</summary>
  <br>
  
  *Done using SQL.*
  
  ```sql
  CREATE PROCEDURE UpdateSummonerData
  AS
  BEGIN

    DECLARE @ret INT, @response NVARCHAR(MAX);
    DECLARE @summonerId NVARCHAR(50);
    DECLARE @leaguePoints INT;
    DECLARE @tier NVARCHAR(20);
    DECLARE @losses INT;
    DECLARE @rank NVARCHAR(20);
    DECLARE @summonerName NVARCHAR(50);
    DECLARE @wins INT;
    DECLARE @httpClient INT;

    DECLARE summonerCursor CURSOR FOR
        SELECT summonerId
        FROM Summoner;

    OPEN summonerCursor;
    FETCH NEXT FROM summonerCursor INTO @summonerId;

    WHILE @@FETCH_STATUS = 0
        BEGIN

            SET @ret = 0;
            SET @response = NULL;


            DECLARE @url NVARCHAR(4000) = N'';

            EXEC @ret = sp_invoke_external_rest_endpoint
                        @url = @url,
                        @method = 'GET',
                        @response = @response OUTPUT;



            IF @ret = 0 AND @response IS NOT NULL
                BEGIN
                    
                    SELECT @leaguePoints = JSON_VALUE(@response, '$.result.leaguePoints'),
                           @tier = JSON_VALUE(@response, '$.result.tier'),
                           @losses = JSON_VALUE(@response, '$.result.losses'),
                           @rank = JSON_VALUE(@response, '$.result.rank'),
                           @summonerName = JSON_VALUE(@response, '$.result.summonerName'),
                           @wins = JSON_VALUE(@response, '$.result.wins');

                    
                END


            UPDATE Summoner
            SET summonerName = @summonerName,
                rank = @rank,
                tier = @tier,
                lp = @leaguePoints,
                wins = @wins,
                losses = @losses
            WHERE summonerId = @summonerId;

            FETCH NEXT FROM summonerCursor INTO @summonerId;
        END

    CLOSE summonerCursor;
    DEALLOCATE summonerCursor;
  END
  go
  ```
  
</details>
<details>
  <summary>Converting the ranks to a comparable int</summary>
  <br>
  
  *Done using SQL.*
  
  ```sql
  CREATE FUNCTION rankToInt(@rankValue VARCHAR(255))
    RETURNS INT
AS
BEGIN
    DECLARE @sum INT = 0;
    DECLARE @s VARCHAR(255) = @rankValue;

    SET @s = REPLACE(@s, 'IRON', 'A');
    SET @s = REPLACE(@s, 'BRONZE', 'B');
    SET @s = REPLACE(@s, 'SILVER', 'C');
    SET @s = REPLACE(@s, 'GOLD', 'D');
    SET @s = REPLACE(@s, 'PLATINUM', 'E');
    SET @s = REPLACE(@s, 'DIAMOND', 'F');
    SET @s = REPLACE(@s, 'MASTER', 'G');
    SET @s = REPLACE(@s, 'GRANDMASTER', 'G');
    SET @s = REPLACE(@s, 'CHALLENGER', 'G');
    SET @s = REPLACE(@s, 'IV', 'M');
    SET @s = REPLACE(@s, 'III', 'L');
    SET @s = REPLACE(@s, 'II', 'K');
    SET @s = REPLACE(@s, 'I', 'J');

    DECLARE @x VARCHAR(255) = SUBSTRING(@s, 3, LEN(@s));
    SET @sum += CAST(@x AS INT);

    IF CAST(@x AS INT) < 10
        SET @s = SUBSTRING(@s, 1, LEN(@s) - 1);
    ELSE
        SET @s = SUBSTRING(@s, 1, LEN(@s) - 2);

    DECLARE @i INT = 1;
    DECLARE @rankChar CHAR(1);

    WHILE @i <= LEN(@s)
        BEGIN
            SET @rankChar = SUBSTRING(@s, @i, 1);

            SET @sum += CASE @rankChar
                            WHEN 'J' THEN 300
                            WHEN 'K' THEN 200
                            WHEN 'L' THEN 100
                            WHEN 'M' THEN 0
                            WHEN 'A' THEN 0
                            WHEN 'B' THEN 400
                            WHEN 'C' THEN 800
                            WHEN 'D' THEN 1200
                            WHEN 'E' THEN 1600
                            WHEN 'F' THEN 2000
                            WHEN 'G' THEN 2400
                            ELSE 0
                END;

            SET @i += 1;
        END;

    RETURN @sum;
END
go
  ```
  
</details>

This is by no means licensed by Riot Games themself, only meant as a project for me, myself and I to improve and to have as a fun tool for me and my friends.
Thank you.
