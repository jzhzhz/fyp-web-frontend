import nock from 'nock';

export const doHomeRelatedNocks = () => {
  nock("http://localhost:10480/csWeb")
  .get("/getAllEvents")
  .reply(
    200,
    {
      code: 0,
      data: []
    },
    { 
      'Access-Control-Allow-Origin': '*', 
      'Content-type': 'application/json' 
    }
  );

  nock("http://localhost:10480/csWeb")
    .get("/getAllCards")
    .reply(
      200,
      {
        code: 0,
        data: []
      },
      { 
        'Access-Control-Allow-Origin': '*', 
        'Content-type': 'application/json' 
      }
    );

  nock("http://localhost:10480/csWeb")
    .get("/getHomeTextBlockByType?type=sidebar")
    .reply(
      200,
      {
        code: 0,
        data: []
      },
      { 
        'Access-Control-Allow-Origin': '*', 
        'Content-type': 'application/json' 
      }
    );

  nock("http://localhost:10480/csWeb")
    .get("/getHomeTextBlockByType?type=headline")
    .reply(
      200,
      {
        code: 0,
        data: []
      },
      { 
        'Access-Control-Allow-Origin': '*', 
        'Content-type': 'application/json' 
      }
    );

  nock("http://localhost:10480/csWeb")
    .get("/getHomeTextBlockByType?type=sidebar")
    .reply(
      200,
      {
        code: 0,
        data: []
      },
      { 
        'Access-Control-Allow-Origin': '*', 
        'Content-type': 'application/json' 
      }
    );

  nock("http://localhost:10480/csWeb")
    .get("/getHomeTextBlockByType?type=jumbo")
    .reply(
      200,
      {
        code: 0,
        data: []
      },
      { 
        'Access-Control-Allow-Origin': '*', 
        'Content-type': 'application/json' 
      }
    );

  nock("http://localhost:10480/csWeb")
    .get("/getLabels?labelType=about")
    .reply(
      200,
      {
        code: 0,
        data: []
      },
      { 
        'Access-Control-Allow-Origin': '*', 
        'Content-type': 'application/json' 
      }
    );

  nock("http://localhost:10480/csWeb")
  .get("/getLabels?labelType=academics")
  .reply(
    200,
    {
      code: 0,
      data: []
    },
    { 
      'Access-Control-Allow-Origin': '*', 
      'Content-type': 'application/json' 
    }
  );

  nock("http://localhost:10480/csWeb")
  .get("/getLabels?labelType=admissions")
  .reply(
    200,
    {
      code: 0,
      data: []
    },
    { 
      'Access-Control-Allow-Origin': '*', 
      'Content-type': 'application/json' 
    }
  );

  return;
}