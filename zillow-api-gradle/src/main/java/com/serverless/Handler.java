package com.serverless;

import com.amazonaws.services.lambda.runtime.Context;
import com.amazonaws.services.lambda.runtime.RequestStreamHandler;
import com.jayway.restassured.path.json.JsonPath;
import org.apache.commons.lang3.StringUtils;
import org.apache.log4j.Logger;
import org.json.JSONException;
import org.json.JSONObject;
import org.json.XML;
import org.springframework.web.client.RestTemplate;

import java.io.*;
import java.net.URLEncoder;

public class Handler implements RequestStreamHandler {

    private static final Logger LOGGER = Logger.getLogger(Handler.class);
    private static int PRETTY_PRINT_INDENT_FACTOR = 4;

    @Override
    public void handleRequest(InputStream input, OutputStream output, Context context) throws IOException {
        String content = com.amazonaws.util.IOUtils.toString(input);
        LOGGER.info("content: " + content);

        //citystatezip
        String zpid = JsonPath.from(content).get("queryStringParameters.zpid");
        String address = JsonPath.from(content).get("queryStringParameters.address");
        String city = JsonPath.from(content).get("queryStringParameters.city");
        String state = JsonPath.from(content).get("queryStringParameters.state");
        String zipCode = JsonPath.from(content).get("queryStringParameters.zipCode");

        String resp = callZillowAPI(zpid, address, city, state, zipCode);

        JSONObject responseJson = new JSONObject();
        String responseCode = "200";

        JSONObject headerJson = new JSONObject();

        try {
            headerJson.put("Access-Control-Allow-Origin", "*");
            headerJson.put("Access-Control-Allow-Credentials", "true");

            responseJson.put("statusCode", responseCode);
            responseJson.put("headers", headerJson);
            responseJson.put("body", resp);

            OutputStreamWriter writer = new OutputStreamWriter(output, "UTF-8");
            writer.write(responseJson.toString());

            System.out.println("response-goes-here: " + responseJson.toString());
            writer.close();


        } catch (Exception e) {
            e.printStackTrace();
        }

    }

    public static String callZillowAPI(String zpid, String address, String city, String state, String zipCode) {
        String url = "http://www.zillow.com/webservice/GetSearchResults.htm?zws-id=X1-ZWz1923qpc2xaj_6ikyi";

        StringBuffer sb = new StringBuffer();
        String citystatezip = null;
        sb.append(url);
        if (!StringUtils.isEmpty(address)) {

            try {
                sb.append("&address=").append(URLEncoder.encode(address, "UTF-8"));
            } catch (UnsupportedEncodingException e) {
                e.printStackTrace();
            }
        }
        if (!StringUtils.isEmpty(zpid)) {
            //sb.append("&citystatezip=").append(zpid);
            sb.append("&zpid=").append(zpid);
        } else if (!StringUtils.isEmpty(zipCode)) {
            //sb.append("&citystatezip=").append(city).append(state);
            citystatezip = "&citystatezip=" + zipCode;
        } else if (!StringUtils.isEmpty(city) && !StringUtils.isEmpty(state)) {
            //sb.append("&citystatezip=").append(city).append(state);
            try {
                citystatezip = "&citystatezip=" + URLEncoder.encode(city, "UTF-8") + "-" + URLEncoder.encode(state,
                        "UTF-8");
            } catch (UnsupportedEncodingException e) {
                e.printStackTrace();
            }
        }
        if (!StringUtils.isEmpty(citystatezip)) {
            sb.append(citystatezip);
        }
        url = sb.toString();

        System.out.println("url: " + url);
        RestTemplate restTemplate = new RestTemplate();
        String resp = null;
        try {
            resp = restTemplate.getForObject(url, String.class);

            if (!StringUtils.isEmpty(resp)) {
                JSONObject xmlJSONObj = XML.toJSONObject(resp);
                resp = xmlJSONObj.toString();
            }


        } catch (Exception e) {
            e.printStackTrace();
        }
        //System.out.println("response: " + resp);
        return resp;
    }


    public static void main(String[] args) {

        //callZillowAPI("", "4168-Hampton-Dr-Anchorage-AK-99504", "", "", "99504");
        //callZillowAPI("", "4168 Hampton Dr", "Anchorage", "AK", "");
        //callZillowAPI("", "44009 Falmouth Ct", "Ashburn", "","20147");
        //callZillowAPI("", "43172 Tall Pines Ct", "Ashburn", "", "20147");
        callZillowAPI("", "20273 Beechwood Ter Apt 303", "Ashburn", "VA", "");
        //callZillowAPI("12391150", "20273 Beechwood Ter Apt 303", "", "", "");

    }
}
