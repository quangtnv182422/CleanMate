import React, { useState } from 'react'
import SimpleReactValidator from 'simple-react-validator';


const AppointmentS2 = () => {


    const [forms, setForms] = useState({
        name: '',
        email: '',
        subject: '',
        phone: '',
        approx: '',
        bedrooms: '',
        bathrooms: '',
        zCode: '',
        message: ''
    });
    const [validator] = useState(new SimpleReactValidator({
        className: 'errorMessage'
    }));
    const changeHandler = e => {
        setForms({ ...forms, [e.target.name]: e.target.value })
        if (validator.allValid()) {
            validator.hideMessages();
        } else {
            validator.showMessages();
        }
    };

    const submitHandler = e => {
        e.preventDefault();
        if (validator.allValid()) {
            validator.hideMessages();
            setForms({
                name: '',
                email: '',
                subject: '',
                phone: '',
                approx: '',
                bedrooms: '',
                bathrooms: '',
                zCode: '',
                message: ''
            })
        } else {
            validator.showMessages();
        }
    };
    return (
        <section className="wpo-contact-section-s2 section-padding">
            <div className="container">
                <div className="wpo-contact-section-wrapper">
                    <div className="row align-items-center justify-content-center">
                        <div className="col-lg-8 col-md-12 col-12">
                            <div className="wpo-contact-form-area">
                                <div className="wpo-section-title">
                                    <h2>Make An Appointment</h2>
                                </div>
                                <form onSubmit={(e) => submitHandler(e)} className="contact-validation-active" >
                                    <div className="row">
                                        <div className="col col-lg-6 col-12">
                                            <div className="form-field">
                                                <input
                                                    className="form-control"
                                                    value={forms.name}
                                                    type="text"
                                                    name="name"
                                                    onBlur={(e) => changeHandler(e)}
                                                    onChange={(e) => changeHandler(e)}
                                                    placeholder="Your Name" />
                                            </div>
                                            {validator.message('name', forms.name, 'required|alpha_space')}
                                        </div>
                                        <div className="col col-lg-6 col-12">
                                            <div className="form-field">
                                                <input
                                                    className="form-control"
                                                    value={forms.email}
                                                    type="email"
                                                    name="email"
                                                    onBlur={(e) => changeHandler(e)}
                                                    onChange={(e) => changeHandler(e)}
                                                    placeholder="Your Email" />
                                                {validator.message('email', forms.email, 'required|email')}
                                            </div>
                                        </div>
                                        <div className="col col-lg-6 col-12">
                                            <div className="form-field">
                                                <select
                                                    className="form-control"
                                                    onBlur={(e) => changeHandler(e)}
                                                    onChange={(e) => changeHandler(e)}
                                                    value={forms.subject}
                                                    type="text"
                                                    name="subject">
                                                    <option>Choose a Service</option>
                                                    <option>Residential Cleaning</option>
                                                    <option>Commercial Cleaning</option>
                                                    <option>Office Cleaning</option>
                                                    <option>Home Cleaning</option>
                                                    <option>Shop Cleaning</option>
                                                    <option>Road Cleaning</option>
                                                    <option>car Cleaning</option>
                                                </select>
                                                {validator.message('subject', forms.subject, 'required')}
                                            </div>
                                        </div>
                                        <div className="col col-lg-6 col-12">
                                            <div className="form-field">
                                                <select
                                                    className="form-control"
                                                    onBlur={(e) => changeHandler(e)}
                                                    onChange={(e) => changeHandler(e)}
                                                    value={forms.approx}
                                                    type="text"
                                                    name="approx">
                                                    <option>-- Approx SF --</option>
                                                    <option>800</option>
                                                    <option>700</option>
                                                    <option>900</option>
                                                    <option>500</option>
                                                    <option>300</option>
                                                </select>
                                                {validator.message('approx', forms.approx, 'required')}
                                            </div>
                                        </div>
                                        <div className="col col-lg-6 col-12">
                                            <div className="form-field">
                                                <select
                                                    className="form-control"
                                                    onBlur={(e) => changeHandler(e)}
                                                    onChange={(e) => changeHandler(e)}
                                                    value={forms.bedrooms}
                                                    type="text"
                                                    name="bedrooms">
                                                    <option>Bedrooms</option>
                                                    <option>Residential</option>
                                                    <option>Commercial</option>
                                                    <option>Apartment</option>
                                                </select>
                                                {validator.message('bedrooms', forms.bedrooms, 'required')}
                                            </div>
                                        </div>
                                        <div className="col col-lg-6 col-12">
                                            <div className="form-field">
                                                <select
                                                    className="form-control"
                                                    onBlur={(e) => changeHandler(e)}
                                                    onChange={(e) => changeHandler(e)}
                                                    value={forms.bathrooms}
                                                    type="text"
                                                    name="bathrooms">
                                                    <option>Bathrooms</option>
                                                    <option>Residential</option>
                                                    <option>Commercial</option>
                                                    <option>Apartment</option>
                                                </select>
                                                {validator.message('bathrooms', forms.bathrooms, 'required')}
                                            </div>
                                        </div>
                                        <div className="col col-lg-6 col-12">
                                            <div className="form-field">
                                                <input
                                                    className="form-control"
                                                    value={forms.phone}
                                                    type="phone"
                                                    name="phone"
                                                    onBlur={(e) => changeHandler(e)}
                                                    onChange={(e) => changeHandler(e)}
                                                    placeholder="Your phone" />
                                                {validator.message('phone', forms.phone, 'required|phone')}
                                            </div>
                                        </div>
                                        <div className="col col-lg-6 col-12">
                                            <div className="form-field">
                                                <input
                                                    className="form-control"
                                                    onBlur={(e) => changeHandler(e)}
                                                    onChange={(e) => changeHandler(e)}
                                                    value={forms.zCode}
                                                    type="text"
                                                    name="zCode"
                                                    placeholder="Zip Code" />
                                            </div>
                                            {validator.message('Zip Code', forms.zCode, 'required')}
                                        </div>
                                        <div className="col fullwidth col-lg-12 ">
                                            <textarea
                                                className="form-control"
                                                onBlur={(e) => changeHandler(e)}
                                                onChange={(e) => changeHandler(e)}
                                                value={forms.message}
                                                type="text"
                                                name="message"
                                                placeholder="Message">
                                            </textarea>
                                            {validator.message('message', forms.message, 'required')}
                                        </div>
                                    </div>
                                    <div className="submit-area">
                                        <button type="submit" className="theme-btn"><i className="fa fa-angle-double-right"
                                            aria-hidden="true"></i> Submit Now</button>
                                    </div>
                                </form>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    )
}

export default AppointmentS2;