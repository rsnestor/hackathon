package com.serverless.compares;

import com.amazonaws.services.lambda.runtime.Context;
import com.amazonaws.services.lambda.runtime.RequestStreamHandler;
import com.jayway.restassured.path.json.JsonPath;
import org.apache.commons.lang3.StringUtils;
import org.apache.log4j.Logger;
import org.json.JSONObject;
import org.json.XML;
import org.springframework.web.client.RestTemplate;

import java.io.*;

public class Handler implements RequestStreamHandler {

    private static final Logger LOGGER = Logger.getLogger(Handler.class);
    private static int PRETTY_PRINT_INDENT_FACTOR = 4;

    @Override
    public void handleRequest(InputStream input, OutputStream output, Context context) throws IOException {
        String content = com.amazonaws.util.IOUtils.toString(input);
        LOGGER.info("content: " + content);

        //citystatezip
        String zpid = JsonPath.from(content).get("queryStringParameters.zpid");
        String count = JsonPath.from(content).get("queryStringParameters.count");
        String rentzestimate = JsonPath.from(content).get("queryStringParameters.rentzestimate");

        String resp = callComparesZillowAPI(zpid, count, rentzestimate);

        String gateWayResp = constructHeaders(resp);

        System.out.println("response-goes-here: " + gateWayResp);
        OutputStreamWriter writer = new OutputStreamWriter(output, "UTF-8");
        writer.write(gateWayResp);
        writer.close();

    }

    public String constructHeaders(String response) {
        try {
            JSONObject responseJson = new JSONObject();
            String responseCode = "200";

            JSONObject headerJson = new JSONObject();
            headerJson.put("Access-Control-Allow-Origin", "*");
            headerJson.put("Access-Control-Allow-Credentials", "true");

            responseJson.put("statusCode", responseCode);
            responseJson.put("headers", headerJson);
            responseJson.put("body", response);
            return responseJson.toString();
        } catch (Exception e) {
            e.printStackTrace();
        }
        return "";
    }

    public static String callComparesZillowAPI(String zpid, String count, String rentzestimate) {

        String url = "http://www.zillow.com/webservice/GetComps" +
                ".htm?zws-id=X1-ZWz1923qpc2xaj_6ikyi";

        String queryparms = String.format("&zpid=%s&count=%s", zpid, count);
        url = url + queryparms;

        System.out.println(url);
        RestTemplate restTemplate = new RestTemplate();
        String resp = null;
        resp = restTemplate.getForObject(url, String.class);

        System.out.println("compares-api-resp: " + resp);
        return xmlToJsonConvert(resp);
    }

    public static String xmlToJsonConvert(String xmlResp) {
        try {
            if (!StringUtils.isEmpty(xmlResp)) {
                JSONObject xmlJSONObj = XML.toJSONObject(xmlResp);
                return xmlJSONObj.toString();
            }
        } catch (Exception e) {
            e.printStackTrace();
        }
        return "";
    }

    public static void main(String[] args) {

        //callZillowAPI("", "4168-Hampton-Dr-Anchorage-AK-99504", "", "", "99504");
        //callZillowAPI("", "4168 Hampton Dr", "Anchorage", "AK", "");
        //callZillowAPI("", "44009 Falmouth Ct", "Ashburn", "","20147");
        //callZillowAPI("", "43172 Tall Pines Ct", "Ashburn", "", "20147");
        //callZillowAPI("", "20273 Beechwood Ter Apt 303", "Ashburn", "VA", "");
        //callZillowAPI("12391150", "20273 Beechwood Ter Apt 303", "", "", "");
        callComparesZillowAPI("12391150", "3", "");

    }
}
