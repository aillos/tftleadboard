package com.aillos.tftleadboard;

import com.google.gson.Gson;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.boot.jdbc.DataSourceBuilder;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import software.amazon.awssdk.auth.credentials.AwsBasicCredentials;
import software.amazon.awssdk.regions.Region;
import software.amazon.awssdk.services.secretsmanager.SecretsManagerClient;
import software.amazon.awssdk.services.secretsmanager.model.GetSecretValueRequest;
import software.amazon.awssdk.services.secretsmanager.model.GetSecretValueResponse;

import javax.sql.DataSource;


@Configuration
public class ApplicationConfig {

    @Value("${cloud.aws.credentials.access-key}")
    private String accessKey;
    @Value("${cloud.aws.credentials.secret-key}")
    private String secretKey;

    @Bean
    public DataSource dataSource(){
        AwsSecret secrets = getSecret();
        return DataSourceBuilder
                .create()
              //  .driverClassName("")
                .url("jdbc:sqlserver://" + secrets.getHost() + ":" + secrets.getPort() + ";database=summoner;user=" + secrets.getUsername() + ";password=" + secrets.getPassword() + ";encrypt=true;trustServerCertificate=false;hostNameInCertificate=*.database.windows.net;loginTimeout=30")
                .username(secrets.getUsername())
                .password(secrets.getPassword())
                .build();
    }

    private Gson gson = new Gson();

    private AwsSecret getSecret() {

        String secretName = "summonerDB";
        Region region = Region.of("eu-north-1");

        // Create a Secrets Manager client
        SecretsManagerClient client = SecretsManagerClient.builder()
                .region(region)
                .credentialsProvider(() -> AwsBasicCredentials.create(accessKey, secretKey))
                .build();

        GetSecretValueRequest getSecretValueRequest = GetSecretValueRequest.builder()
                .secretId(secretName)
                .build();

        GetSecretValueResponse getSecretValueResponse;

        try {
            getSecretValueResponse = client.getSecretValue(getSecretValueRequest);
        } catch (Exception e) {
            // For a list of exceptions thrown, see
            // https://docs.aws.amazon.com/secretsmanager/latest/apireference/API_GetSecretValue.html
            throw e;
        }
        if (getSecretValueResponse.secretString() != null){
        String secret = getSecretValueResponse.secretString();
        return gson.fromJson(secret, AwsSecret.class);
        }

        // Your code goes here.
        return null;
    }

}
