import React from 'react';
import { useRouter } from 'next/router';
import SettingLayout from '@/components/layout/SettingLayout';
import styles from './_style.module.css';
// Translation logic - start
import { GetStaticProps } from 'next';
import { useTranslation } from 'next-i18next';
import { getI18nStaticProps } from '@/utils/services/getI18nStaticProps';
import { height } from '@fortawesome/free-solid-svg-icons/fa0';

export const getStaticProps: GetStaticProps = getI18nStaticProps();

// Translation logic - end

const Reference: React.FC = () => {
  const { t } = useTranslation('common');
  const router = useRouter();
  const { id } = router.query;

  return (
    <SettingLayout>
      <h1 className="mb-3">UI Elements</h1>
      <div className="row white-bg p-1 m-0 top-bottom-shadow pt-3">
        <div className='col-6'>
          <div className="mb-3">
            <h4>Text Box</h4>
          </div>
          <div className="mb-3">
            <label className="form-label">Email</label>
            <input type="email" className="form-control" id="exampleFormControlInput1" placeholder="name@example.com" />
          </div>
          <div className="mb-3">
            <label className="form-label">Description</label>
            <textarea className="form-control" id="exampleFormControlTextarea1"></textarea>
          </div>
          <div className="mb-3">
            <h4 className='pt-3'>File Upload</h4>
          </div>
          <div className="mb-3">
            <label className="form-label">Attachment</label>
            <input className="form-control" type="file" id="formFile" />
          </div>
          <div className="mb-3">
            <h4 className='pt-3'>Type Search</h4>
          </div>
          <div className="mb-3">
            <label className="form-label">Type Search</label>
            <input className="form-control" list="datalistOptions" id="exampleDataList" placeholder="Type to search..." />
              <datalist id="datalistOptions">
                <option value="San Francisco"></option>
                <option value="New York"></option>
                <option value="Seattle"></option>
                <option value="Los Angeles"></option>
                <option value="Chicago"></option>
              </datalist>
          </div>
          <div className="mb-3">
            <h4 className='pt-3'>Checkbox / Radio Button</h4>
          </div>
          <div className="mb-3">
            <label className="form-label">Prefer Communication</label>
            <div className="form-check">
              <input className="form-check-input" type="checkbox" value="" id="flexCheckDefault" checked />
              <label className="form-check-label">
                Email
              </label>
            </div>
            <div className="form-check">
              <input className="form-check-input" type="checkbox" value="" id="flexCheckChecked"  />
              <label className="form-check-label">
              WhatsApp
              </label>
            </div>
            <div className="form-check">
              <input className="form-check-input" type="checkbox" value="" id="flexCheckIndeterminateDisabled" disabled />
              <label className="form-check-label">
                Postal
              </label>
            </div>
          </div>
          <div className="mb-3">
            <label className="form-label">GDPR Guidelines</label>
            <div className="form-check form-switch">
              <input className="form-check-input" type="checkbox" role="switch" id="flexSwitchCheckDefault" />
              <label className="form-check-label">Agree </label>
            </div>
          </div>
          <div className="mb-3">
            <h4 className='pt-3'>Range Selector</h4>
          </div>
          <div className="mb-3">
            <label className="form-label">Range</label>
            <input type="range" className="form-range" id="customRange1"></input>
          </div>   
          <div className="mb-3">
            <h4 className='pt-3'>Input Group</h4>
          </div>       
          <div className="mb-3">
            <label className="form-label">Email</label>
            <div className="input-group mb-3">
              <input type="text" className="form-control" aria-label="Recipient's username" aria-describedby="basic-addon2" />
              <span className="input-group-text" id="basic-addon2">@acumensoftwares.com</span>
            </div>
          </div>
          <div className="mb-3">
            <h4 className='pt-3'>Floating Labels</h4>
          </div>
          <div className="mb-3">
            <div className="form-floating mb-3">
              <input type="text" className="form-control" id="floatingInput" placeholder="cross road" />
              <label>Address</label>
            </div>
          </div>
          <div className="mb-3">
            <div className="form-floating">
              <textarea className="form-control" placeholder="Leave a comment here" id="floatingTextarea2" ></textarea>
              <label>Comments</label>
            </div>
          </div>
          <div className="mb-3">
            <h4 className='pt-3'>Accordion</h4>
          </div>
          <div className="mb-3">
            <div className="accordion" id="accordionExample">
              <div className="accordion-item">
                <h2 className="accordion-header" id="headingOne">
                  <button className="accordion-button" type="button" data-bs-toggle="collapse" data-bs-target="#collapseOne" aria-expanded="true" aria-controls="collapseOne">
                    Accordion Item #1
                  </button>
                </h2>
                <div id="collapseOne" className="accordion-collapse collapse show" aria-labelledby="headingOne" data-bs-parent="#accordionExample">
                  <div className="accordion-body">
                    <strong>This is the first item's accordion body.</strong> 
                  </div>
                </div>
              </div>
              <div className="accordion-item">
                <h2 className="accordion-header" id="headingTwo">
                  <button className="accordion-button collapsed" type="button" data-bs-toggle="collapse" data-bs-target="#collapseTwo" aria-expanded="false" aria-controls="collapseTwo">
                    Accordion Item #2
                  </button>
                </h2>
                <div id="collapseTwo" className="accordion-collapse collapse" aria-labelledby="headingTwo" data-bs-parent="#accordionExample">
                  <div className="accordion-body">
                    <strong>This is the second item's accordion body.</strong>
                  </div>
                </div>
              </div>
              <div className="accordion-item">
                <h2 className="accordion-header" id="headingThree">
                  <button className="accordion-button collapsed" type="button" data-bs-toggle="collapse" data-bs-target="#collapseThree" aria-expanded="false" aria-controls="collapseThree">
                    Accordion Item #3
                  </button>
                </h2>
                <div id="collapseThree" className="accordion-collapse collapse" aria-labelledby="headingThree" data-bs-parent="#accordionExample">
                  <div className="accordion-body">
                    <strong>This is the third item's accordion body.</strong>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div className='col-6'>
          <div className="mb-3 row">
            <label className="col-sm-4 col-form-label">Name</label>
            <div className="col-sm-8">
              <input type="text" className="form-control" id="name" />
            </div>
          </div>
          <div className="mb-3 row">
            <label className="col-sm-4 col-form-label">Password</label>
            <div className="col-sm-8">
              <input type="password" className="form-control" id="inputPassword" />
            </div>
          </div>
          <div className="mb-3 row">
            <label className="col-sm-4 col-form-label">Email</label>
            <div className="col-sm-8">
              <input type="text" className="form-control" id="staticEmail" value="email@example.com" disabled />
            </div>
          </div>
          
          <div className="mb-3 row">
            <label className="col-sm-4 col-form-label">Gender</label>
            <div className="col-sm-8">
              <select className="form-select rounded-0">
                <option selected>Select</option>
                <option value="1">Male</option>
                <option value="2">Female</option>
                <option value="3">Others</option>
              </select>
            </div>
          </div>
          <div className="mb-3 row">
            <label className="col-sm-4 col-form-label">Account</label>
            <div className="col-sm-8">
              <select className="form-select rounded-0" disabled>
                <option>Select</option>
                <option value="1" selected>Premium</option>
                <option value="2">Female</option>
                <option value="3">Others</option>
              </select>
            </div>
          </div>
          <div className="mb-3 row">
            <label className="col-sm-4 col-form-label">Role</label>
            <div className="col-sm-8 pt-1">
              <div className="form-check form-check-inline">
                <input className="form-check-input" type="radio" name="inlineRadioOptions" id="inlineRadio1" value="option1" />
                <label className="form-check-label">Member</label>
              </div>
              <div className="form-check form-check-inline">
                <input className="form-check-input" type="radio" name="inlineRadioOptions" id="inlineRadio2" value="option2" />
                <label className="form-check-label">Accountant</label>
              </div>
              <div className="form-check form-check-inline">
                <input className="form-check-input" type="radio" name="inlineRadioOptions" id="inlineRadio3" value="option3" disabled />
                <label className="form-check-label">Admin</label>
              </div>
            </div>
            <div className="mb-3 row pt-1">
              <label className="col-sm-4 col-form-label">Username</label>
              <div className="col-sm-8 ps-4">
                <div className="input-group mb-3">
                  <span className="input-group-text rounded-0" id="basic-addon1">@</span>
                  <input type="text" className="form-control" placeholder="Username" aria-label="Username" aria-describedby="basic-addon1" />
                </div>
              </div>
            </div>
            <div className="mb-3 row">
              <h4 className='pt-3'>Color Picker</h4>
            </div>
            <div className="mb-3 row">
              <label className="col-sm-4 col-form-label">Color picker</label>            
              <input type="color" className="form-control form-control-color ms-3" id="exampleColorInput" value="#563d7c" title="Choose your color"></input>
            </div>
            <div className="mb-3 row">
              <h4 className='pt-3'>Buttons</h4>
            </div>
            <div className="mb-3 row">
              <div className='col-12'>
                <button type="button" className="btn btn-primary me-1 col-3 rounded-0">Primary</button>
                <button type="button" className="btn btn-secondary me-1 col-3 rounded-0">Secondary</button>
                <button type="button" className="btn btn-success me-1 col-3 rounded-0">Success</button>
                <button type="button" className="btn btn-danger me-1 col-3 mt-1 rounded-0">Danger</button>
                <button type="button" className="btn btn-warning me-1 col-3 mt-1 rounded-0">Warning</button>
                <button type="button" className="btn btn-info me-1 col-3 mt-1 rounded-0">Info</button>
                <button type="button" className="btn btn-dark me-1 col-3 mt-1 rounded-0">Dark</button>
              </div>
            </div>
            <div className="mb-3 row">
              <h4 className='pt-3'>Outline Buttons</h4>
            </div>
            <div className="mb-3 row">
              <div className='col-12'>
                <button type="button" className="btn btn-outline-primary me-1 col-3 rounded-0">Primary</button>
                <button type="button" className="btn btn-outline-secondary me-1 col-3 rounded-0">Secondary</button>
                <button type="button" className="btn btn-outline-success me-1 col-3 rounded-0">Success</button>
                <button type="button" className="btn btn-outline-danger me-1 col-3 mt-1 rounded-0">Danger</button>
                <button type="button" className="btn btn-outline-warning me-1 col-3 mt-1 rounded-0">Warning</button>
                <button type="button" className="btn btn-outline-info me-1 col-3 mt-1 rounded-0">Info</button>
                <button type="button" className="btn btn-outline-dark me-1 col-3 mt-1 rounded-0">Dark</button>
              </div>
            </div>
            <div className="mb-3 row">
              <h4 className='pt-3'>Dropdown</h4>
            </div>
            <div className="mb-3 row">
              <div className='col-12'>
                <div className="btn-group col-4">
                  <button type="button" className="btn btn-primary dropdown-toggle rounded-0" data-bs-toggle="dropdown" aria-expanded="false">
                    Action
                  </button>
                  <ul className="dropdown-menu">
                    <li><a className="dropdown-item" href="#">Action</a></li>
                    <li><a className="dropdown-item" href="#">Another action</a></li>
                    <li><a className="dropdown-item" href="#">Something else here</a></li>
                    <li><hr className="dropdown-divider" /></li>
                    <li><a className="dropdown-item" href="#">Separated link</a></li>
                  </ul>
                </div>
              </div>
            </div>
            <div className="mb-3 row">
              <h4 className='pt-3'>Card</h4>
            </div>
            <div className="mb-3 row">
              <div className='col-12'>
                <div className="card rounded-0">
                  <img src="https://acumensoftwares.com/img/vard-logo.png" className="card-img-top" alt="..." />
                  <div className="card-body">
                    <h5 className="card-title">Card title</h5>
                    <p className="card-text">Some quick example text to build on the card title and make up the bulk of the card's content.</p>
                    <a href="#" className="btn btn-dark rounded-0">Go somewhere</a>
                  </div>
                </div>
              </div>
            </div>

          </div>
        </div>        
      </div>
    </SettingLayout>
  );
};

export default Reference;
