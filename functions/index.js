'use strict';

const functions = require('firebase-functions'); // Cloud Functions for Firebase library
const DialogflowApp = require('actions-on-google').DialogflowApp; // Google Assistant helper library
const requestHTTP = require('request');
var smeName = "";
var knowledgeLink = "";
var productData = "";
var speechResponse = "default";
var textResponse = "default";

exports.dialogflowFirebaseFulfillment = functions.https.onRequest((request, response) => {
  
  
  var vccIssue = "";
  var vonecIssue = "";
  var vonemIssue = "";
  var vmaIssue = "";
  var product = "default";

  
  if (request.body.result.parameters){
      vccIssue = request.body.result.parameters.vccIssues;
      vonecIssue = request.body.result.parameters.vonecIssues;
      vonemIssue = request.body.result.parameters.vonemIssues;
      vmaIssue = request.body.result.parameters.vmaIssues;
  }
  
  if(vccIssue){
      console.log("VCC ISSUES");
      console.log(vccIssue);
      product = "VCC";
        generateResponse(product, vccIssue, function(err, respo){
              textResponse = respo.value1;
              speechResponse = respo.value2;
        });
      helloHttp(textResponse, speechResponse, response);
  }
  if(vonecIssue){
      console.log("VONEC ISSUES");
      console.log(vonecIssue);
      product = "VONE-C";
      generateResponse(product, vccIssue, function(err, respo){
              textResponse = respo.value1;
              speechResponse = respo.value2;
        });
      helloHttp(textResponse, speechResponse, response);
  }
  if(vonemIssue){
      console.log("VONEM ISSUES");
      console.log(vonemIssue);
      product = "VONE-M";
      generateResponse(product, vccIssue, function(err, respo){
              textResponse = respo.value1;
              speechResponse = respo.value2;
        });
      helloHttp(textResponse, speechResponse, response);
  }
  if(vmaIssue){
      console.log("VMA ISSUES");
      console.log(vmaIssue);
      product = "VMA";
      generateResponse(product, vccIssue, function(err, respo){
              textResponse = respo.value1;
              speechResponse = respo.value2;
        });
      helloHttp(textResponse, speechResponse, response);
  }   



});

/*
* Function to handle v1 webhook requests from Dialogflow
*/
 function helloHttp (textR, speechR, res) {
  var defaultResponse = "This is the default message for the webhook"; //Default response from the webhook to show it's working
  res.setHeader('Content-Type', 'application/json'); //Requires application/json MIME type
  res.send(JSON.stringify({ "speech": speechR, "displayText": textR 
  //"speech" is the spoken version of the response, "displayText" is the visual version
  }));
}



function generateResponse (productName, productIssue, callback){
  var data = require('./products.json');
  for(var i = 0; i < data.product.length; i++){
            if(data.product[i].name == productName) {
              smeName = data.product[i].sme;
              if(data.product[i].hasOwnProperty(productIssue)){
                var callbackSet = {};
                knowledgeLink = data.product[i][productIssue];
                callbackSet.value1 = "OK, here is a link that may help you with this issue" +knowledgeLink+ ", if you need more help you can try " +smeName+ ". I hope this helps!";
                callbackSet.value2 = "OK, I think the best thing to do here would be to speak with " +smeName+ ", he knows a bit more about this than me"; 
                callback(null, callbackSet);          
              }
            }
    }
}