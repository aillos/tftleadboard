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
  Done using SQL.
  
  ```sql
  CREATE PROCEDURE 
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

This is by no means licensed by Riot Games themself, only meant as a project for me, myself and I to improve and to have as a fun tool for me and my friends.
Thank you.
