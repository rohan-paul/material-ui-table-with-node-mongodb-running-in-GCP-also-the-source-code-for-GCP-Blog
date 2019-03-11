import React, { Component } from "react";
import { Route, BrowserRouter, Switch, Router } from "react-router-dom";
import EmployeeList from "./Components/Employee/EmployeeList";
import DepartmentList from "./Components/Department/DepartmentList";
import NotFound from "./Components/NotFound";

class Routes extends Component {
  render() {
    return (
      <BrowserRouter>
        <div>
          <Switch>
            <Route exact exact path={"/"} component={EmployeeList} />
            <Route
              exact
              path="/department"
              render={props => (
                <DepartmentList
                  {...props}
                  setDepartmentForSiblingCommunication={
                    this.setDepartmentForSiblingCommunication
                  }
                />
              )}
            />
            <Route component={NotFound} />
          </Switch>
        </div>
      </BrowserRouter>
    );
  }
}

export default Routes;
