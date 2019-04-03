import React from "react";
import ReactDOM from "react-dom";
import expect from "expect";
import { mount, render } from "enzyme";
import { createShallow } from "@material-ui/core/test-utils";
import sinon from "sinon";
import { Helmet } from "react-helmet";
import Paper from "@material-ui/core/Paper";
import axios from "axios";
import nock from "nock";
import TableRow from "@material-ui/core/TableRow";
import TableHeadEmployee from "../TableHeadEmployees";
import TableToolbarEmployee from "../TableToolbarEmployees";
import AddNewEmployee from "../AddNewEmployee";
import EmployeeList from "../EmployeeList";
// const moment = require("moment");
// import Table from "@material-ui/core/Table";
// import TableBody from "@material-ui/core/TableBody";
// import TableCell from "@material-ui/core/TableCell";
// import IconButton from "@material-ui/core/IconButton";
// import { Icon } from "@material-ui/core";

const host = "http://localhost:3000";

const mockEmployeeData = [
  {
    _id: "5c793b825b9fac072bab18c8",
    department_objectId: {
      _id: "5c6c0f839c84ea3c7194a7dd",
      name: "Coal",
      type: "Minerals",
      createdAt: "2019-02-19T14:15:31.140Z",
      updatedAt: "2019-02-19T14:15:31.140Z",
      __v: 0
    },
    avg_employee_productivity: 2,
    benchmark_employee_productivity: 1,
    date: "2019-03-03T00:00:00.000Z",
    createdAt: "2019-03-01T14:02:42.177Z",
    updatedAt: "2019-03-03T08:48:11.678Z",
    __v: 0
  },
  {
    _id: "5c7937665b9fac072bab18c6",
    department_objectId: {
      _id: "5c651f71ddff9f780e4cdbcd",
      name: "Platinum",
      type: "Precious Metals",
      createdAt: "2019-02-14T07:57:37.736Z",
      updatedAt: "2019-02-28T12:53:50.876Z",
      __v: 0
    },
    avg_employee_productivity: 11,
    benchmark_employee_productivity: 111,
    date: "2019-03-01T13:43:56.249Z",
    createdAt: "2019-03-01T13:45:10.027Z",
    updatedAt: "2019-03-01T13:45:10.027Z",
    __v: 0
  }
];

const departmentListProps = [
  {
    _id: "5c6c0f969c84ea3c7194a7de",
    name: "Ash",
    type: "Industrial Material",
    createdAt: "2019-02-19T14:15:50.690Z",
    updatedAt: "2019-02-19T14:15:50.690Z",
    __v: 0
  },
  {
    _id: "5c6c0f839c84ea3c7194a7dd",
    name: "Coal",
    type: "Minerals",
    createdAt: "2019-02-19T14:15:31.140Z",
    updatedAt: "2019-02-19T14:15:31.140Z",
    __v: 0
  },

  {
    _id: "5c651f44ddff9f780e4cdbcc",
    name: "Steel123",
    type: "Department",
    createdAt: "2019-02-14T07:56:52.310Z",
    updatedAt: "2019-02-27T11:05:55.121Z",
    __v: 0
  }
];

const initialState = {
  totalItemsUnformatted: [],
  totalItemsFormatted: [],
  order: "desc",
  orderBy: "date",
  selected: [],
  page: 0,
  rowsPerPage: 5,
  queryStringFromChild: "",
  columnToQuery: "department_name",
  itemsDateRangePaginated: [],
  totalDateRangeSearchResultParent: [],
  start_date: new Date(),
  end_date: new Date(),
  ifUserSearchedDateRange: false,
  ifUserClickedForCurrentMonth: false,
  currentMonthPaginated: [],
  currentMonthTotal: [],
  currentDatePaginated: [],
  currentDateTotal: [],
  arrowRef: null
};

