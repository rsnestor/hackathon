'use strict';

const compresp =   
{"comps":{"request":{"zpid":"12393217","count":"3"},"message":{"text":"Request successfully processed","code":"0"},"response":{"properties":{"principal":{"zpid":"12393217","links":{"homedetails":"http://www.zillow.com/homedetails/44009-Falmouth-Ct-Ashburn-VA-20147/12393217_zpid/","graphsanddata":"http://www.zillow.com/homedetails/44009-Falmouth-Ct-Ashburn-VA-20147/12393217_zpid/#charts-and-data","mapthishome":"http://www.zillow.com/homes/12393217_zpid/","comparables":"http://www.zillow.com/homes/comps/12393217_zpid/"},"address":{"street":"44009 Falmouth Ct","zipcode":"20147","city":"Ashburn","state":"VA","latitude":"39.059432","longitude":"-77.478152"},"zestimate":{"amount":{"_currency":"USD","__text":"329304","toString":[null]},"last-updated":"08/24/2017","oneWeekChange":{"_deprecated":"true"},"valueChange":{"_duration":"30","_currency":"USD","__text":"-2833","toString":[null]},"valuationRange":{"low":{"_currency":"USD","__text":"312839","toString":[null]},"high":{"_currency":"USD","__text":"345769","toString":[null]}},"percentile":"21"},"localRealEstate":{"region":{"zindexValue":"500,600","links":{"overview":"http://www.zillow.com/local-info/VA-Ashburn/r_16818/","forSaleByOwner":"http://www.zillow.com/ashburn-va/fsbo/","forSale":"http://www.zillow.com/ashburn-va/"},"_name":"Ashburn","_id":"16818","_type":"city"}}},"comparables":{"comp":[{"zpid":"59796916","links":{"homedetails":"http://www.zillow.com/homedetails/18142-Mill-House-Sq-Leesburg-VA-20176/59796916_zpid/","graphsanddata":"http://www.zillow.com/homedetails/18142-Mill-House-Sq-Leesburg-VA-20176/59796916_zpid/#charts-and-data","mapthishome":"http://www.zillow.com/homes/59796916_zpid/","comparables":"http://www.zillow.com/homes/comps/59796916_zpid/"},"address":{"street":"18142 Mill House Sq","zipcode":"20176","city":"Leesburg","state":"VA","latitude":"39.112465","longitude":"-77.513896"},"zestimate":{"amount":{"_currency":"USD","__text":"346015","toString":[null]},"last-updated":"08/24/2017","oneWeekChange":{"_deprecated":"true"},"valueChange":{"_duration":"30","_currency":"USD","__text":"-3788","toString":[null]},"valuationRange":{"low":{"_currency":"USD","__text":"328714","toString":[null]},"high":{"_currency":"USD","__text":"380616","toString":[null]}},"percentile":"29"},"localRealEstate":{"region":{"zindexValue":"480,700","links":{"overview":"http://www.zillow.com/local-info/VA-Leesburg/r_32471/","forSaleByOwner":"http://www.zillow.com/leesburg-va/fsbo/","forSale":"http://www.zillow.com/leesburg-va/"},"_name":"Leesburg","_id":"32471","_type":"city"}},"_score":"19.0"},{"zpid":"12394585","links":{"homedetails":"http://www.zillow.com/homedetails/44022-Florence-Ter-Ashburn-VA-20147/12394585_zpid/","graphsanddata":"http://www.zillow.com/homedetails/44022-Florence-Ter-Ashburn-VA-20147/12394585_zpid/#charts-and-data","mapthishome":"http://www.zillow.com/homes/12394585_zpid/","comparables":"http://www.zillow.com/homes/comps/12394585_zpid/"},"address":{"street":"44022 Florence Ter","zipcode":"20147","city":"Ashburn","state":"VA","latitude":"39.049127","longitude":"-77.47653"},"zestimate":{"amount":{"_currency":"USD","__text":"402586","toString":[null]},"last-updated":"08/24/2017","oneWeekChange":{"_deprecated":"true"},"valueChange":{"_duration":"30","_currency":"USD","__text":"-4382","toString":[null]},"valuationRange":{"low":{"_currency":"USD","__text":"382457","toString":[null]},"high":{"_currency":"USD","__text":"422715","toString":[null]}},"percentile":"40"},"localRealEstate":{"region":{"zindexValue":"500,600","links":{"overview":"http://www.zillow.com/local-info/VA-Ashburn/r_16818/","forSaleByOwner":"http://www.zillow.com/ashburn-va/fsbo/","forSale":"http://www.zillow.com/ashburn-va/"},"_name":"Ashburn","_id":"16818","_type":"city"}},"_score":"7.0"},{"zpid":"12394577","links":{"homedetails":"http://www.zillow.com/homedetails/44004-Florence-Ter-Ashburn-VA-20147/12394577_zpid/","graphsanddata":"http://www.zillow.com/homedetails/44004-Florence-Ter-Ashburn-VA-20147/12394577_zpid/#charts-and-data","mapthishome":"http://www.zillow.com/homes/12394577_zpid/","comparables":"http://www.zillow.com/homes/comps/12394577_zpid/"},"address":{"street":"44004 Florence Ter","zipcode":"20147","city":"Ashburn","state":"VA","latitude":"39.049328","longitude":"-77.477229"},"zestimate":{"amount":{"_currency":"USD","__text":"402272","toString":[null]},"last-updated":"08/24/2017","oneWeekChange":{"_deprecated":"true"},"valueChange":{"_duration":"30","_currency":"USD","__text":"-3665","toString":[null]},"valuationRange":{"low":{"_currency":"USD","__text":"382158","toString":[null]},"high":{"_currency":"USD","__text":"422386","toString":[null]}},"percentile":"40"},"localRealEstate":{"region":{"zindexValue":"500,600","links":{"overview":"http://www.zillow.com/local-info/VA-Ashburn/r_16818/","forSaleByOwner":"http://www.zillow.com/ashburn-va/fsbo/","forSale":"http://www.zillow.com/ashburn-va/"},"_name":"Ashburn","_id":"16818","_type":"city"}},"_score":"7.0"}]}}},"_xmlns:xsi":"http://www.w3.org/2001/XMLSchema-instance","_xmlns:Comps":"http://www.zillow.com/static/xsd/Comps.xsd","_xsi:schemaLocation":"http://www.zillow.com/static/xsd/Comps.xsd http://www.zillowstatic.com/vstatic/cea765e/static/xsd/Comps.xsd"}};

module.exports.comps = (event, context, callback) => {
    // create a response
    const response = {
      statusCode: 200,
      headers: {
        "Access-Control-Allow-Origin" : "*", // enable CORS
        "Access-Control-Allow-Credentials" : true // cookies an https
      },
      body: JSON.stringify(compresp),
    };

    callback(null, response);
};