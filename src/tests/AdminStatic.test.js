import React from "react";
import { render, cleanup, fireEvent } from "@testing-library/react";

import { AdminMain } from '../pages/admin/AdminMain';

afterEach(cleanup);

describe("main page elements render test", () => {
  test("it should render all the options in the page", () => {
    const { getByText } = render(<AdminMain />);

    fireEvent.click(getByText("logout"));

    expect(getByText("Settings")).toBeInTheDocument();
    expect(getByText("Utilities")).toBeInTheDocument();
    expect(getByText("Navigation")).toBeInTheDocument();
  })
})