import React from "react";
import { render, cleanup } from "@testing-library/react";
import nock from 'nock'

import AdminStaff from '../pages/people/AdminStaff';
import Faculty from '../pages/people/Faculty';
import ResearchStaff from '../pages/people/ResearchStaff';

/** disable network utilities and intercept requests */
beforeAll(() => {
  nock.disableNetConnect();

  nock("http://localhost:10480/csWeb")
    .defaultReplyHeaders({ 'access-control-allow-origin': '*' })
    .get("/getFacultyByType?type=regular")
    .reply(200, {
      code: 0,
      data: []
    });

  nock("http://localhost:10480/csWeb")
    .defaultReplyHeaders({ 'access-control-allow-origin': '*' })
    .get("/getFacultyByType?type=admin")
    .reply(200, {
      code: 0,
      data: []
    });

  nock("http://localhost:10480/csWeb")
    .defaultReplyHeaders({ 'access-control-allow-origin': '*' })
    .get("/getFacultyByType?type=research")
    .reply(200, {
      code: 0,
      data: []
    });
});


afterEach(cleanup);

/** restore network utilities */
afterAll(() => {
  nock.enableNetConnect();
});

describe("people pages components render test", () => {
  test("it should render faculty components", () => {
    const { getByText } = render(<Faculty />);

    expect(getByText("Faculty")).toBeInTheDocument();
  });

  test("it should render administrative staff components", () => {
    const { getByText } = render(<AdminStaff />);

    expect(getByText("Administrative Staff")).toBeInTheDocument();
  });

  test("it should render research staff components", () => {
    const { getByText } = render(<ResearchStaff />);

    expect(getByText("Research Staff")).toBeInTheDocument();
  });
});