describe("<EmployeeList />", () => {
  const shallow = createShallow();

  afterEach(() => {
    // if (!nock.isDone()) {
    //   this.test.error(new Error('Not all nock interceptors were used!'));
    nock.cleanAll();
    //   nock.restore();
    // }
  });

  beforeEach(done => {
    if (!nock.isActive()) nock.activate();
    done();
  });

  test("EmployeeList component renders", () => {
    const wrapper = shallow(<EmployeeList />);
    expect(wrapper.exists()).toBe(true);
  });

  it("should renders without crashing", () => {
    const div = document.createElement("div");
    ReactDOM.render(
      <EmployeeList
        allDepartmentsForSiblingCommunication={departmentListProps}
      />,
      div
    );
    ReactDOM.unmountComponentAtNode(div);
  });

  test("renders", () => {
    const wrapper = shallow(
      <EmployeeList
        totalItemsUnformatted={mockEmployeeData}
        allDepartmentsForSiblingCommunication={departmentListProps}
      />
    );

    expect(wrapper).toMatchSnapshot();
  });

  test("returns the default empty array when there is no data to map through or what would happen when I render the component with no data", () => {
    const wrapper = shallow(<EmployeeList />);
    expect(wrapper).toMatchSnapshot();
  });

  test("doesn't break without list of data", () => {
    const wrapper = shallow(<EmployeeList />);
    expect(wrapper.find("li")).toHaveLength(0);
  });

  test("doesn't break with an empty array", () => {
    const wrapper = shallow(<EmployeeList totalItemsUnformatted={[]} />);
    expect(wrapper.find("li")).toHaveLength(0);
  });

  it("should render a placeholder", () => {
    const placeholder_text = "type anything here";
    const wrapper = shallow(<EmployeeList placeholder={placeholder_text} />);
    expect(wrapper.prop("placeholder")).toEqual(placeholder_text);
  });

  it("should render a correct type", () => {
    const type = "password";
    const wrapper = shallow(<EmployeeList type={type} />);
    expect(wrapper.prop("type")).toEqual(type);
  });

  it("renders one <TableHeadEmployee /> components", () => {
    const wrapper = shallow(<EmployeeList />);
    expect(wrapper.dive().find(TableHeadEmployee)).toHaveLength(1);
  });

  it("renders one <TableToolbarEmployee /> components", () => {
    const wrapper = shallow(<EmployeeList />);
    expect(wrapper.dive().find(TableToolbarEmployee)).toHaveLength(1);
  });

  it("renders one <AddNewEmployee /> components", () => {
    const wrapper = shallow(<EmployeeList />);
    expect(wrapper.dive().find(AddNewEmployee)).toHaveLength(1);
  });

  it("renders the Helmet wrapper component", () => {
    const component = shallow(<EmployeeList />);
    const title = component
      .dive()
      .find(Helmet)
      .text();

    expect(title).toBe("<HelmetWrapper />");
  });

  it("should render react-helment title", () => {
    const wrapper = mount(
      <EmployeeList
        allDepartmentsForSiblingCommunication={departmentListProps}
      />
    );
    // this will return all the markup assigned to helmet
    // which will get rendered inside head.
    const helmet = Helmet.peek();
    expect(helmet.title).toBe("MyCompany | Employee!");
    // expect(helmet.metaTags[1].name).toBe("description");
    // expect(helmet.metaTags[2].content).toBe("MyCompany List of Vessel Types!");
    // console.log("HELMET IS ", helmet.content);
  });

  it("calls componentDidMount", () => {
    sinon.spy(EmployeeList.prototype, "componentDidMount");
    const wrapper = mount(
      <EmployeeList
        allDepartmentsForSiblingCommunication={departmentListProps}
      />
    );
    expect(EmployeeList.prototype.componentDidMount).toHaveProperty(
      "callCount",
      1
    );
  });

  it("allows us to set props", () => {
    const wrapper = mount(
      <EmployeeList
        allDepartmentsForSiblingCommunication={departmentListProps}
        bar="baz"
      />
    );
    expect(wrapper.props().bar).toEqual("baz");
    wrapper.setProps({ bar: "foo" });
    expect(wrapper.props().bar).toEqual("foo");
  });

  it("should have the initial state set properly", () => {
    const wrapper = shallow(<EmployeeList />);
    expect(wrapper.dive().state()).toEqual(initialState);
  });

  it("should render correct number of Paper and TableRow MUI component", () => {
    const component = mount(
      <EmployeeList
        allDepartmentsForSiblingCommunication={departmentListProps}
      />
    );
    expect(component.find(Paper)).toHaveLength(2);
    expect(component.find(TableRow)).toHaveLength(3);
  });

  // Test proptypes for allDepartmentsForSiblingCommunication
  it("check the type of allDepartmentsForSiblingCommunication", () => {
    const props = {
      allDepartmentsForSiblingCommunication: [
        {
          _id: "5c6c0f969c84ea3c7194a7de",
          name: "Ash",
          type: "Industrial Material",
          createdAt: "2019-02-19T14:15:50.690Z",
          updatedAt: "2019-02-19T14:15:50.690Z",
          __v: 0
        }
      ]
    };
    const wrapper = mount(<EmployeeList {...props} />);
    expect(wrapper.prop("allDepartmentsForSiblingCommunication")).toHaveLength(
      1
    );
  });

  it("API test-1 - GET (/api/employee)", done => {
    nock(host)
      .defaultReplyHeaders({
        "access-control-allow-origin": "*",
        "Content-Type": "application/json"
      })

      .get("/api/employee")
      .reply(200, "Get data");
    //   .log(console.log);

    axios.get("http://localhost:3000/api/employee").then(response => {
      expect(response.data).toBe("Get data");
      expect(typeof response.data).toBe("string");
      done();
    });
  });
});

/* Shallow tests with 'withStyles' - needed to switch from `shallow` to `mount` since `withStyles` is a higher order component and 'wraps' the other component - (https://github.com/mui-org/material-ui/issues/9266) */
