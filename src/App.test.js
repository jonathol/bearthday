import { render, screen } from '@testing-library/react';
import {App, DayForm} from './App.js';
import { shallow } from 'enzyme';
import banner from './banner.png';


it("renders without crashing", () => {
  shallow(<App />);
});

it("renders header", () => {
  const wrapper = shallow(<App />);
  const header = <div className="BearthdayHeader">
        <img src={banner} alt="banner" className="BearthdayHeaderImg"/>
        Happy Bearthday!
        <img src={banner} alt="banner" className="BearthdayHeaderImg"/>
      </div>;
  expect(wrapper.contains(header)).toEqual(true);
});

it("renders form without crashing", () => {
	shallow(<DayForm />);  
});

it("renders form", () => {
  const wrapper = shallow(<DayForm />);
  const header = <label className="DayInputLabel">
            Birthday:        
          </label>;
  expect(wrapper.contains(header)).toEqual(true);
});