const AssistantV2 = require('ibm-watson/assistant/v2');
const NaturalLanguageUnderstandingV1 = require('ibm-watson/natural-language-understanding/v1');
const { IamAuthenticator } = require('ibm-watson/auth');

const assistant = new AssistantV2({
  version: '2020-04-01',
   authenticator: new IamAuthenticator({
    apikey: `${process.env.WATSON_ASSISTANT_APIKEY}`,
  }),
  serviceUrl: `${process.env.WATSON_ASSISTANT_URL}`,
});

const naturalLanguageUnderstanding = new NaturalLanguageUnderstandingV1({
  version: '2020-08-01',
  authenticator: new IamAuthenticator({
    apikey: `${process.env.NLU_APIKEY}`,
  }),
  serviceUrl: `${process.env.NLU_URL}`,
});

var sessionIdPromise = 
  assistant.createSession({
    assistantId: `${process.env.WATSON_ASSISTANT_ID}`
  })
  .then(res => {
    return res.result.session_id;
  })
  .catch(err => {
    console.log(err);
  });

const sent = 'You, me or nobody is gonna hit as hard as life.';
//send message
sessionIdPromise.then(function(sessionId) {
  assistant.message({
    assistantId: `${process.env.WATSON_ASSISTANT_ID}`,
    sessionId: `${sessionId}`,
    input: {
      'message_type': 'text',
      'text': sent
    }
  })
  .then(res => {
    console.log(JSON.stringify(res.result, null, 2));
  })
  .catch(err => {
    console.log(err);
  });
})

// nlu send text, get keywords
const analyzeParams = {
  'text': sent,
  'features': {
    'keywords': {
      'sentiment': true,
      'emotion': true,
      'limit': 3
    }
  }
};

naturalLanguageUnderstanding.analyze(analyzeParams)
  .then(analysisResults => {
    console.log(JSON.stringify(analysisResults, null, 2));
  })
  .catch(err => {
    console.log('error:', err);
  });

//delete session
/*sessionIdPromise.then(function(sessionId) {
  assistant.deleteSession({
    assistantId: `${process.env.WATSON_ASSISTANT_ID}`,
    sessionId: `${sessionId}`,
  })
  .then(res => {
    console.log(JSON.stringify(res.result, null, 2));
  })
  .catch(err => {
    console.log(err);
  });
})*/