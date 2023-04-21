import React from 'react';
import ReactDOM from 'react-dom';
import { BrowserRouter as Router, Route, Redirect, Switch } from 'react-router-dom';

import './style.css';
import FirstPage from './views/first-page';
import DoctorDashboard from './views/doctor-dashboard';
import PatientDashboard from './views/patient-dashboard';
import MedicalAssistance from './views/medical-assistance';
import PatientMedicalAssistance from './views/patient-medical-assistance';
import PatientHistory from './views/patient-history';
import DoctorHistory from './views/doctor-history';
import DoctorFunds from './views/doctor-funds';
import PatientFunds from './views/patient-funds';
import NavigationButtons from './navigationbuttons';

const App = () => {
  return (
    <Router>
      <div>
        <NavigationButtons />
        <Switch>
          <Route exact path="/" render={() => <Redirect to="/first-page" />} />
          <Route component={FirstPage} exact path="/first-page" />
          <Route component={DoctorDashboard} exact path="/doctor-dashboard" />
          <Route component={PatientDashboard} exact path="/patient-dashboard" />
          <Route component={MedicalAssistance} exact path="/medical-assistance" />
          <Route
            component={PatientMedicalAssistance}
            exact
            path="/patient-medical-assistance"
          />
          <Route component={PatientHistory} exact path="/patient-history" />
          <Route component={DoctorHistory} exact path="/doctor-history" />
          <Route component={DoctorFunds} exact path="/doctor-funds" />
          <Route component={PatientFunds} exact path="/patient-funds" />
        </Switch>
      </div>
    </Router>
  );
};

ReactDOM.render(<App />, document.getElementById('app'));
