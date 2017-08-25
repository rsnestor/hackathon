**zillow example search** 
---
http://www.zillow.com/webservice/GetSearchResults.htm?zws-id=X1-ZWz1fy18vhuia3_6v82r&address=9416+Mayflower+Ct&citystatezip=Laurel%2C+MD

- Response needs to be converted to json (see xml2json.js)
- Search results are using **HATEOAS**!  We need to provide links to call the respnse URLs
- Text formatter (for humans) http://www.webtoolkitonline.com/json-formatter.html
