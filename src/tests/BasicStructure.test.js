import React from "react";
import { render, cleanup, fireEvent } from "@testing-library/react";
import * as NockUtils from './utils/NockUtils';
import nock from 'nock';

import App from "../App";
import Login from "../pages/Login";
import { NoMatch } from "../NoMatch";
import { Research } from "../pages/Research";

beforeAll(() => {
  nock.disableNetConnect();
  NockUtils.doHomeRelatedNocks();
})


afterEach(cleanup);

afterAll(() => {
  nock.enableNetConnect();
})

describe("basic pages' strucutre test", () => {
  test("should basic home components are correctly rendered", () => {

    const { getByText, getByTestId } = render(<App />);

    const navbarComponent = getByTestId("navbar-test");
    expect(navbarComponent).toBeInTheDocument();

    // check static navbar label
    expect(getByText("Home")).toBeInTheDocument();

    // check footer span
    expect(getByText("© Xiamen University Malaysia, Selangor, Malaysia."))
      .toBeInTheDocument();
  });

  test("should login page correctly rendered", () => {
    const { getByText } = render(<Login />);

    fireEvent.click(getByText("show password"));

    expect(getByText("Admin Login")).toBeInTheDocument();
  });

  test("should 404 page correctly rendered", () => {
    const { getByText } = render(<NoMatch />);

    expect(getByText("404 Not Found")).toBeInTheDocument();
  });

  test("should static research page rendered", () => {
    const { getByText } = render(<Research />);

    expect(getByText("Research")).toBeInTheDocument();
  })
});
